import { defineCommand } from "citty";
import { loadConfig } from "../../config/load_config.js";
import { loadDockup } from "../../load_dockup.js";
import { log } from "@clack/prompts";
import { prompts } from "../utils.js";

export default defineCommand({
  meta: {
    name: "connect",
    description: "Connect to a running service",
  },
  args: {
    service: {
      type: "positional",
      description: "The service name",
      required: true,
    },
  },
  async run({ args }) {
    prompts.intro("dockup connect");

    const config = await loadConfig();
    const dockup = await loadDockup(config);

    const service = dockup.service(args.service);

    if (!service.connect) {
      log.error("This service does not support connection");
      process.exit(1);
    }

    await service.connect();
  },
});
