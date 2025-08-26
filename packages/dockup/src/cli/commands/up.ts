import { steps } from "../steps.js";
import { createDockupCommand } from "../create_command.js";

export type UpCommandOptions = {
  cwd: string;
};

export const UpCommand = createDockupCommand("up")
  .description("start the services")
  .option("-C, --cwd <string>", "current working directory")
  .action(async (options: UpCommandOptions) => {
    await steps.startTerminal(options.cwd);
  });
