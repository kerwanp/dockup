import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Elasticsearch HTTP port exposed on host.
   *
   * @default 9200
   */
  port?: number;

  /**
   * Elasticsearch transport port for node communication.
   *
   * @default 9300
   */
  transportPort?: number;

  /**
   * Node name for the Elasticsearch instance.
   *
   * @default "es-node-1"
   */
  nodeName?: string;

  /**
   * Cluster name.
   *
   * @default "docker-cluster"
   */
  clusterName?: string;

  /**
   * Enable security features (requires license).
   *
   * @default false
   */
  security?: boolean;

  /**
   * Memory limit for JVM heap.
   *
   * @default "512m"
   */
  memory?: string;

  /**
   * Discovery type for cluster formation.
   *
   * @default "single-node"
   */
  discoveryType?: "single-node" | "multi-node";
}

export const elasticsearch = defineService<Options>((config = {}) => {
  const {
    name = "elasticsearch",
    image = "elasticsearch:8.11.0",
    port = 9200,
    transportPort = 9300,
    nodeName = "es-node-1",
    clusterName = "docker-cluster",
    security = false,
    memory = "512m",
    discoveryType = "single-node",
  } = config;

  return {
    type: "container",
    name: "Elasticsearch",
    description:
      "A distributed, RESTful search and analytics engine for all types of data.",
    tags: ["search", "analytics", "database"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("elasticsearch", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(9200, port)
        .withPort(9300, transportPort)
        .withEnv("node.name", nodeName)
        .withEnv("cluster.name", clusterName)
        .withEnv("discovery.type", discoveryType)
        .withEnv("ES_JAVA_OPTS", `-Xms${memory} -Xmx${memory}`)
        .withEnv("xpack.security.enabled", security ? "true" : "false")
        .withEnv("xpack.security.enrollment.enabled", "false")
        .withVolumeMount("data", "/usr/share/elasticsearch/data");

      return config.extend ? config.extend(service) : service;
    },
    metadata: () => [
      {
        label: "HTTP Endpoint",
        description: "REST API endpoint for Elasticsearch",
        value: `http://localhost:${port}`,
      },
      {
        label: "Transport Port",
        description: "Port for inter-node communication",
        value: `localhost:${transportPort}`,
      },
      {
        label: "Cluster Info",
        description: "Cluster and node configuration",
        value: `Cluster: ${clusterName}, Node: ${nodeName}`,
      },
    ],
  };
});
