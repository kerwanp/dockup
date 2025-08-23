import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * LocalStack gateway port exposed on host.
   *
   * @default 4566
   */
  port?: number;

  /**
   * Services to enable.
   * By default, all services are available.
   *
   * @default undefined (all services)
   * @example "s3,dynamodb,lambda"
   */
  services?: string;

  /**
   * Default AWS region.
   *
   * @default "us-east-1"
   */
  region?: string;

  /**
   * Enable debug mode for verbose logging.
   *
   * @default false
   */
  debug?: boolean;

  /**
   * Enable persistence of data across restarts.
   *
   * @default false
   */
  persistence?: boolean;

  /**
   * AWS access key ID for local development.
   *
   * @default "test"
   */
  accessKeyId?: string;

  /**
   * AWS secret access key for local development.
   *
   * @default "test"
   */
  secretAccessKey?: string;
}

export const localstack = defineService<Options>((config = {}) => {
  const {
    name = "localstack",
    image = "localstack/localstack:latest",
    port = 4566,
    services,
    region = "us-east-1",
    debug = false,
    persistence = false,
    accessKeyId = "test",
    secretAccessKey = "test",
  } = config;

  return {
    type: "container",
    name: "LocalStack",
    description:
      "A fully functional local AWS cloud stack for development and testing.",
    tags: ["aws", "cloud", "testing"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("localstack", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(4566, port)
        .withEnv("DEFAULT_REGION", region)
        .withEnv("AWS_ACCESS_KEY_ID", accessKeyId)
        .withEnv("AWS_SECRET_ACCESS_KEY", secretAccessKey)
        .withEnv("DEBUG", debug ? "1" : "0")
        .withEnv("PERSISTENCE", persistence ? "1" : "0")
        .withVolumeMount("data", "/var/lib/localstack");

      if (services) {
        service.withEnv("SERVICES", services);
      }

      // Mount Docker socket for Lambda and other services that need it
      service.with({
        HostConfig: {
          Binds: ["/var/run/docker.sock:/var/run/docker.sock"],
        },
      });

      return service;
    },
    metadata: () => {
      const endpoint = `http://localhost:${port}`;

      return [
        {
          label: "AWS Endpoint",
          description: "LocalStack gateway endpoint for all AWS services",
          value: endpoint,
        },
        {
          label: "AWS Credentials",
          description: "Access credentials for AWS SDK/CLI",
          value: `Access Key: ${accessKeyId}, Secret Key: ${secretAccessKey}`,
        },
        {
          label: "AWS CLI Config",
          description: "Configure AWS CLI to use LocalStack",
          value: `aws --endpoint-url=${endpoint} --region=${region}`,
        },
        {
          label: "S3 Example",
          description: "Example S3 command",
          value: `aws --endpoint-url=${endpoint} s3 ls`,
        },
      ];
    },
  };
});

