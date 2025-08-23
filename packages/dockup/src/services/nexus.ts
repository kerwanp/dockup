import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Nexus web UI port exposed on host.
   *
   * @default 8081
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
   * @default "admin123"
   */
  adminPassword?: string;

  /**
   * JVM heap size.
   *
   * @default "1200m"
   */
  javaMaxHeap?: string;

  /**
   * JVM direct memory size.
   *
   * @default "2g"
   */
  javaMaxDirectMemory?: string;

  /**
   * Enable anonymous access.
   *
   * @default false
   */
  anonymousAccess?: boolean;
}

export const nexus = defineService<Options>((config = {}) => {
  const {
    name = "nexus",
    image = "sonatype/nexus3:latest",
    port = 8081,
    adminUser = "admin",
    adminPassword = "admin123",
    javaMaxHeap = "1200m",
    javaMaxDirectMemory = "2g",
    anonymousAccess = false,
  } = config;

  return {
    type: "container",
    name: "Nexus Repository",
    description:
      "Universal artifact repository manager supporting Maven, npm, Docker, and more.",
    tags: ["repository", "artifacts", "maven", "npm"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("nexus", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(8081, port)
        .withEnv(
          "INSTALL4J_ADD_VM_PARAMS",
          `-Xms${javaMaxHeap} -Xmx${javaMaxHeap} -XX:MaxDirectMemorySize=${javaMaxDirectMemory}`,
        )
        .withEnv("NEXUS_SECURITY_RANDOMPASSWORD", "false")
        .withVolumeMount("data", "/nexus-data");

      // Create init script to set admin password and anonymous access
      const initScript = `
        #!/bin/bash
        echo "${adminPassword}" > /nexus-data/admin.password
        echo "nexus.security.anonymous.enabled=${anonymousAccess}" >> /nexus-data/etc/nexus.properties
      `;

      service.withCmd([
        "sh",
        "-c",
        `echo '${initScript}' > /tmp/init.sh && chmod +x /tmp/init.sh && /tmp/init.sh && /opt/sonatype/nexus/bin/nexus run`,
      ]);

      return service;
    },
    metadata: () => [
      {
        label: "Web Interface",
        description: "Nexus repository manager interface",
        value: `http://localhost:${port}`,
      },
      {
        label: "Admin Credentials",
        description: "Administrator login credentials",
        value: `Username: ${adminUser}, Password: ${adminPassword}`,
      },
      {
        label: "Docker Registry",
        description: "Docker repository endpoint (after configuration)",
        value: `localhost:${port}`,
      },
      {
        label: "Maven Repository",
        description: "Maven repository URL",
        value: `http://localhost:${port}/repository/maven-public/`,
      },
      {
        label: "npm Registry",
        description: "npm repository URL",
        value: `http://localhost:${port}/repository/npm-public/`,
      },
    ],
  };
});
