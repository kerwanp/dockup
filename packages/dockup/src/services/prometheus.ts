import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Prometheus web UI port exposed on host.
   *
   * @default 9090
   */
  port?: number;

  /**
   * Path to custom prometheus.yml configuration file on host.
   *
   * @default undefined
   */
  configPath?: string;

  /**
   * Path to rules directory on host.
   *
   * @default undefined
   */
  rulesPath?: string;

  /**
   * Data retention period.
   *
   * @default "15d"
   */
  retention?: string;

  /**
   * Maximum storage size.
   *
   * @default "2GB"
   */
  storageSize?: string;

  /**
   * Enable admin API.
   *
   * @default false
   */
  adminApi?: boolean;

  /**
   * Enable lifecycle API.
   *
   * @default false
   */
  lifecycleApi?: boolean;
}

export const prometheus = defineService<Options>((config = {}) => {
  const {
    name = "prometheus",
    image = "prom/prometheus:latest",
    port = 9090,
    configPath,
    rulesPath,
    retention = "15d",
    storageSize = "2GB",
    adminApi = false,
    lifecycleApi = false,
  } = config;

  return {
    type: "container",
    name: "Prometheus",
    description:
      "Open-source monitoring and alerting toolkit for collecting metrics and time series data.",
    tags: ["monitoring", "metrics", "alerting"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      const cmd = [
        "--config.file=/etc/prometheus/prometheus.yml",
        "--storage.tsdb.path=/prometheus",
        `--storage.tsdb.retention.time=${retention}`,
        `--storage.tsdb.retention.size=${storageSize}`,
        "--web.console.libraries=/etc/prometheus/console_libraries",
        "--web.console.templates=/etc/prometheus/consoles",
        "--web.enable-lifecycle",
      ];

      if (adminApi) {
        cmd.push("--web.enable-admin-api");
      }

      if (lifecycleApi) {
        cmd.push("--web.enable-lifecycle");
      }

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(9090, port)
        .withVolumeMount("data", "/prometheus")
        .withCmd(cmd);

      // Mount custom config if provided
      if (configPath) {
        builder.merge({
          HostConfig: {
            Binds: [`${configPath}:/etc/prometheus/prometheus.yml:ro`],
          },
        });
      }

      // Mount rules directory if provided
      if (rulesPath) {
        builder.merge({
          HostConfig: {
            Binds: [`${rulesPath}:/etc/prometheus/rules:ro`],
          },
        });
      }

      return new ContainerService("prometheus", name, builder);
    },
    metadata: () => {
      const metadata = [
        {
          label: "Web UI",
          description: "Prometheus web interface for queries and graphs",
          value: `http://localhost:${port}`,
        },
        {
          label: "Metrics Endpoint",
          description: "Prometheus metrics scraping endpoint",
          value: `http://localhost:${port}/metrics`,
        },
        {
          label: "Data Retention",
          description: "Metrics retention configuration",
          value: `Time: ${retention}, Size: ${storageSize}`,
        },
      ];

      if (configPath) {
        metadata.push({
          label: "Config File",
          description: "Using custom configuration from",
          value: configPath,
        });
      }

      if (rulesPath) {
        metadata.push({
          label: "Rules Directory",
          description: "Loading alerting/recording rules from",
          value: rulesPath,
        });
      }

      return metadata;
    },
  };
});