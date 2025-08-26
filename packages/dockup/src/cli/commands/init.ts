import { prompts } from "../utils.js";
import { createDockupCommand } from "../create_command.js";
import { steps } from "../steps.js";
import { createConfig } from "../../config/create_config.js";

export type InitCommandArgs = {
  cwd: string;
  service?: string[];
};

export const InitCommand = createDockupCommand("init")
  .description("initialize Dockup project")
  .option("-s, --service [services...]", "services to configure")
  .option("-C, --cwd <string>", "current working directory")
  .action(async (args: InitCommandArgs) => {
    prompts.intro("dockup init");

    await steps.assertNotInitialized(args.cwd);

    const services = args.service ?? (await steps.selectServices());

    await steps.installDockupGlobally();
    await steps.installDockupLocally(args.cwd);

    await createConfig(args.cwd, services);
  });
