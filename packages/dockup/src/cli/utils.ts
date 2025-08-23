import { intro } from "@clack/prompts";
import chalk from "chalk";
import Dockerode from "dockerode";
import { execa } from "execa";

export const colors = {
  primary: "#6B51FF",
  onPrimary: "#FFFFFF",
  muted: "#54535D",
  secondary: "#767280",
  success: "#0FBC89",
  error: "#fb2c36",
  warning: "#fd9a00",
};

export const prompts = {
  intro: (value: string) => {
    console.log("");
    intro(chalk.bgHex(colors.primary)(` ${value} `));
  },
};

export async function isGloballyInstalled() {
  return execa`npm list -g dockup --depth=0 --json`
    .then(() => true)
    .catch(() => false);
}

export async function isDockerInstalled() {
  const docker = new Dockerode();
  return docker
    .version()
    .then(() => true)
    .catch(() => false);
}
