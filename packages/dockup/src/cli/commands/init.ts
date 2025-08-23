import { defineCommand } from "citty";
import { steps } from "../steps.js";
import { prompts } from "../utils.js";
import { confirm, log } from "@clack/prompts";
import { loadConfig } from "../../config/load_config.js";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize Dockup configuration",
  },
  async run() {
    prompts.intro("dockup init");

    const config = await loadConfig();

    if (config._configFile) {
      log.error("Dockup is already initialized");
      return;
    }

    await steps.init(true);

    const shouldStart = await confirm({
      message: "Do you want to start Dockup?",
    });

    if (shouldStart) {
      await steps.startTerminal();
      return;
    }

    log.success("Get started using `dockup up`");
  },
});
