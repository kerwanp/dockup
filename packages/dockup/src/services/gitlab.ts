import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * GitLab web UI port exposed on host.
   *
   * @default 80
   */
  port?: number;

  /**
   * GitLab SSH port for Git operations.
   *
   * @default 22
   */
  sshPort?: number;

  /**
   * GitLab HTTPS port.
   *
   * @default 443
   */
  httpsPort?: number;

  /**
   * Root password for GitLab admin.
   *
   * @default "password"
   */
  rootPassword?: string;

  /**
   * External URL for GitLab instance.
   *
   * @default "http://localhost"
   */
  externalUrl?: string;

  /**
   * Timezone for GitLab.
   *
   * @default "UTC"
   */
  timezone?: string;

  /**
   * Enable GitLab Container Registry.
   *
   * @default false
   */
  registry?: boolean;

  /**
   * GitLab edition.
   *
   * @default "ce" (Community Edition)
   */
  edition?: "ce" | "ee";
}

export const gitlab = defineService<Options>((config = {}) => {
  const {
    name = "gitlab",
    image = "gitlab/gitlab-ce:latest",
    port = 80,
    sshPort = 22,
    httpsPort = 443,
    rootPassword = "password",
    externalUrl = `http://localhost:${port}`,
    timezone = "UTC",
    registry = false,
    edition = "ce",
  } = config;

  const actualImage = edition === "ee" ? "gitlab/gitlab-ee:latest" : image;

  return {
    type: "container",
    name: "GitLab",
    description:
      "Complete DevOps platform with Git repository management, CI/CD, and more.",
    tags: ["git", "ci-cd", "devops", "repository"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(actualImage)
        .withPort(80, port)
        .withPort(22, sshPort)
        .withPort(443, httpsPort)
        .withEnv("GITLAB_OMNIBUS_CONFIG", `
          external_url '${externalUrl}'
          gitlab_rails['initial_root_password'] = '${rootPassword}'
          gitlab_rails['time_zone'] = '${timezone}'
          ${registry ? "registry_external_url 'http://localhost:5050'" : ""}
          ${registry ? "gitlab_rails['registry_enabled'] = true" : ""}
        `)
        .withVolumeMount("config", "/etc/gitlab")
        .withVolumeMount("logs", "/var/log/gitlab")
        .withVolumeMount("data", "/var/opt/gitlab");

      if (registry) {
        builder.withPort(5050, 5050); // Registry port
      }

      return new ContainerService("gitlab", name, builder);
    },
    metadata: () => {
      const metadata = [
        {
          label: "Web Interface",
          description: "GitLab web interface",
          value: `http://localhost:${port}`,
        },
        {
          label: "Root Credentials",
          description: "Administrator login credentials",
          value: `Username: root, Password: ${rootPassword}`,
        },
        {
          label: "SSH Clone URL",
          description: "SSH endpoint for Git operations",
          value: `git@localhost:${sshPort}`,
        },
      ];

      if (registry) {
        metadata.push({
          label: "Container Registry",
          description: "Docker container registry endpoint",
          value: `localhost:5050`,
        });
      }

      metadata.push({
        label: "Edition",
        description: "GitLab edition",
        value: edition === "ee" ? "Enterprise Edition" : "Community Edition",
      });

      return metadata;
    },
  };
});