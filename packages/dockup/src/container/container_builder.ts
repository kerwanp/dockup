import Dockerode from "dockerode";
import { Writable } from "node:stream";
import { pipeline } from "node:stream/promises";

export class ContainerBuilder {
  docker: Dockerode;
  options: Dockerode.ContainerCreateOptions = {};

  constructor(docker: Dockerode) {
    this.docker = docker;
  }

  withName(name: string) {
    this.options.name = name;
    return this;
  }

  withImage(image: string) {
    this.options.Image = image;
    return this;
  }

  withEnv(key: string, value: string) {
    this.options.Env = [...(this.options.Env ?? []), `${key}=${value}`];
    return this;
  }

  withPort(port: number, targetPort = port, protocol = "tcp") {
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

  async build(): Promise<Dockerode.Container> {
    const existing = await this.getExisting();

    if (existing) return existing;

    await this.pull();

    return this.docker.createContainer(this.options);
  }

  async pull() {
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

  async getExisting() {
    if (!this.options.name) throw new Error("Name is mandatory");

    const existing = await this.docker.listContainers({
      all: true,
      filters: {
        name: [this.options.name],
      },
    });

    if (existing.length <= 0) return;

    return this.docker.getContainer(existing[0].Id);
  }
}
