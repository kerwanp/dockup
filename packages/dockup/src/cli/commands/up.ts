import { defineCommand } from "citty";
import { loadConfig } from "../../config/load_config.js";
import { loadDockup } from "../../load_dockup.js";
import { startTerminal } from "../terminal/terminal.js";

export default defineCommand({
  meta: {
    name: "up",
    description: "Starts the development environment",
  },
  async run() {
    const config = await loadConfig();

    const dockup = await loadDockup(config);

    await startTerminal(dockup);
  },
});
