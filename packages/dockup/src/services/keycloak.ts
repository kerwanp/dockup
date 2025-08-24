import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Keycloak HTTP port exposed on host.
   *
   * @default 8080
   */
  port?: number;

  /**
   * Admin username.
   *
   * @default "admin"
   */
  adminUser?: string;

  /**
   * Admin password.
   *
   * @default "admin"
   */
  adminPassword?: string;

  /**
   * Database vendor to use.
   *
   * @default "h2" (embedded)
   */
  database?: "h2" | "postgres" | "mysql" | "mariadb";

  /**
   * Enable development mode with relaxed SSL.
   *
   * @default true
   */
  devMode?: boolean;

  /**
   * Default realm to import on startup.
   *
   * @default undefined
   */
  realmImportPath?: string;
}

export const keycloak = defineService<Options>((config = {}) => {
  const {
    name = "keycloak",
    image = "quay.io/keycloak/keycloak:latest",
    port = 8080,
    adminUser = "admin",
    adminPassword = "admin",
    database = "h2",
    devMode = true,
    realmImportPath,
  } = config;

  return {
    type: "container",
    name: "Keycloak",
    description:
      "Open source identity and access management for modern applications and services.",
    tags: ["auth", "identity", "security"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("keycload", name, docker);

      const cmd = ["start", devMode ? "--dev" : "--optimized"];

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(8080, port)
        .withEnv("KEYCLOAK_ADMIN", adminUser)
        .withEnv("KEYCLOAK_ADMIN_PASSWORD", adminPassword)
        .withEnv("KC_DB", database)
        .withEnv("KC_HEALTH_ENABLED", "true")
        .withEnv("KC_METRICS_ENABLED", "true")
        .withVolumeMount("data", "/opt/keycloak/data")
        .withCmd(cmd);

      if (realmImportPath) {
        service.with({
          HostConfig: {
            Binds: [`${realmImportPath}:/opt/keycloak/data/import:ro`],
          },
        });
        cmd.push("--import-realm");
      }

      return config.extend ? config.extend(service) : service;
    },
    metadata: () => [
      {
        label: "Admin Console",
        description: "Keycloak administration console",
        value: `http://localhost:${port}/admin`,
      },
      {
        label: "Admin Credentials",
        description: "Administrator login credentials",
        value: `Username: ${adminUser}, Password: ${adminPassword}`,
      },
      {
        label: "Account Console",
        description: "User account management",
        value: `http://localhost:${port}/realms/master/account`,
      },
    ],
  };
});
