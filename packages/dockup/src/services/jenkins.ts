import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Jenkins web UI port exposed on host.
   *
   * @default 8080
   */
  port?: number;

  /**
   * Jenkins agent port for build agents.
   *
   * @default 50000
   */
  agentPort?: number;

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
   * JVM options for Jenkins.
   *
   * @default "-Xmx1g -Dhudson.footerURL=http://localhost"
   */
  javaOpts?: string;

  /**
   * Jenkins plugins to install on startup.
   * Space-separated list of plugin names.
   *
   * @example "git docker-plugin pipeline-stage-view"
   */
  plugins?: string;

  /**
   * Skip initial setup wizard.
   *
   * @default true
   */
  skipSetup?: boolean;
}

export const jenkins = defineService<Options>((config = {}) => {
  const {
    name = "jenkins",
    image = "jenkins/jenkins:lts",
    port = 8080,
    agentPort = 50000,
    adminUser = "admin",
    adminPassword = "admin",
    javaOpts = "-Xmx1g -Dhudson.footerURL=http://localhost",
    plugins,
    skipSetup = true,
  } = config;

  return {
    type: "container",
    name: "Jenkins",
    description:
      "Open source automation server for building, testing, and deploying applications.",
    tags: ["ci-cd", "automation", "build"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("jenkins", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(8080, port)
        .withPort(50000, agentPort)
        .withEnv("JENKINS_OPTS", javaOpts)
        .withEnv("JENKINS_USER", adminUser)
        .withEnv("JENKINS_PASS", adminPassword)
        .withVolumeMount("home", "/var/jenkins_home")
        .withVolumeMount("docker", "/var/run/docker.sock");

      // Mount Docker socket for Docker builds
      service.with({
        HostConfig: {
          Binds: ["/var/run/docker.sock:/var/run/docker.sock"],
        },
      });

      if (skipSetup) {
        service.withEnv("JAVA_OPTS", "-Djenkins.install.runSetupWizard=false");
      }

      if (plugins) {
        service.withEnv("JENKINS_PLUGINS", plugins);
      }

      return config.extend ? config.extend(service) : service;
    },
    metadata: () => {
      const metadata = [
        {
          label: "Web Interface",
          description: "Jenkins dashboard and administration",
          value: `http://localhost:${port}`,
        },
        {
          label: "Agent Port",
          description: "Port for connecting build agents",
          value: `localhost:${agentPort}`,
        },
      ];

      if (skipSetup) {
        metadata.push({
          label: "Admin Credentials",
          description: "Default administrator login",
          value: `Username: ${adminUser}, Password: ${adminPassword}`,
        });
      } else {
        metadata.push({
          label: "Initial Setup",
          description: "Follow setup wizard on first access",
          value: "Setup wizard enabled",
        });
      }

      return metadata;
    },
  };
});
