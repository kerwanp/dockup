import { loadConfig as _loadConfig } from "c12";
import { DockupConfig } from "./types.js";

export async function loadConfig(cwd = process.cwd()) {
  const workspace = cwd.split("/").at(-1);

  if (!workspace) throw new Error("Could not identify workspace");

  return _loadConfig<DockupConfig & { name: string }>({
    name: "dockup",
    overrides: {
      name: workspace,
      services: [],
    },
  });
}
