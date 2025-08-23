import { ResolvedDockupConfig } from "./config/types.js";
import { Service } from "./services/service.js";
import { ServiceNotFoundException } from "./exceptions/service_not_found_exception.js";

export interface Dockup {
  services: Service[];

  /**
   * Retrieve a service by its id.
   */
  service(id: string): Service;

  /**
   * Initialize services.
   */
  init(id?: string): Promise<void>;

  /**
   * Start services.
   */
  start(id?: string): Promise<void>;

  /**
   * Stop services.
   */
  stop(id?: string): Promise<void>;

  /**
   * Restart services.
   */
  restart(id?: string): Promise<void>;

  /**
   * Remove services.
   */
  remove(id?: string): Promise<void>;
}

export async function loadDockup({
  config,
}: ResolvedDockupConfig): Promise<Dockup> {
  const services = await Promise.all(
    config.services.map((service) =>
      service.create({
        workspace: config.name,
      }),
    ),
  );

  return {
    services,
    service(id) {
      const output = services.find((service) => service.id === id);
      if (!output) throw new ServiceNotFoundException(id);
      return output;
    },
    async init(id?: string) {
      if (!id) {
        await Promise.all(services.map((service) => service.init()));
        return;
      }

      const service = this.service(id);
      await service.init();
    },
    async start(id?: string) {
      if (!id) {
        await Promise.all(services.map((service) => service.start()));
        return;
      }

      const service = this.service(id);
      await service.start();
    },
    async stop(id?: string) {
      if (!id) {
        await Promise.all(services.map((service) => service.stop()));
        return;
      }

      const service = this.service(id);
      await service.stop();
    },
    async restart(id?: string) {
      if (!id) {
        await Promise.all(this.services.map((service) => service.restart()));
        return;
      }

      const service = this.service(id);
      await service.restart();
    },
    async remove(id?: string) {
      if (!id) {
        await Promise.all(this.services.map((service) => service.remove()));
        return;
      }

      const service = this.service(id);
      await service.remove();
    },
  } satisfies Dockup;
}
