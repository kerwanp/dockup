import chalk from "chalk";
import { program as _program, createCommand } from "commander";
import { colors } from "./utils.js";

export function createDockupCommand(name: string) {
  return createCommand(name)
    .showHelpAfterError()
    .configureHelp({
      styleTitle: (str) =>
        chalk.bold(chalk.bgHex(colors.primary)(` ${str.replace(":", "")} `)),
      styleDescriptionText: (str) => chalk.hex(colors.muted)(str),
      styleSubcommandText: (str) => chalk.hex(colors.warning)(str),
      styleUsage: (str) => chalk.hex(colors.warning)(str),
      styleArgumentText: (str) => chalk.hex(colors.secondary)(str),
      styleOptionText: (str) => chalk.hex(colors.secondary)(str),
    })
    .configureOutput({
      outputError: (err) =>
        console.error(
          `${chalk.black(chalk.bgRed(" ERROR "))} ${err.replace("error: ", "")}`,
        ),
    })
    .allowUnknownOption();
}
