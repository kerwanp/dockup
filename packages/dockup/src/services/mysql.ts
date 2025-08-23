import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * MySQL exposed port on host.
   *
   * @default 3306
   */
  port?: number;

  /**
   * Default database name.
   *
   * @default "database"
   */
  database?: string;

  /**
   * Root user password.
   *
   * @default "password"
   */
  rootPassword?: string;

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

export const mysql = defineService<Options>((config = {}) => {
  const {
    name = "mysql",
    image = "mysql:8",
    port = 3306,
    database = "database",
    rootPassword = "password",
    user = "user",
    password = "password",
  } = config;

  return {
    type: "container",
    name: "MySQL",
    description:
      "The world's most popular open-source relational database management system.",
    tags: ["database"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("mysql", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(3306, port)
        .withEnv("MYSQL_ROOT_PASSWORD", rootPassword)
        .withEnv("MYSQL_DATABASE", database)
        .withEnv("MYSQL_USER", user)
        .withEnv("MYSQL_PASSWORD", password)
        .withVolumeMount("data", "/var/lib/mysql");

      return service;
    },
    metadata: () => [
      {
        label: "Connection URL",
        description: "Can be used to connect to the database",
        value: `mysql://${user}:${password}@localhost:${port}/${database}`,
      },
      {
        label: "Root Connection URL",
        description: "Root user connection string",
        value: `mysql://root:${rootPassword}@localhost:${port}/${database}`,
      },
    ],
  };
});
