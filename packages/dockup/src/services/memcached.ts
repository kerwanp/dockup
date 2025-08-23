import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Memcached port exposed on host.
   *
   * @default 11211
   */
  port?: number;

  /**
   * Maximum memory to use for items in megabytes.
   *
   * @default 64
   */
  memory?: number;

  /**
   * Maximum number of simultaneous connections.
   *
   * @default 1024
   */
  maxConnections?: number;

  /**
   * Enable verbose output for debugging.
   *
   * @default false
   */
  verbose?: boolean;

  /**
   * Maximum item size in bytes.
   *
   * @default "1m" (1 megabyte)
   */
  maxItemSize?: string;

  /**
   * Number of threads to use.
   *
   * @default 4
   */
  threads?: number;
}

export const memcached = defineService<Options>((config = {}) => {
  const {
    name = "memcached",
    image = "memcached:alpine",
    port = 11211,
    memory = 64,
    maxConnections = 1024,
    verbose = false,
    maxItemSize = "1m",
    threads = 4,
  } = config;

  return {
    type: "container",
    name: "Memcached",
    description:
      "High-performance distributed memory caching system for speeding up applications.",
    tags: ["cache", "performance"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      // Build memcached command with options
      const cmd = [
        "memcached",
        "-m", memory.toString(),
        "-c", maxConnections.toString(),
        "-t", threads.toString(),
        "-I", maxItemSize,
      ];

      if (verbose) {
        cmd.push("-vv");
      }

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(11211, port)
        .withCmd(cmd);

      return new ContainerService("memcached", name, builder);
    },
    metadata: () => [
      {
        label: "Connection",
        description: "Memcached server endpoint",
        value: `localhost:${port}`,
      },
      {
        label: "Configuration",
        description: "Memory and connection limits",
        value: `Memory: ${memory}MB, Max Connections: ${maxConnections}`,
      },
      {
        label: "Performance",
        description: "Thread and item size configuration",
        value: `Threads: ${threads}, Max Item Size: ${maxItemSize}`,
      },
    ],
  };
});