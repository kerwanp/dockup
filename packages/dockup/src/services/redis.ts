import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { ContainerService } from "../container/container_service.js";
import { BaseConfig, defineService } from "./define_service.js";

export interface Options extends BaseConfig {
  /**
   * Redis exposed port on host.
   *
   * @default 6379
   */
  port?: number;
}

export const redis = defineService<Options>((config = {}) => {
  return {
    type: "container",
    name: "Redis",
    description:
      "An in-memory data store used as a database, cache, and message broker for high-performance applications.",
    tags: ["messaging", "database"],
    async create({ workspace }) {
      const docker = new Dockerode();
      const { name = "redis", image = "redis:latest", port = 6379 } = config;

      const container = new ContainerBuilder(docker);

      container
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(6379, port);

      return new ContainerService("redis", name, container);
    },
  };
});
