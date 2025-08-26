import { multiselect } from "@clack/prompts";
import * as services from "../../modules/services.js";
import { loadConfig } from "../config/load_config.js";
import { addDependency } from "nypm";
import { loadDockup } from "../load_dockup.js";
import { startTerminal } from "./terminal/terminal.js";
import { isGloballyInstalled, prompts } from "./utils.js";
import { join } from "pathe";
import { stat } from "node:fs/promises";

export const steps = {
  async assertInitialized(cwd = process.cwd()) {
    const path = join(cwd, "dockup.config.ts");

    const isInstalled = await stat(path)
      .then(() => true)
      .catch(() => false);

    if (!isInstalled) {
      throw new Error(
        "Dockup is not initialized.\nRun `dockup init` to get started.",
      );
    }
  },
  async assertNotInitialized(cwd = process.cwd()) {
    const path = join(cwd, "dockup.config.ts");

    const isInstalled = await stat(path)
      .then(() => true)
      .catch(() => false);

    if (isInstalled) {
      throw new Error("Dockup is already initialized");
    }
  },
  async selectServices() {
    const selected = await multiselect({
      message: "What services do you want to configure?",
      options: Object.entries(services)
        .filter(([id]) => id !== "container")
        .map(([id, service]) => {
          const instance = service();

          return {
            label: instance.name,
            hint: instance.description,
            value: id,
          };
        }),
    });

    if (typeof selected === "symbol") process.exit(0);

    return selected;
  },
  async installDockupGlobally() {
    if (await isGloballyInstalled()) return;

    await prompts.task(
      ["Installing dockup globally", "Installed dockup globally"],
      () =>
        addDependency("dockup", {
          packageManager: "npm",
          global: true,
          silent: true,
        }),
    );
  },
  async installDockupLocally(cwd = process.cwd()) {
    await prompts.task(
      ["Installing Dockup locally", "Installed Dockup locally"],
      () => addDependency("dockup", { silent: true, cwd, workspace: false }),
    );
  },

  async startTerminal(cwd = process.cwd()) {
    await this.assertInitialized();

    const config = await loadConfig(cwd);
    const dockup = await loadDockup(config);
    await startTerminal(dockup);
  },
};
