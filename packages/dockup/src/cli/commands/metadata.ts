import { log } from "@clack/prompts";
import chalk from "chalk";
import { colors, prompts } from "../utils.js";
import { steps } from "../steps.js";
import { loadDockup } from "../../load_dockup.js";
import { createDockupCommand } from "../create_command.js";
import { loadConfig } from "../../config/load_config.js";
import { Exception } from "../../exceptions/exception.js";

export type MetadataCommandArgs = [string[], { cwd?: string }];

export const MetadataCommand = createDockupCommand("metadata")
  .description("retrieve services metadata")
  .option("-C, --cwd <string>", "current working directory")
  .argument("[services...]", "the service name")
  .action(async (...[ids, { cwd }]: MetadataCommandArgs) => {
    prompts.intro("dockup metadata");

    await steps.assertInitialized(cwd);

    const config = await loadConfig(cwd);
    const dockup = await loadDockup(config);

    const services = ids.length
      ? dockup.services.filter((service) => ids.includes(service.name))
      : dockup.services;

    if (!services.length) {
      throw new Exception(
        `No available services found for '${ids.join(", ")}'`,
      );
    }

    for (const [i, service] of services.entries()) {
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
  });
