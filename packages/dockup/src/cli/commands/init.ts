import { intro, multiselect, spinner } from "@clack/prompts";
import { defineCommand } from "citty";
import Dockerode from "dockerode";
import { addDependency } from "nypm";
import * as services from "../../../modules/services.js";
import { createConfig } from "../../config/create_config.js";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize Dockup configuration",
  },
  async run() {
    intro(" dockup init ");

    try {
      const docker = new Dockerode();
      docker.version();
    } catch {
      throw new Error(
        "Could not find Docker installation. See https://dockup.dev/docs#docker",
      );
    }

    const s = spinner();

    s.start("Installing dependencies");

    await addDependency("dockup", {
      workspace: true,
      silent: true,
    });

    s.stop("Dependencies installed");

    const selected = await multiselect({
      message: "What services do you want to configure?",
      options: Object.entries(services).map(([id, service]) => ({
        label: service().name,
        hint: service().description,
        value: id,
      })),
    });

    if (typeof selected === "symbol") process.exit(0);

    await createConfig(process.cwd(), selected);
  },
});
