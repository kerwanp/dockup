import { defineCommand } from "citty";

import * as services from "../../../modules/services.js";
import { addServices } from "../../config/add_service.js";
import { log } from "@clack/prompts";
import { prompts } from "../utils.js";
import { steps } from "../steps.js";

export default defineCommand({
  meta: {
    name: "add",
    description: "Add a new service to your environment",
  },
  args: {
    name: {
      type: "positional",
      description: "The service name from the registry",
      required: false,
    },
  },
  async run({ args }) {
    prompts.intro("dockup add");

    await steps.ensureConfig(false);

    let ids: string[] = [];

    if (args.name) {
      const service = services[args.name as keyof typeof services];

      if (!service) {
        throw new Error(
          `Could not found '${args.name}' service. Check the registry at https://dockup.dev/registry`,
        );
      }

      ids.push(args.name);
    } else {
      ids = await steps.selectServices();
    }

    const updated = await addServices(...ids);

    if (!updated) {
      throw new Error(
        `Your configuration file is not standard, you must add the service manually.`,
      );
    }

    log.success(`Configuration updated successfully`);
  },
});
