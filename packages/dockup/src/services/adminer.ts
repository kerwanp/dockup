import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Adminer web UI port exposed on host.
   *
   * @default 8080
   */
  port?: number;

  /**
   * Adminer design theme.
   *
   * @default "default"
   */
  design?: string;

  /**
   * Default database server to connect to.
   *
   * @default undefined
   */
  defaultServer?: string;

  /**
   * Adminer plugins to enable.
   * Space-separated list of plugin names.
   *
   * @example "tables-filter tinymce"
   */
  plugins?: string;
}

export const adminer = defineService<Options>((config = {}) => {
  const {
    name = "adminer",
    image = "adminer:latest",
    port = 8080,
    design = "default",
    defaultServer,
    plugins,
  } = config;

  return {
    type: "container",
    name: "Adminer",
    description:
      "Full-featured database management tool written in PHP, supporting MySQL, MariaDB, PostgreSQL, SQLite, MS SQL, and more.",
    tags: ["database", "admin", "multi-database", "web"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(8080, port)
        .withEnv("ADMINER_DESIGN", design);

      if (defaultServer) {
        builder.withEnv("ADMINER_DEFAULT_SERVER", `${workspace}_${defaultServer}`);
      }

      if (plugins) {
        builder.withEnv("ADMINER_PLUGINS", plugins);
      }

      return new ContainerService("adminer", name, builder);
    },
    metadata: () => {
      const metadata = [
        {
          label: "Web Interface",
          description: "Adminer database administration",
          value: `http://localhost:${port}`,
        },
        {
          label: "Supported Databases",
          description: "Database systems supported by Adminer",
          value: "MySQL, MariaDB, PostgreSQL, SQLite, MS SQL, Oracle, MongoDB",
        },
        {
          label: "Theme",
          description: "UI theme/design",
          value: design,
        },
      ];

      if (defaultServer) {
        metadata.push({
          label: "Default Server",
          description: "Pre-configured database server",
          value: defaultServer,
        });
      }

      if (plugins) {
        metadata.push({
          label: "Enabled Plugins",
          description: "Additional functionality plugins",
          value: plugins,
        });
      }

      return metadata;
    },
  };
});