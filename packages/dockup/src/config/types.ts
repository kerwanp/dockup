import { ResolvedConfig } from "c12";
import { ServiceDefinition } from "../services/define_service.js";
import Dockerode from "dockerode";

export type DockupConfig = {
  name?: string;
  services: ServiceDefinition[];
  docker?: Dockerode.DockerOptions;
};

export type ResolvedDockupConfig = ResolvedConfig<
  DockupConfig & { name: string }
>;
