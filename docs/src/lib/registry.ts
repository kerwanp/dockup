import { ServiceDefinition } from "dockup";
import * as services from "dockup/services";

export function getRegistryServices() {
  const output: Record<string, ServiceDefinition> = {};

  for (const [id, def] of Object.entries(services)) {
    const instance = def();
    if (!instance.name) continue;
    output[id] = def();
  }

  return output;
}

export function getRegistryService(id: string): ServiceDefinition | undefined {
  const services = getRegistryServices();
  return services[id];
}
