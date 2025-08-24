import { ServiceDefinition } from "dockup";
import * as services from "dockup/services";

export function getRegistryServices() {
  const output: Record<string, ServiceDefinition> = {};

  for (const [id, def] of Object.entries(services)) {
    if (typeof def !== "function") continue;
    if (def === services.Service) continue;

    const instance = (def as services.ServiceFn<unknown>)();
    if (!instance.name) continue;
    output[id] = instance;
  }

  return output;
}

export function getRegistryService(id: string): ServiceDefinition | undefined {
  const services = getRegistryServices();
  return services[id];
}
