import { confirm, log, multiselect, select, spinner } from "@clack/prompts";
import * as services from "../../modules/services.js";
import { loadConfig } from "../config/load_config.js";
import { addDependency, PackageManagerName } from "nypm";
import { createConfig } from "../config/create_config.js";
import { loadDockup } from "../load_dockup.js";
import { startTerminal } from "./terminal/terminal.js";
import { addServices } from "../config/add_service.js";
import { isDockerInstalled, isGloballyInstalled } from "./utils.js";

export const steps = {
  async init(selectService = true) {
    if (!(await isDockerInstalled())) {
      log.error(
        "Docker is required to run Dockup: https://dockup.dev/docs#docker",
      );
      process.exit(0);
    }

    await this.installGlobally();
    await this.installLocally();

    let ids: string[] | undefined;
    if (selectService) {
      ids = await this.selectServices();
    }

    await createConfig();

    if (ids) {
      await addServices(...ids);
    }

    return loadConfig();
  },

  async installGlobally() {
    if (await isGloballyInstalled()) {
      return;
    }

    const pm = await this.selectPackageManager(
      "What package manager do you want to use to install Dockup globally?",
      "npm",
    );

    if (typeof pm === "symbol") process.exit(0);

    const s = spinner();

    s.start(`Installing 'dockup' globally using '${pm}'`);

    await addDependency("dockup", {
      packageManager: pm,
      global: true,
      silent: true,
    });

    s.stop(`Installed 'dockup' globally using '${pm}'`);
  },

  async installLocally() {
    const s = spinner();

    s.start("Installing dependencies");

    await addDependency("dockup", {
      workspace: true,
      silent: true,
    });

    s.stop("Installed dependencies");
  },

  async selectPackageManager(
    title = "What package manager do you want to use?",
    recommended?: PackageManagerName,
  ) {
    const options: PackageManagerName[] = ["npm", "yarn", "bun", "pnpm"];
    const result = await select({
      message: title,
      options: options.map((pm) => ({
        label: pm,
        hint: recommended === pm ? "Recommended" : undefined,
        value: pm,
      })),
    });

    if (typeof result === "symbol") process.exit(0);

    return result;
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
