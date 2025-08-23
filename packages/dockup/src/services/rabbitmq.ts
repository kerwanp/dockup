import Dockerode from "dockerode";
import { ContainerBuilder } from "../container/container_builder.js";
import { ContainerService } from "../container/container_service.js";
import { BaseConfig, defineService } from "./define_service.js";

export interface Options extends BaseConfig {
  /**
   * RabbitMQ default username.
   *
   * @default "guest"
   */
  user?: string;

  /**
   * RabbitMQ default password.
   *
   * @default "guest"
   */
  password?: string;

  /**
   * Enables management plugin.
   *
   * By default the dashboard is exposed on port `15672`,
   * it can be changed by setting this option to a port number.
   *
   * @default true
   */
  management?: boolean | number;

  /**
   * RabbitMQ exposted port on host.
   *
   * @default 5672
   */
  port?: number;

  /**
   * RabbitMQ default vhost.
   *
   * @default "/"
   */
  vhost?: string;
}

export const rabbitmq = defineService<Options>((config = {}) => {
  return {
    type: "container",
    name: "RabbitMQ",
    description:
      "An open-source message broker that enables applications to communicate by sending and receiving messages through queues.",
    tags: ["messaging"],
    async create({ workspace }) {
      const docker = new Dockerode();
      const {
        name = "rabbitmq",
        management = true,
        image = management ? "rabbitmq:management" : "rabbitmq:latest",
        user = "guest",
        password = "guest",
        vhost = "/",
        port = 5672,
      } = config;

      console.log(config, port);

      const container = new ContainerBuilder(docker);

      container
        .withName(`${workspace}_${name}`)
        .withImage(image)
        .withPort(5672, port)
        .withEnv("RABBITMQ_DEFAULT_USER", user)
        .withEnv("RABBITMQ_DEFAULT_PASS", password)
        .withEnv("RABBITMQ_DEFAULT_VHOST", vhost);

      console.log(container.options.HostConfig?.PortBindings);

      if (management) {
        container.withPort(
          15672,
          typeof management === "number" ? management : 15672,
        );
      }

      return new ContainerService("rabbitmq", name, container);
    },
  };
});
