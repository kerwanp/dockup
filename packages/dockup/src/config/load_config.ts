import { loadConfig as _loadConfig } from "c12";
import { DockupConfig } from "./types.js";

export async function loadConfig() {
  return _loadConfig<DockupConfig & { name: string }>({
    name: "dockup",
    overrides: {
      name: "dockup",
      services: [],
    },
  });
}
