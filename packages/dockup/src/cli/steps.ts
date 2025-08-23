import { confirm, multiselect, spinner } from "@clack/prompts";
import * as services from "../../modules/services.js";
import { loadConfig } from "../config/load_config.js";
import { addDependency } from "nypm";
import { createConfig } from "../config/create_config.js";
import { loadDockup } from "../load_dockup.js";
import { startTerminal } from "./terminal/terminal.js";
import { addServices } from "../config/add_service.js";

export const steps = {
  async init(selectService = true) {
    const s = spinner();

    await createConfig();

    s.start("Installing dependencies");

    await addDependency("dockup", {
      workspace: true,
      silent: true,
    });

    s.stop("Dependencies installed");

    if (selectService) {
      const ids = await this.selectServices();
      await addServices(...ids);
    }

    return loadConfig();
  },

  async selectServices() {
    const selected = await multiselect({
      message: "What services do you want to configure?",
      options: Object.entries(services).map(([id, service]) => ({
        label: service().name,
        hint: service().description,
        value: id,
      })),
    });

    if (typeof selected === "symbol") process.exit(0);

    return selected;
  },

  async ensureConfig(selectServices = true) {
    const config = await loadConfig();

    if (config._configFile) return config;

    const init = await confirm({
      message:
        "Dockup is not yet initialized, do you want to run `dockup init`?",
    });

    if (typeof init === "symbol") process.exit(0);

    return this.init(selectServices);
  },

  async startTerminal() {
    const config = await this.ensureConfig();
    const dockup = await loadDockup(config);
    await startTerminal(dockup);
  },
};
