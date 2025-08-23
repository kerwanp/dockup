import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Kafka broker port exposed on host.
   *
   * @default 9092
   */
  port?: number;

  /**
   * Kafka UI port for web interface.
   * Set to false to disable UI.
   *
   * @default 8080
   */
  uiPort?: number | false;

  /**
   * Zookeeper port exposed on host.
   *
   * @default 2181
   */
  zookeeperPort?: number;

  /**
   * Number of default partitions for auto-created topics.
   *
   * @default 1
   */
  defaultPartitions?: number;

  /**
   * Default replication factor for auto-created topics.
   *
   * @default 1
   */
  defaultReplicationFactor?: number;

  /**
   * Enable auto topic creation.
   *
   * @default true
   */
  autoCreateTopics?: boolean;

  /**
   * Kafka broker ID.
   *
   * @default 1
   */
  brokerId?: number;
}

export const kafka = defineService<Options>((config = {}) => {
  const {
    name = "kafka",
    image = "confluentinc/cp-kafka:7.5.0",
    port = 9092,
    uiPort = 8080,
    zookeeperPort = 2181,
    defaultPartitions = 1,
    defaultReplicationFactor = 1,
    autoCreateTopics = true,
    brokerId = 1,
  } = config;

  return {
    type: "container",
    name: "Kafka",
    description:
      "A distributed event streaming platform for high-performance data pipelines and streaming analytics.",
    tags: ["messaging", "streaming", "events"],
    create: async ({ workspace, docker }) => {
      throw new Error("Kafka not implemented");

      // Create Zookeeper container first
      const zookeeperBuilder = new ContainerBuilder(docker);
      zookeeperBuilder
        .withName(`${workspace}_${name}_zookeeper`)
        .withImage("confluentinc/cp-zookeeper:7.5.0")
        .withPort(2181, zookeeperPort)
        .withEnv("ZOOKEEPER_CLIENT_PORT", "2181")
        .withEnv("ZOOKEEPER_TICK_TIME", "2000")
        .withVolumeMount("zookeeper-data", "/var/lib/zookeeper/data")
        .withVolumeMount("zookeeper-logs", "/var/lib/zookeeper/log");

      const zookeeperService = new ContainerService(
        "zookeeper",
        `${name}-zookeeper`,
        zookeeperBuilder,
      );
      await zookeeperService.init();
      await zookeeperService.start();

      // Create Kafka broker
      const kafkaBuilder = new ContainerBuilder(docker);
      kafkaBuilder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(9092, port)
        .withEnv("KAFKA_BROKER_ID", brokerId.toString())
        .withEnv(
          "KAFKA_ZOOKEEPER_CONNECT",
          `${workspace}_${name}_zookeeper:2181`,
        )
        .withEnv("KAFKA_ADVERTISED_LISTENERS", `PLAINTEXT://localhost:${port}`)
        .withEnv("KAFKA_LISTENER_SECURITY_PROTOCOL_MAP", "PLAINTEXT:PLAINTEXT")
        .withEnv("KAFKA_INTER_BROKER_LISTENER_NAME", "PLAINTEXT")
        .withEnv(
          "KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR",
          defaultReplicationFactor.toString(),
        )
        .withEnv("KAFKA_NUM_PARTITIONS", defaultPartitions.toString())
        .withEnv(
          "KAFKA_DEFAULT_REPLICATION_FACTOR",
          defaultReplicationFactor.toString(),
        )
        .withEnv(
          "KAFKA_AUTO_CREATE_TOPICS_ENABLE",
          autoCreateTopics ? "true" : "false",
        )
        .withVolumeMount("kafka-data", "/var/lib/kafka/data");

      // Add Kafka UI if enabled
      if (uiPort !== false) {
        const uiBuilder = new ContainerBuilder(docker);
        uiBuilder
          .withName(`${workspace}_${name}_ui`)
          .withImage("provectuslabs/kafka-ui:latest")
          .withPort(8080, uiPort)
          .withEnv("KAFKA_CLUSTERS_0_NAME", "local")
          .withEnv(
            "KAFKA_CLUSTERS_0_BOOTSTRAPSERVERS",
            `${workspace}_${name}:9092`,
          )
          .withEnv(
            "KAFKA_CLUSTERS_0_ZOOKEEPER",
            `${workspace}_${name}_zookeeper:2181`,
          );

        const uiService = new ContainerService(
          "kafka-ui",
          `${name}-ui`,
          uiBuilder,
        );
        await uiService.init();
        await uiService.start();
      }

      return new ContainerService("kafka", name, kafkaBuilder);
    },
    metadata: () => {
      const metadata = [
        {
          label: "Broker Connection",
          description: "Kafka broker endpoint for producers and consumers",
          value: `localhost:${port}`,
        },
        {
          label: "Zookeeper Connection",
          description: "Zookeeper endpoint for cluster coordination",
          value: `localhost:${zookeeperPort}`,
        },
      ];

      if (uiPort !== false) {
        metadata.push({
          label: "Kafka UI",
          description: "Web interface for managing Kafka",
          value: `http://localhost:${uiPort}`,
        });
      }

      return metadata;
    },
  };
});
