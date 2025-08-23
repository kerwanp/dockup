import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
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
  return {
    type: "container",
    name: "PostgreSQL",
    description:
      "An open-source relational database known for reliability and advanced features.",
    tags: ["database"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();

      const {
        name = "postgresql",
        image = "postgres:latest",
        port = 5432,
        database = "database",
        user = "user",
        password = "password",
      } = config;

      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(5432, port)
        .withEnv("POSTGRES_DB", database)
        .withEnv("POSTGRES_USER", user)
        .withEnv("POSTGRES_PASSWORD", password);

      return new ContainerService("postgresql", name, builder);
    },
  };
});
