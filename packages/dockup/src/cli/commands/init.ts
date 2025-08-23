import { defineCommand } from "citty";
import { steps } from "../steps.js";
import { prompts } from "../utils.js";

export default defineCommand({
  meta: {
    name: "init",
    description: "Initialize Dockup configuration",
  },
  async run() {
    prompts.intro("dockup init");

    await steps.init(true);
  },
});
