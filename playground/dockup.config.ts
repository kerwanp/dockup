import { defineConfig } from "dockup/config";

import { vault, redis, rabbitmq } from "dockup/services";

export default defineConfig({
  services: [vault(), redis(), rabbitmq()],
});