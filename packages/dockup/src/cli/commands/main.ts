import { defineCommand } from "citty";
import up from "./up.js";
import add from "./add.js";
import init from "./init.js";
import { steps } from "../steps.js";
import metadata from "./metadata.js";
import rm from "./rm.js";
import pkg from "../../../package.json" with { type: "json" };
import connect from "./connect.js";

export default defineCommand({
  meta: {
    name: "dockup",
    description: "Manage your development environment",
    version: pkg.version,
  },
  subCommands: {
    up,
    add,
    init,
    metadata,
    rm,
    connect,
  },
  async run({ args }) {
    if (args._.length !== 0) return;
    await steps.startTerminal();
  },
});
