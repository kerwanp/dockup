import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { BaseConfig, defineService } from "./define_service.js";
import { ContainerService } from "../container/container_service.js";

export interface Options extends BaseConfig {
  /**
   * HTTP port exposed on host.
   *
   * @default 80
   */
  port?: number;

  /**
   * HTTPS port exposed on host.
   *
   * @default 443
   */
  httpsPort?: number;

  /**
   * Path to custom nginx.conf file on host.
   *
   * @default undefined
   */
  configPath?: string;

  /**
   * Path to directory containing static files to serve.
   *
   * @default undefined
   */
  webRoot?: string;

  /**
   * Path to SSL certificates directory on host.
   *
   * @default undefined
   */
  sslCertsPath?: string;

  /**
   * Enable directory listing.
   *
   * @default false
   */
  autoIndex?: boolean;

  /**
   * Custom server name (domain).
   *
   * @default "localhost"
   */
  serverName?: string;
}

export const nginx = defineService<Options>((config = {}) => {
  const {
    name = "nginx",
    image = "nginx:alpine",
    port = 80,
    httpsPort = 443,
    configPath,
    webRoot,
    sslCertsPath,
    autoIndex = false,
    serverName = "localhost",
  } = config;

  return {
    type: "container",
    name: "Nginx",
    description:
      "High-performance web server and reverse proxy for serving static content and load balancing.",
    tags: ["web", "proxy", "server"],
    create: async ({ workspace }) => {
      const docker = new Dockerode();
      const builder = new ContainerBuilder(docker);

      builder
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(80, port)
        .withPort(443, httpsPort)
        .withEnv("NGINX_HOST", serverName)
        .withVolumeMount("logs", "/var/log/nginx");

      // Mount custom config if provided
      if (configPath) {
        builder.merge({
          HostConfig: {
            Binds: [`${configPath}:/etc/nginx/nginx.conf:ro`],
          },
        });
      } else if (autoIndex) {
        // Create a default config with autoindex enabled
        builder.withCmd([
          "sh",
          "-c",
          `echo 'server { listen 80; server_name ${serverName}; location / { root /usr/share/nginx/html; index index.html; autoindex on; } }' > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'`,
        ]);
      }

      // Mount web root directory if provided
      if (webRoot) {
        builder.merge({
          HostConfig: {
            Binds: [`${webRoot}:/usr/share/nginx/html:ro`],
          },
        });
      }

      // Mount SSL certificates if provided
      if (sslCertsPath) {
        builder.merge({
          HostConfig: {
            Binds: [`${sslCertsPath}:/etc/nginx/ssl:ro`],
          },
        });
      }

      return new ContainerService("nginx", name, builder);
    },
    metadata: () => {
      const metadata = [
        {
          label: "HTTP URL",
          description: "HTTP endpoint",
          value: `http://localhost:${port}`,
        },
        {
          label: "HTTPS URL",
          description: "HTTPS endpoint (requires SSL certificates)",
          value: `https://localhost:${httpsPort}`,
        },
      ];

      if (webRoot) {
        metadata.push({
          label: "Web Root",
          description: "Serving static files from",
          value: webRoot,
        });
      }

      if (configPath) {
        metadata.push({
          label: "Config File",
          description: "Using custom configuration from",
          value: configPath,
        });
      }

      return metadata;
    },
  };
});