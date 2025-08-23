import { ResolvedDockupConfig } from "./config/types.js";
import { Service } from "./services/service.js";

export interface Dockup {
  services: Service[];
  init(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
}

export async function loadDockup({
  config,
}: ResolvedDockupConfig): Promise<Dockup> {
  const services = await Promise.all(
    config.services.map((service) =>
      service.create({ workspace: config.name }),
    ),
  );

  return {
    services,
    init: async () => {
      await Promise.all(services.map((service) => service.init()));
    },
    start: async () => {
      await Promise.all(services.map((service) => service.start()));
    },
    stop: async () => {
      await Promise.all(services.map((service) => service.stop()));
    },
    restart: async () => {
      await Promise.all(services.map((service) => service.restart()));
    },
  };
}
