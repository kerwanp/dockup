import { defineCommand } from "citty";
import up from "./up.js";
import add from "./add.js";
import init from "./init.js";
import { steps } from "../steps.js";
import metadata from "./metadata.js";
import rm from "./rm.js";

export default defineCommand({
  meta: {
    name: "dockup",
    description: "Manage your development environment",
  },
  subCommands: {
    up,
    add,
    init,
    metadata,
    rm,
  },
  async run({ args }) {
    if (args._.length !== 0) return;
    await steps.startTerminal();
  },
});
