import { ContainerService } from "../container/container_service.js";
import { defineService } from "./define_service.js";

export type Options = {
  name: string;
  image: string;
  extend: (service: ContainerService) => ContainerService;
};

export const container = defineService<Options>((config) => {
  return {
    type: "container",
    async create({ workspace, docker }) {
      const { name = "container", image = "ubuntu:latest" } = config ?? {};
      const service = new ContainerService("custom", name, docker);

      service.withName(`${workspace}_${name}`).withImage(image);

      if (config?.extend) {
        config.extend(service);
      }

      return service;
    },
  };
});
