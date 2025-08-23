import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * SonarQube web UI port exposed on host.
   *
   * @default 9000
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
   * Database to use for persistence.
   *
   * @default "h2" (embedded)
   */
  database?: "h2" | "postgresql";

  /**
   * JVM heap size.
   *
   * @default "512m"
   */
  javaOpts?: string;

  /**
   * SonarQube edition.
   *
   * @default "community"
   */
  edition?: "community" | "developer" | "enterprise" | "datacenter";
}

export const sonarqube = defineService<Options>((config = {}) => {
  const {
    name = "sonarqube",
    image = "sonarqube:community",
    port = 9000,
    adminUser = "admin",
    adminPassword = "admin",
    database = "h2",
    javaOpts = "-Xmx512m -Xms128m",
    edition = "community",
  } = config;

  return {
    type: "container",
    name: "SonarQube",
    description:
      "Code quality and security analysis platform for continuous code inspection.",
    tags: ["code-quality", "security", "analysis"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("sonarqube", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(9000, port)
        .withEnv(
          "SONAR_JDBC_URL",
          database === "h2"
            ? "jdbc:h2:mem:sonar"
            : `jdbc:postgresql://${workspace}_postgresql:5432/sonar`,
        )
        .withEnv("SONAR_JDBC_USERNAME", database === "h2" ? "sonar" : "sonar")
        .withEnv("SONAR_JDBC_PASSWORD", database === "h2" ? "sonar" : "sonar")
        .withEnv("SONAR_ES_BOOTSTRAP_CHECKS_DISABLE", "true")
        .withEnv("SONAR_WEB_JAVAADDITIONALOPTS", javaOpts)
        .withVolumeMount("data", "/opt/sonarqube/data")
        .withVolumeMount("logs", "/opt/sonarqube/logs")
        .withVolumeMount("extensions", "/opt/sonarqube/extensions");

      return service;
    },
    metadata: () => [
      {
        label: "Web Interface",
        description: "SonarQube dashboard for code analysis",
        value: `http://localhost:${port}`,
      },
      {
        label: "Default Credentials",
        description: "Initial login credentials (change after first login)",
        value: `Username: ${adminUser}, Password: ${adminPassword}`,
      },
      {
        label: "Scanner Configuration",
        description: "Server URL for SonarQube scanners",
        value: `sonar.host.url=http://localhost:${port}`,
      },
      {
        label: "Edition",
        description: "SonarQube edition being used",
        value: edition,
      },
    ],
  };
});
