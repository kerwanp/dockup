import pkg from "../../../package.json" with { type: "json" };
import { createDockupCommand } from "../create_command.js";
import { steps } from "../steps.js";
import { AddCommand } from "./add.js";
import { InitCommand } from "./init.js";
import { UpCommand } from "./up.js";
import { prompts } from "../utils.js";
import { createConfig } from "../../config/create_config.js";
import { ConnectCommand } from "./connect.js";
import { MetadataCommand } from "./metadata.js";
import { RmCommand } from "./rm.js";
import { log } from "@clack/prompts";

export type MainCommandArgs = [
  {
    cwd: string;
  },
];

export const MainCommand = createDockupCommand("dockup")
  .description("Manage your development environment")
  .version(pkg.version)
  .option("-C, --cwd <string>", "current working directory", process.cwd())
  .addCommand(InitCommand)
  .addCommand(AddCommand)
  .addCommand(UpCommand)
  .addCommand(ConnectCommand)
  .addCommand(MetadataCommand)
  .addCommand(RmCommand)
  .action(async (...[{ cwd }]: MainCommandArgs) => {
    try {
      await steps.assertInitialized(cwd);
      await steps.startTerminal();
    } catch {
      prompts.intro("dockup init");

      const services = await steps.selectServices();

      await steps.installDockupGlobally();
      await steps.installDockupLocally(cwd);

      await createConfig(cwd, services);

      log.success("Configuration created");

      prompts.outro("🚀 You can now run `dockup up`");
    }
  });
