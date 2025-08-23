import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * MinIO API port exposed on host.
   *
   * @default 9000
   */
  port?: number;

  /**
   * MinIO Console port exposed on host.
   *
   * @default 9001
   */
  consolePort?: number;

  /**
   * MinIO root username.
   *
   * @default "minioadmin"
   */
  rootUser?: string;

  /**
   * MinIO root password.
   * Must be at least 8 characters.
   *
   * @default "minioadmin"
   */
  rootPassword?: string;

  /**
   * Default bucket to create on startup.
   *
   * @default undefined
   */
  defaultBucket?: string;

  /**
   * Region for the MinIO server.
   *
   * @default "us-east-1"
   */
  region?: string;
}

export const minio = defineService<Options>((config = {}) => {
  const {
    name = "minio",
    image = "minio/minio:latest",
    port = 9000,
    consolePort = 9001,
    rootUser = "minioadmin",
    rootPassword = "minioadmin",
    defaultBucket,
    region = "us-east-1",
  } = config;

  return {
    type: "container",
    name: "MinIO",
    description:
      "High-performance S3-compatible object storage for cloud-native applications.",
    tags: ["storage", "s3"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(9000, port)
        .withPort(9001, consolePort)
        .withEnv("MINIO_ROOT_USER", rootUser)
        .withEnv("MINIO_ROOT_PASSWORD", rootPassword)
        .withEnv("MINIO_REGION", region)
        .withVolumeMount("data", "/data")
        .withCmd(["server", "/data", "--console-address", `:${9001}`]);

      if (defaultBucket) {
        builder.withEnv("MINIO_DEFAULT_BUCKETS", defaultBucket);
      }

      return new ContainerService("minio", name, builder);
    },
    metadata: () => {
      const s3Endpoint = `http://localhost:${port}`;
      const consoleUrl = `http://localhost:${consolePort}`;

      const metadata = [
        {
          label: "S3 Endpoint",
          description: "S3-compatible API endpoint",
          value: s3Endpoint,
        },
        {
          label: "Console URL",
          description: "MinIO web console for administration",
          value: consoleUrl,
        },
        {
          label: "Access Credentials",
          description: "Root user credentials for S3 API and console",
          value: `Access Key: ${rootUser}, Secret Key: ${rootPassword}`,
        },
      ];

      if (defaultBucket) {
        metadata.push({
          label: "Default Bucket",
          description: "Pre-created bucket available on startup",
          value: defaultBucket,
        });
      }

      return metadata;
    },
  };
});

