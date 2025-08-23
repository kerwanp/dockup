import Dockerode from "dockerode";
import { Service } from "../services/service.js";
import { PassThrough, Writable } from "node:stream";
import { defu } from "defu";
import InvalidOptionsException from "../exceptions/invalid_options_exception.js";
import { pipeline } from "node:stream/promises";

export class ContainerService extends Service {
  kind = "container";

  docker: Dockerode;

  shell: string[] = ["/bin/sh"];

  container?: Dockerode.Container;

  options: Dockerode.ContainerCreateOptions = {};

  constructor(service: string, name: string, docker: Dockerode) {
    super(service, name);
    this.docker = docker;
  }

  async init() {
    this.updateStatus("initializing");

    try {
      this.container = await this.getContainer();
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async start(): Promise<void> {
    this.updateStatus("starting");

    try {
      const container = await this.getContainer();
      await this.attachStream();
      await container.start();
      this.updateStatus("running");
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("container already started")
      ) {
        this.updateStatus("running");
        await this.attachStream();
        return;
      }

      this.updateStatus("failed", e);
    }
  }

  async stop(): Promise<void> {
    this.updateStatus("stopping");
    try {
      const container = await this.getContainer();
      await container.stop();
      this.updateStatus("stopped");
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async restart(): Promise<void> {
    this.updateStatus("restarting");

    try {
      const container = await this.getContainer();
      await container.restart();
      await this.attachStream();
      this.updateStatus("running");
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async remove(): Promise<void> {
    const container = await this.getContainer();
    const info = await container.inspect();

    await container.remove();

    if (info.HostConfig.Mounts) {
      for (const mount of info.HostConfig.Mounts) {
        const volume = this.docker.getVolume(mount.Source);
        await volume.remove({ force: true });
      }
    }
  }

  async connect(): Promise<void> {
    const container = await this.getContainer();

    const exec = await container.exec({
      Cmd: this.shell,
      AttachStdin: true,
      AttachStderr: true,
      AttachStdout: true,
      Tty: true,
    });

    const stream = await exec.start({ stdin: true });

    console.clear();
    process.stdin.setRawMode(true);
    process.stdin.pipe(stream);
    this.docker.modem.demuxStream(stream, process.stdout, process.stderr);

    await new Promise<void>((res) => {
      stream.on("end", res);
    });

    process.stdin.setRawMode(false);
    process.stdin.resume();
  }

  /**
   * Attaches container logs stream to service logs.
   */
  protected async attachStream() {
    const container = await this.getContainer();
    const stream = await container.attach({
      stream: true,
      stdout: true,
      stderr: true,
      stdin: false,
    });

    const stdout = new PassThrough();
    const stderr = new PassThrough();

    container.modem.demuxStream(stream, stdout, stderr);

    stdout.pipe(this.logs);
    stderr.pipe(this.logs);
  }

  /**
   * Retrieves the container by reusing existing or creating one.
   */
  protected async getContainer() {
    if (this.container) return this.container;

    const container = await this.retrieveExistingContainer();

    if (container) {
      this.container = container;
      return container;
    }

    this.container = await this.createContainer();

    return this.container;
  }

  /**
   * Creates the container.
   * The image is pulled automatically.
   */
  protected async createContainer() {
    await this.pullImage();
    return this.docker.createContainer(this.options);
  }

  protected async retrieveExistingContainer() {
    if (!this.options.name) {
      throw new InvalidOptionsException(
        `${this.name} container`,
        "name",
        "string",
        typeof this.options.name,
      );
    }

    const [container] = await this.docker.listContainers({
      all: true,
      filters: {
        name: [this.options.name],
      },
    });

    if (!container) return;

    return this.docker.getContainer(container.Id);
  }

  /**
   * Pulls the container image.
   *
   * TODO: We might want to check if the image is already present.
   */
  async pullImage() {
    if (!this.options.Image) throw new Error("Image is mandatory");

    const consumeStream = new Writable({
      write(_chunk, _encoding, callback) {
        // Just consume without doing anything
        callback();
      },
    });

    const stream = await this.docker.pull(this.options.Image);

    await pipeline(stream, consumeStream);
  }

  /**
   * Merges container creation options.
   *
   * @param options - container creation options
   */
  with(options: Dockerode.ContainerCreateOptions) {
    this.options = defu(this.options, options);
    return this;
  }

  /**
   * Sets the container name.
   *
   * @param name - container name
   */
  withName(name: string) {
    this.options.name = name;
    return this;
  }

  /**
   * Sets the container Cmd.
   *
   * @param cmd - container cmd
   */
  withCmd(cmd: string[]) {
    return this.with({
      Cmd: cmd,
    });
  }

  /**
   * Sets the container shell used by the connect feature.
   *
   * @param shell - shell cmd
   */
  withShell(shell: string[]) {
    this.shell = shell;
    return this;
  }

  /**
   * Sets the container image.
   *
   * @param image - image name
   */
  withImage(image: string) {
    return this.with({
      Image: image,
    });
  }

  /**
   * Exposes a container port to your machine.
   *
   * @param port - port on the container
   * @param targetPort - port on the host
   * @param protocol - port protocol
   */
  withPort(port: number, targetPort?: number, protocol = "tcp") {
    this.options.ExposedPorts = {
      ...(this.options.ExposedPorts ?? {}),
      [`${port}/${protocol}`]: {},
    };

    this.options.HostConfig = {
      ...(this.options.HostConfig ?? {}),
      PortBindings: {
        ...(this.options.HostConfig?.PortBindings ?? {}),
        [`${port}/${protocol}`]: [
          {
            HostPort: (targetPort ?? port).toString(),
          },
        ],
      },
    };

    return this;
  }

  /**
   * Adds an environment variable to the container.
   *
   * @param key - the variable key
   * @param value - the variable value
   */
  withEnv(key: string, value: string) {
    return this.with({
      Env: [`${key}=${value}`],
    });
  }

  /**
   * Attaches a volume to the container.
   *
   * @param name - volume name
   * @param path - path in the container
   */
  withVolumeMount(name: string, path: string) {
    return this.with({
      HostConfig: {
        Mounts: [
          {
            Target: path,
            Source: `${this.options.name}_${name}`,
            Type: "volume",
          },
        ],
      },
    });
  }
}
