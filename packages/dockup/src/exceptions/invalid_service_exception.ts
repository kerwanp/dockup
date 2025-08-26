import { Exception } from "./exception.js";

export class InvalidServiceException extends Exception {
  name = "ServiceNotFound";

  constructor(name: string, options?: ErrorOptions) {
    super(
      `The service '${name}' is not available in the registry\n↪ Visit https://dockup.dev/registry\n↪ Run 'dockup add' to select services`,
      options,
    );
  }
}
