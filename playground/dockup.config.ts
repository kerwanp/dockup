import { defineConfig } from "dockup/config";

import { rabbitmq } from "dockup/services";

export default defineConfig({
  services: [rabbitmq()],
  docker: {
    socketPath: "/test",
  },
});
