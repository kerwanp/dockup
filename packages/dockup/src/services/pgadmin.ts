import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * pgAdmin web UI port exposed on host.
   *
   * @default 5050
   */
  port?: number;

  /**
   * Default admin email for pgAdmin login.
   *
   * @default "admin@admin.com"
   */
  defaultEmail?: string;

  /**
   * Default admin password for pgAdmin login.
   *
   * @default "admin"
   */
  defaultPassword?: string;

  /**
   * PostgreSQL host to pre-configure.
   *
   * @default "postgresql"
   */
  postgresHost?: string;

  /**
   * PostgreSQL port.
   *
   * @default 5432
   */
  postgresPort?: number;

  /**
   * PostgreSQL username for connection.
   *
   * @default "user"
   */
  postgresUser?: string;

  /**
   * PostgreSQL password for connection.
   *
   * @default "password"
   */
  postgresPassword?: string;

  /**
   * PostgreSQL database name.
   *
   * @default "database"
   */
  postgresDatabase?: string;
}

export const pgadmin = defineService<Options>((config = {}) => {
  const {
    name = "pgadmin",
    image = "dpage/pgadmin4:latest",
    port = 5050,
    defaultEmail = "admin@admin.com",
    defaultPassword = "admin",
    postgresHost = "postgresql",
    postgresPort = 5432,
    postgresUser = "user",
    postgresPassword = "password",
    postgresDatabase = "database",
  } = config;

  return {
    type: "container",
    name: "pgAdmin",
    description:
      "Web-based administration and development platform for PostgreSQL databases.",
    tags: ["database", "admin", "postgresql", "web"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(80, port)
        .withEnv("PGADMIN_DEFAULT_EMAIL", defaultEmail)
        .withEnv("PGADMIN_DEFAULT_PASSWORD", defaultPassword)
        .withEnv("PGADMIN_CONFIG_SERVER_MODE", "False")
        .withEnv("PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED", "False")
        .withVolumeMount("data", "/var/lib/pgadmin");

      return new ContainerService("pgadmin", name, builder);
    },
    metadata: () => [
      {
        label: "Web Interface",
        description: "pgAdmin database administration",
        value: `http://localhost:${port}`,
      },
      {
        label: "Admin Credentials",
        description: "pgAdmin login credentials",
        value: `Email: ${defaultEmail}, Password: ${defaultPassword}`,
      },
      {
        label: "PostgreSQL Connection",
        description: "Pre-configured database connection details",
        value: `Host: ${postgresHost}, Port: ${postgresPort}, User: ${postgresUser}`,
      },
      {
        label: "Connection String",
        description: "PostgreSQL connection for manual setup",
        value: `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDatabase}`,
      },
    ],
  };
});