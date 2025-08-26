import { Exception } from "./exception.js";

export class InvalidServiceNameException extends Exception {
  name = "ServiceNotFound";

  constructor(name: string, available: string[], options?: ErrorOptions) {
    super(
      `The service '${name}' is not available. (available: ${available.join(", ")})`,
      options,
    );
  }
}
