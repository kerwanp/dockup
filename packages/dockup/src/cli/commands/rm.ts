import { defineCommand } from "citty";
import { prompts } from "../utils.js";
import { loadConfig } from "../../config/load_config.js";
import { loadDockup } from "../../load_dockup.js";
import { confirm, log, tasks } from "@clack/prompts";

export default defineCommand({
  meta: {
    name: "rm",
    description: "Remove a service and its data",
  },
  args: {
    service: {
      type: "positional",
      description: "The service name",
      required: false,
    },
  },
  async run({ args }) {
    prompts.intro("dockup rm");

    const config = await loadConfig();
    const dockup = await loadDockup(config);

    const services = args.service
      ? [args.service]
      : dockup.services.map((s) => s.instance);

    log.warn(`Services to be removed: ${services.join(", ")}`);

    const shouldDelete = await confirm({
      message:
        "Removing the services will destroy the containers and their volumes",
    });

    if (shouldDelete !== true) {
      log.error("Action cancelled");
      return;
    }

    await tasks(
      services.map((service) => ({
        title: `Removing service '${service}'`,
        async task() {
          await dockup.remove(service);
          return `Removed service '${service}'`;
        },
      })),
    );
  },
});
