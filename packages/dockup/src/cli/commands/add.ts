import { defineCommand } from "citty";

import * as containers from "../../../modules/services.js";
import { addServices } from "../../config/add_service.js";
import { intro, log } from "@clack/prompts";

export default defineCommand({
  meta: {
    name: "add",
    description: "Add a new service to your environment",
  },
  args: {
    name: {
      type: "positional",
      description: "The service name from the registry",
    },
  },
  async run({ args }) {
    intro(" dockup add ");

    const container = containers[args.name as keyof typeof containers];

    if (!container) {
      throw new Error(
        `Could not found '${args.name}' service. Check the registry at https://dockup.dev/registry`,
      );
    }

    const updated = await addServices(args.name);

    if (!updated) {
      throw new Error(
        `Your configuration file is not standard, you must add the service manually.`,
      );
    }

    log.success(`Configuration updated successfully`);
  },
});
