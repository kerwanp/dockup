import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Grafana web UI port exposed on host.
   *
   * @default 3000
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
   * Allow anonymous access.
   *
   * @default false
   */
  anonymousAccess?: boolean;

  /**
   * Install additional plugins on startup.
   * Comma-separated list of plugin names.
   *
   * @example "redis-datasource,prometheus"
   */
  plugins?: string;

  /**
   * Default theme (light or dark).
   *
   * @default "dark"
   */
  theme?: "light" | "dark";
}

export const grafana = defineService<Options>((config = {}) => {
  const {
    name = "grafana",
    image = "grafana/grafana:latest",
    port = 3000,
    adminUser = "admin",
    adminPassword = "admin",
    anonymousAccess = false,
    plugins,
    theme = "dark",
  } = config;

  return {
    type: "container",
    name: "Grafana",
    description:
      "Open source analytics and interactive visualization platform for metrics and logs.",
    tags: ["monitoring", "visualization", "metrics"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("grafana", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(3000, port)
        .withEnv("GF_SECURITY_ADMIN_USER", adminUser)
        .withEnv("GF_SECURITY_ADMIN_PASSWORD", adminPassword)
        .withEnv(
          "GF_AUTH_ANONYMOUS_ENABLED",
          anonymousAccess ? "true" : "false",
        )
        .withEnv("GF_USERS_DEFAULT_THEME", theme)
        .withVolumeMount("data", "/var/lib/grafana")
        .withVolumeMount("provisioning", "/etc/grafana/provisioning");

      if (plugins) {
        service.withEnv("GF_INSTALL_PLUGINS", plugins);
      }

      if (anonymousAccess) {
        service.withEnv("GF_AUTH_ANONYMOUS_ORG_ROLE", "Viewer");
      }

      return config.extend ? config.extend(service) : service;
    },
    metadata: () => [
      {
        label: "Dashboard URL",
        description: "Grafana web interface",
        value: `http://localhost:${port}`,
      },
      {
        label: "Admin Credentials",
        description: "Administrator login credentials",
        value: `Username: ${adminUser}, Password: ${adminPassword}`,
      },
      {
        label: "Default Theme",
        description: "UI theme setting",
        value: theme,
      },
    ],
  };
});
