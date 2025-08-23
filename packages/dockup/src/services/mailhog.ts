import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { ContainerService } from "../container/container_service.js";
import { BaseConfig, defineService } from "./define_service.js";

export interface Options extends BaseConfig {
  /**
   * SMTP server port exposed on host.
   *
   * @default 1025
   */
  smtpPort?: number;

  /**
   * Web UI port exposed on host.
   *
   * @default 8025
   */
  webPort?: number;

  /**
   * Hostname for SMTP server.
   *
   * @default "mailhog"
   */
  hostname?: string;

  /**
   * Storage type for messages.
   * Can be "memory" or "maildir".
   *
   * @default "memory"
   */
  storage?: "memory" | "maildir";

  /**
   * SMTP authentication configuration.
   * Set to enable authentication with username and password.
   *
   * @example { user: "mailhog", password: "secret" }
   */
  auth?: {
    user: string;
    password: string;
  };
}

export const mailhog = defineService<Options>((config = {}) => {
  const {
    name = "mailhog",
    image = "mailhog/mailhog:latest",
    smtpPort = 1025,
    webPort = 8025,
    hostname = "mailhog",
    storage = "memory",
    auth,
  } = config;

  return {
    type: "container",
    name: "MailHog",
    description:
      "An email testing tool that captures SMTP traffic for development environments with a web UI for viewing messages.",
    tags: ["email", "testing"],
    async create({ workspace }) {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(1025, smtpPort)
        .withPort(8025, webPort)
        .withEnv("MH_HOSTNAME", hostname)
        .withEnv("MH_STORAGE", storage);

      if (auth) {
        const authFile = `/tmp/${auth.user}:${auth.password}`;
        builder
          .withEnv("MH_AUTH_FILE", authFile)
          .withCmd([
            "sh",
            "-c",
            `echo "${auth.user}:$(MailHog bcrypt ${auth.password})" > ${authFile} && MailHog`,
          ]);
      }

      if (storage === "maildir") {
        builder
          .withVolumeMount("maildir", "/maildir")
          .withEnv("MH_MAILDIR_PATH", "/maildir");
      }

      return new ContainerService("mailhog", name, builder);
    },
    metadata: () => {
      const smtpUrl = auth
        ? `smtp://${auth.user}:${auth.password}@localhost:${smtpPort}`
        : `smtp://localhost:${smtpPort}`;

      return [
        {
          label: "Connection URL",
          description: "SMTP connection string for sending test emails",
          value: smtpUrl,
        },
        {
          label: "Web UI",
          description: "Web interface to view captured emails",
          value: `http://localhost:${webPort}`,
        },
      ];
    },
  };
});
