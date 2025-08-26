import { test } from "@japa/runner";
import { InitCommand } from "../../../src/cli/commands/init.js";

test.group("init", (group) => {
  group.each.teardown(async ({ context }) => {
    await context.fs.cleanup();
  });

  test("should initialize project", async ({ fs, assert }) => {
    await fs.mkdir("");
    await fs.createJson("package.json", {
      name: "dockup-cli-tests",
    });
    await fs.create("yarn.lock", "");

    await InitCommand.parseAsync([
      "yarn",
      "dockup",
      "--cwd",
      fs.basePath,
      "-s",
      "rabbitmq",
      "-s",
      "postgresql",
    ]);

    await assert.fileExists("dockup.config.ts");
    await assert.fileContains("dockup.config.ts", "rabbitmq");
    await assert.fileContains("dockup.config.ts", "postgresql");

    await assert.fileExists("package.json");
    await assert.fileContains("package.json", `"dockup": "`);
  }).timeout(30_000);

  test("should fail if already initialized", async ({ fs, expect }) => {
    await fs.create("dockup.config.ts", "");

    await expect(() =>
      InitCommand.parseAsync(["yarn", "dockup", "--cwd", fs.basePath]),
    ).rejects.toBeInstanceOf(Error);
  });
});
