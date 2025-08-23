import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * phpMyAdmin web UI port exposed on host.
   *
   * @default 8080
   */
  port?: number;

  /**
   * MySQL/MariaDB host to connect to.
   *
   * @default "mysql"
   */
  mysqlHost?: string;

  /**
   * MySQL/MariaDB port.
   *
   * @default 3306
   */
  mysqlPort?: number;

  /**
   * MySQL root user.
   *
   * @default "root"
   */
  mysqlUser?: string;

  /**
   * MySQL root password.
   *
   * @default "password"
   */
  mysqlPassword?: string;

  /**
   * Allow arbitrary server connection.
   *
   * @default false
   */
  arbitraryServerConnection?: boolean;

  /**
   * Upload limit for SQL files.
   *
   * @default "64M"
   */
  uploadLimit?: string;

  /**
   * Maximum execution time for scripts.
   *
   * @default "300"
   */
  maxExecutionTime?: string;
}

export const phpmyadmin = defineService<Options>((config = {}) => {
  const {
    name = "phpmyadmin",
    image = "phpmyadmin/phpmyadmin:latest",
    port = 8080,
    mysqlHost = "mysql",
    mysqlPort = 3306,
    mysqlUser = "root",
    mysqlPassword = "password",
    arbitraryServerConnection = false,
    uploadLimit = "64M",
    maxExecutionTime = "300",
  } = config;

  return {
    type: "container",
    name: "phpMyAdmin",
    description:
      "Web-based administration tool for MySQL and MariaDB databases.",
    tags: ["database", "admin", "mysql", "web"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(80, port)
        .withEnv("PMA_HOST", `${workspace}_${mysqlHost}`)
        .withEnv("PMA_PORT", mysqlPort.toString())
        .withEnv("PMA_USER", mysqlUser)
        .withEnv("PMA_PASSWORD", mysqlPassword)
        .withEnv("UPLOAD_LIMIT", uploadLimit)
        .withEnv("MAX_EXECUTION_TIME", maxExecutionTime);

      if (arbitraryServerConnection) {
        builder.withEnv("PMA_ARBITRARY", "1");
      }

      return new ContainerService("phpmyadmin", name, builder);
    },
    metadata: () => [
      {
        label: "Web Interface",
        description: "phpMyAdmin database administration",
        value: `http://localhost:${port}`,
      },
      {
        label: "Database Connection",
        description: "Connected MySQL/MariaDB instance",
        value: `${mysqlHost}:${mysqlPort}`,
      },
      {
        label: "Default Credentials",
        description: "Pre-configured database login",
        value: `Username: ${mysqlUser}, Password: ${mysqlPassword}`,
      },
      {
        label: "Upload Limit",
        description: "Maximum file upload size",
        value: uploadLimit,
      },
    ],
  };
});