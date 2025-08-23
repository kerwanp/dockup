import { Service } from "../services/service.js";
import { Exception } from "./exception.js";

export class ServiceNotFoundException extends Exception {
  name = "ServiceNotFound";

  constructor(id: string, available?: Service[]) {
    if (available) {
      const msg = available.map((s) => s.instance).join(", ");
      super(
        `Could not find service ${id} make sure to use the service name. (Available: ${msg})`,
      );
      return;
    }

    super(`Could not find service ${id} make sure to use the service name.`);
  }
}
