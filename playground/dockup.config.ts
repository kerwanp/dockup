import { defineConfig } from "dockup/config";
import { redis } from "dockup/services";

export default defineConfig({
  services: [redis()],
});
