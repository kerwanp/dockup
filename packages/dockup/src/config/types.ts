import { ResolvedConfig } from "c12";
import { ServiceDefinition } from "../services/define_service.js";

export type DockupConfig = {
  name?: string;
  services: ServiceDefinition[];
};

export type ResolvedDockupConfig = ResolvedConfig<
  DockupConfig & { name: string }
>;
