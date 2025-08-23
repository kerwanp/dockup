import { intro } from "@clack/prompts";
import { defineCommand } from "citty";
import { steps } from "../steps.js";
import { colors } from "../colors.js";
import chalk from "chalk";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize Dockup configuration",
  },
  async run() {
    intro(chalk.bgHex(colors.primary)(" dockup init "));

    await steps.init(true);
  },
});
