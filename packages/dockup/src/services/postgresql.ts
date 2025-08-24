import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Postgresql exposed port on host.
   *
   * @default 5432
   */
  port?: number;

  /**
   * Default database name.
   *
   * @default "database"
   */
  database?: string;

  /**
   * Default username.
   *
   * @default "user"
   */
  user?: string;

  /**
   * Default user password.
   *
   * @default "password"
   */
  password?: string;
}

export const postgresql = defineService<Options>((config = {}) => {
  const {
    name = "postgresql",
    image = "postgres:latest",
    port = 5432,
    database = "database",
    user = "user",
    password = "password",
  } = config;

  return {
    type: "container",
    name: "PostgreSQL",
    description:
      "An open-source relational database known for reliability and advanced features.",
    tags: ["database"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("postgresql", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(5432, port)
        .withEnv("POSTGRES_DB", database)
        .withEnv("POSTGRES_USER", user)
        .withEnv("POSTGRES_PASSWORD", password)
        .withVolumeMount("data", "/var/lib/postgresql");

      return config.extend ? config.extend(service) : service;
    },
    metadata: () => [
      {
        label: "Connection URL",
        description: "Can be used to connect to the database",
        value: `postgres://${user}:${password}@localhost:${port}/${database}`,
      },
    ],
  };
});
