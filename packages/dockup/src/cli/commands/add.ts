import { prompts } from "../utils.js";
import { createDockupCommand } from "../create_command.js";
import { steps } from "../steps.js";
import { log } from "@clack/prompts";
import * as services from "../../../modules/services.js";
import { updateConfig } from "../../config/update_config.js";
import { InvalidServiceException } from "../../exceptions/invalid_service_exception.js";

export type AddCommandOptions = {
  cwd?: string;
};

export const AddCommand = createDockupCommand("add")
  .description("add service(s) to configuration")
  .argument("[services...]", "services to install")
  .option("-C, --cwd <string>", "current working directory")
  .action(async (ids: string[], args: AddCommandOptions) => {
    prompts.intro("dockup add");

    await steps.assertInitialized(args.cwd);

    const toInstall = ids.length ? ids : await steps.selectServices();

    for (const id of toInstall) {
      if (services[id as keyof typeof services]) continue;
      throw new InvalidServiceException(id);
    }

    await updateConfig(args.cwd, ...toInstall);

    log.success(`Added ${toInstall.length} services to 'dockup.config.ts'`);
  });
