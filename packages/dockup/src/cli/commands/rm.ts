import { prompts } from "../utils.js";
import { loadConfig } from "../../config/load_config.js";
import { loadDockup } from "../../load_dockup.js";
import { confirm, log, tasks } from "@clack/prompts";
import { createDockupCommand } from "../create_command.js";

export type MetadataCommandArgs = [string[], { cwd?: string }];

export const RmCommand = createDockupCommand("rm")
  .description("destroy service(s) by removing containers")
  .option("-C, --cwd <string>", "current working directory")
  .argument("[services...]", "the service name")
  .action(async (...[ids, { cwd }]: MetadataCommandArgs) => {
    prompts.intro("dockup rm");

    const config = await loadConfig(cwd);
    const dockup = await loadDockup(config);

    const services = ids.length ? ids : dockup.services.map((s) => s.id);

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
  });
