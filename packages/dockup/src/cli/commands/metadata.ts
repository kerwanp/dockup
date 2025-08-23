import { log } from "@clack/prompts";
import chalk from "chalk";
import { defineCommand } from "citty";
import { colors, prompts } from "../utils.js";
import { steps } from "../steps.js";
import { loadDockup } from "../../load_dockup.js";

export default defineCommand({
  meta: {
    name: "metadata",
    description: "Retrieve service metadata",
  },
  async run() {
    prompts.intro("dockup metadata");

    const config = await steps.ensureConfig();
    const dockup = await loadDockup(config);

    for (const [i, service] of dockup.services.entries()) {
      const metadata = config.config.services[i]?.metadata?.();
      if (!metadata) continue;

      const output = [
        chalk.underline(chalk.bold(`${service.name}/${service.id} metadata`)),
        "",
      ];

      for (const meta of metadata) {
        output.push(`${meta.label}: ${chalk.hex(colors.muted)(meta.value)}`);
      }

      log.info(output.join("\n"));
    }
  },
});
