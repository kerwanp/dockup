import { intro, outro, spinner } from "@clack/prompts";
import chalk from "chalk";
import { execa } from "execa";

export const globalArgs = {
  cwd: {
    type: "string",
    required: false,
  },
} as const;

export const colors = {
  primary: "#6B51FF",
  onPrimary: "#FFFFFF",
  muted: "#54535D",
  secondary: "#a3a2ad",
  success: "#0FBC89",
  error: "#fb2c36",
  warning: "#fd9a00",
};

export const prompts = {
  intro: (value: string) => {
    console.log("");
    intro(chalk.bgHex(colors.primary)(` ${value} `));
  },
  outro: (value: string) => {
    outro(
      `${chalk.bgBlack(chalk.bgHex(colors.success)(` DONE `))}\n\n${value}`,
    );
  },
  task: async <T>(messages: [string, string], cb: () => Promise<T>) => {
    const s = spinner();

    s.start(messages[0]);

    const result = await cb();

    s.stop(messages[1]);

    return result;
  },
};

export async function isGloballyInstalled() {
  return execa`npm list -g dockup --depth=0 --json`
    .then(() => true)
    .catch(() => false);
}

export async function isDockerInstalled() {
  return execa`docker version`.then(() => true).catch(() => false);
}
