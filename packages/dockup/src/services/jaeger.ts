import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Jaeger UI port exposed on host.
   *
   * @default 16686
   */
  uiPort?: number;

  /**
   * Jaeger collector port for receiving traces.
   *
   * @default 14268
   */
  collectorPort?: number;

  /**
   * Jaeger agent port for receiving traces via UDP.
   *
   * @default 6831
   */
  agentPort?: number;

  /**
   * Storage backend for traces.
   *
   * @default "memory"
   */
  storage?: "memory" | "elasticsearch" | "cassandra" | "kafka";

  /**
   * Enable sampling strategies endpoint.
   *
   * @default true
   */
  sampling?: boolean;

  /**
   * Log level for Jaeger components.
   *
   * @default "info"
   */
  logLevel?: "debug" | "info" | "warn" | "error";

  /**
   * Memory storage max traces.
   * Only used when storage is "memory".
   *
   * @default 10000
   */
  memoryMaxTraces?: number;
}

export const jaeger = defineService<Options>((config = {}) => {
  const {
    name = "jaeger",
    image = "jaegertracing/all-in-one:latest",
    uiPort = 16686,
    collectorPort = 14268,
    agentPort = 6831,
    storage = "memory",
    sampling = true,
    logLevel = "info",
    memoryMaxTraces = 10000,
  } = config;

  return {
    type: "container",
    name: "Jaeger",
    description:
      "Open source distributed tracing platform for monitoring and troubleshooting microservices.",
    tags: ["tracing", "monitoring", "observability"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("jaeger", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(16686, uiPort) // UI
        .withPort(14268, collectorPort) // HTTP collector
        .withPort(6831, agentPort, "udp") // UDP agent
        .withPort(6832, 6832) // Binary agent
        .withPort(5778, 5778) // Config server
        .withEnv("COLLECTOR_ZIPKIN_HOST_PORT", ":9411")
        .withEnv("SPAN_STORAGE_TYPE", storage)
        .withEnv("LOG_LEVEL", logLevel);

      if (storage === "memory") {
        service.withEnv("MEMORY_MAX_TRACES", memoryMaxTraces.toString());
      }

      if (sampling) {
        service.withEnv("SAMPLING_STRATEGIES_RELOAD_INTERVAL", "1m");
      }

      return service;
    },
    metadata: () => [
      {
        label: "Jaeger UI",
        description: "Web interface for viewing and analyzing traces",
        value: `http://localhost:${uiPort}`,
      },
      {
        label: "Collector Endpoint",
        description: "HTTP endpoint for submitting spans",
        value: `http://localhost:${collectorPort}/api/traces`,
      },
      {
        label: "Agent Endpoint",
        description: "UDP endpoint for Jaeger agent",
        value: `localhost:${agentPort}`,
      },
      {
        label: "Storage Backend",
        description: "Trace storage configuration",
        value:
          storage === "memory"
            ? `${storage} (max ${memoryMaxTraces} traces)`
            : storage,
      },
    ],
  };
});
