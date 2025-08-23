import Dockerode from "dockerode";
import { Service } from "../services/service.js";
import { ContainerBuilder } from "./container_builder.js";
import { PassThrough } from "node:stream";

export class ContainerService extends Service {
  kind = "container";

  builder: ContainerBuilder;
  docker: Dockerode;

  container?: Dockerode.Container;

  constructor(service: string, name: string, builder: ContainerBuilder) {
    super(service, name);
    this.docker = builder.docker;
    this.builder = builder;
  }

  async init() {
    this.updateStatus("initializing");

    try {
      this.container = await this.builder.build();
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async start(): Promise<void> {
    this.updateStatus("starting");

    try {
      await this.attachStream();
      await this.container!.start();
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
      await this.container!.stop();
      this.updateStatus("stopped");
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async restart(): Promise<void> {
    this.updateStatus("restarting");
    try {
      await this.container?.restart();
      await this.attachStream();
      this.updateStatus("running");
    } catch (e) {
      this.updateStatus("failed", e);
    }
  }

  async remove(): Promise<void> {
    await this.init();
    const info = await this.container!.inspect();

    await this.container!.remove();

    if (info.HostConfig.Mounts) {
      for (const mount of info.HostConfig.Mounts) {
        const volume = this.docker.getVolume(mount.Source);
        await volume.remove({ force: true });
      }
    }
  }

  protected async attachStream() {
    const stream = await this.container!.attach({
      stream: true,
      stdout: true,
      stderr: true,
      stdin: false,
    });

    const stdout = new PassThrough();
    const stderr = new PassThrough();

    this.container!.modem.demuxStream(stream, stdout, stderr);

    stdout.pipe(this.logs);
    stderr.pipe(this.logs);
  }
}
