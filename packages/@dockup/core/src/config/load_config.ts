import { loadConfig as _loadConfig } from "c12";
import { DockupConfig } from "./types.js";

export async function loadConfig() {
  const { config } = await _loadConfig<DockupConfig>({
    name: "dockup",
  });

  return config;
}
