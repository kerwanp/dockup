import { loadConfig } from "../../config/load_config.js";
import { loadDockup } from "../../load_dockup.js";
import { prompts } from "../utils.js";
import { createDockupCommand } from "../create_command.js";
import { Exception } from "../../exceptions/exception.js";

export type ConnectCommandArgs = [service: string, { cwd?: string }];

export const ConnectCommand = createDockupCommand("connect")
  .argument("<service>", "service name to connect")
  .option("-C, --cwd <string>", "current working directory")
  .description("connect to a running service")
  .action(async (...[serviceId, { cwd }]: ConnectCommandArgs) => {
    prompts.intro("dockup connect");

    const config = await loadConfig(cwd);
    const dockup = await loadDockup(config);

    const service = dockup.service(serviceId);

    if (!service.connect) {
      throw new Exception(
        `The service ${serviceId} does not support connection`,
      );
    }

    await service.connect();
  });
