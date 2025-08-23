import { defineConfig } from "dockup/config";
import { postgresql, rabbitmq, redis } from "dockup/services";

export default defineConfig({
  services: [
    postgresql(),
    rabbitmq({ name: "rmq-1", management: 8080 }),
    redis(),
    rabbitmq({ name: "rmq-2", port: 8302, management: false }),
  ],
});
