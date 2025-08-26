import { loadConfig as _loadConfig } from "c12";
import { DockupConfig } from "./types.js";

export async function loadConfig(cwd = process.cwd()) {
  const workspace = cwd.split("/").at(cwd.endsWith("/") ? -2 : -1);

  if (!workspace) throw new Error("Could not identify workspace");

  return _loadConfig<DockupConfig & { name: string }>({
    name: "dockup",
    cwd,
    overrides: {
      name: workspace,
      services: [],
    },
  });
}
