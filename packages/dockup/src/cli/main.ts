import { MainCommand } from "./commands/main.js";
import { log } from "@clack/prompts";
import chalk from "chalk";
import { Exception } from "../exceptions/exception.js";

export async function run() {
  process.on("uncaughtException", (error) => {
    if (error instanceof Exception) {
      log.error(
        `${chalk.black(chalk.bgRed(" ERROR "))} ${error.name}\n\n${error.message}`,
      );
    } else {
      console.error(error);
    }
  });

  await MainCommand.parseAsync();
}
