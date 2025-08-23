import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * Vault API port exposed on host.
   *
   * @default 8200
   */
  port?: number;

  /**
   * Root token for development mode.
   * Only used when devMode is true.
   *
   * @default "root"
   */
  rootToken?: string;

  /**
   * Enable development mode (automatic unsealing, in-memory storage).
   *
   * @default true
   */
  devMode?: boolean;

  /**
   * Vault server address to advertise.
   *
   * @default "http://127.0.0.1:8200"
   */
  apiAddr?: string;

  /**
   * Enable UI.
   *
   * @default true
   */
  ui?: boolean;
}

export const vault = defineService<Options>((config = {}) => {
  const {
    name = "vault",
    image = "hashicorp/vault:latest",
    port = 8200,
    rootToken = "root",
    devMode = true,
    apiAddr = `http://127.0.0.1:${port}`,
    ui = true,
  } = config;

  return {
    type: "container",
    name: "Vault",
    description:
      "Secure secrets management and data protection for applications and infrastructure.",
    tags: ["security", "secrets", "encryption"],
    create: async ({ workspace, docker }) => {
      const service = new ContainerService("vault", name, docker);

      service
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(8200, port)
        .withEnv("VAULT_ADDR", apiAddr)
        .withEnv("VAULT_API_ADDR", apiAddr);

      if (devMode) {
        service
          .withEnv("VAULT_DEV_ROOT_TOKEN_ID", rootToken)
          .withEnv("VAULT_DEV_LISTEN_ADDRESS", "0.0.0.0:8200")
          .withCmd(["server", "-dev"]);
      } else {
        service
          .withVolumeMount("data", "/vault/data")
          .withVolumeMount("config", "/vault/config")
          .withCmd(["server"]);
      }

      if (!ui) {
        service.withEnv("VAULT_UI", "false");
      }

      return service;
    },
    metadata: () => {
      const metadata = [
        {
          label: "Vault UI",
          description: "Web interface for managing secrets",
          value: `http://localhost:${port}/ui`,
        },
        {
          label: "API Endpoint",
          description: "Vault API endpoint",
          value: `http://localhost:${port}`,
        },
      ];

      if (devMode) {
        metadata.push({
          label: "Root Token",
          description: "Development mode root token",
          value: rootToken,
        });
        metadata.push({
          label: "CLI Login",
          description: "Login using Vault CLI",
          value: `export VAULT_ADDR='http://localhost:${port}' && vault login ${rootToken}`,
        });
      }

      return metadata;
    },
  };
});

