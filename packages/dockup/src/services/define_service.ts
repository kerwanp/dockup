import Dockerode from "dockerode";
import { Service } from "../services/service.js";
import { ContainerService } from "../container/container_service.js";

export type ServiceFn<T> = (config?: T) => ServiceDefinition;

export type ServiceType = "container";

export type ServiceMetadata = {
  label: string;
  description: string;
  value: string;
};

export type ServiceDefinition = {
  type: ServiceType;
  name?: string;
  description?: string;
  tags?: string[];
  create: (ctx: Context) => Promise<Service>;
  metadata?: () => ServiceMetadata[];
};

export type Context = {
  workspace: string;
  docker: Dockerode;
};

export type BaseConfig = {
  /**
   * Service name used to identify it.
   * You cannot have multiple services with the same name.
   */
  name?: string;

  /**
   * Override the Docker image used by the service.
   */
  image?: string;

  /**
   * Modifies the service.
   */
  extend?: (service: ContainerService) => ContainerService;
};

export function defineService<T extends BaseConfig>(
  options: (config?: T) => ServiceDefinition,
): ServiceFn<T> {
  return (config?: T) => {
    return options(config);
  };
}
