import { Service } from "../services/service.js";

export type ServiceFn = () => Promise<void>;

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
  dataPath: string;
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
};

export function defineService<T extends BaseConfig>(
  options: (config?: T) => ServiceDefinition,
) {
  return (config?: T) => {
    return options(config);
  };
}
