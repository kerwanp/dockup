import { defineCommand } from "citty";
import up from "./up.js";
import add from "./add.js";
import init from "./init.js";
import { loadDockup } from "../../load_dockup.js";
import { loadConfig } from "../../config/load_config.js";

export default defineCommand({
  meta: {
    name: "dockup",
    description: "Manage your development environment",
  },
  subCommands: {
    up,
    add,
    init,
  },
  async run() {
    const config = await loadConfig();

    const dockup = await loadDockup(config);

    // await startTerminal(dockup);
  },
});
