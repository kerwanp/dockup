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
}

export const pgadmin = defineService<Options>((config = {}) => {
  const {
    name = "pgadmin",
    image = "dpage/pgadmin4:latest",
    port = 5050,
    defaultEmail = "admin@admin.com",
    defaultPassword = "admin",
  } = config;

  return {
    type: "container",
    name: "pgAdmin",
    description:
      "Web-based administration and development platform for PostgreSQL databases.",
    tags: ["database", "admin", "postgresql", "web"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("pgadmin", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(80, port)
        .withEnv("PGADMIN_DEFAULT_EMAIL", defaultEmail)
        .withEnv("PGADMIN_DEFAULT_PASSWORD", defaultPassword)
        .withEnv("PGADMIN_CONFIG_SERVER_MODE", "False")
        .withEnv("PGADMIN_CONFIG_MASTER_PASSWORD_REQUIRED", "False")
        .withVolumeMount("data", "/var/lib/pgadmin");

      return service;
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
    ],
  };
});
