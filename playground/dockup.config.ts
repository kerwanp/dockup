import { defineConfig } from "dockup/config";

import { redis, rabbitmq, vault } from "dockup/services";

export default defineConfig({
  services: [redis(), rabbitmq(), vault()],
});