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
    async create({ workspace, docker }) {
      const { name = "redis", image = "redis:latest", port = 6379 } = config;

      const service = new ContainerService("redis", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(6379, port)
        .withVolumeMount("data", "/data");

      return service;
    },
  };
});
