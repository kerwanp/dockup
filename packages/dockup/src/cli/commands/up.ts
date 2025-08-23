import { defineCommand } from "citty";
import { steps } from "../steps.js";

export default defineCommand({
  meta: {
    name: "up",
    description: "Starts the development environment",
  },
  async run() {
    await steps.startTerminal();
  },
});
