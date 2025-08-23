import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * MongoDB exposed port on host.
   *
   * @default 27017
   */
  port?: number;

  /**
   * Default database name.
   *
   * @default "database"
   */
  database?: string;

  /**
   * MongoDB root username.
   *
   * @default "root"
   */
  username?: string;

  /**
   * MongoDB root password.
   *
   * @default "password"
   */
  password?: string;

  /**
   * Enable authentication.
   *
   * @default true
   */
  auth?: boolean;

  /**
   * MongoDB replica set name.
   * Useful for transactions support.
   *
   * @default undefined
   */
  replicaSet?: string;
}

export const mongodb = defineService<Options>((config = {}) => {
  const {
    name = "mongodb",
    image = "mongo:7",
    port = 27017,
    database = "database",
    username = "root",
    password = "password",
    auth = true,
    replicaSet,
  } = config;

  return {
    type: "container",
    name: "MongoDB",
    description:
      "A document-oriented NoSQL database designed for scalability and flexibility.",
    tags: ["database", "nosql"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(27017, port)
        .withVolumeMount("data", "/data/db")
        .withVolumeMount("configdb", "/data/configdb");

      if (auth) {
        builder
          .withEnv("MONGO_INITDB_ROOT_USERNAME", username)
          .withEnv("MONGO_INITDB_ROOT_PASSWORD", password)
          .withEnv("MONGO_INITDB_DATABASE", database);
      }

      if (replicaSet) {
        builder.withCmd([
          "mongod",
          "--replSet",
          replicaSet,
          "--bind_ip_all",
          auth ? "--auth" : "--noauth",
        ]);
      }

      return new ContainerService("mongodb", name, builder);
    },
    metadata: () => {
      const authString = auth ? `${username}:${password}@` : "";
      const baseUrl = `mongodb://${authString}localhost:${port}`;
      const connectionUrl = replicaSet
        ? `${baseUrl}/${database}?replicaSet=${replicaSet}`
        : `${baseUrl}/${database}`;

      return [
        {
          label: "Connection URL",
          description: "Can be used to connect to MongoDB",
          value: connectionUrl,
        },
        {
          label: "Admin URL",
          description: "Connection string for admin database",
          value: `${baseUrl}/admin`,
        },
      ];
    },
  };
});