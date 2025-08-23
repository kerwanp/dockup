import { intro } from "@clack/prompts";
import chalk from "chalk";

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
  intro: (value: string) => intro(chalk.bgHex(colors.primary)(` ${value} `)),
};
