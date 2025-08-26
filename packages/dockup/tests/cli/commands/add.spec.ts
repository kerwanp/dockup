import { test } from "@japa/runner";
import { createConfig } from "../../../src/config/create_config.js";
import { AddCommand } from "../../../src/cli/commands/add.js";

test.group("init", (group) => {
  group.each.teardown(async ({ context }) => {
    await context.fs.cleanup();
  });

  test("should add a single service", async ({ fs, assert }) => {
    await fs.mkdir("");
    await createConfig(fs.basePath);

    await AddCommand.parseAsync([
      "dockup",
      "add",
      "--cwd",
      fs.basePath,
      "rabbitmq",
    ]);

    await assert.fileContains("dockup.config.ts", "rabbitmq");
  });

  test("should add multiple services", async ({ fs, assert }) => {
    await fs.mkdir("");
    await createConfig(fs.basePath);

    await AddCommand.parseAsync([
      "dockup",
      "add",
      "--cwd",
      fs.basePath,
      "rabbitmq",
      "postgresql",
    ]);

    await assert.fileContains("dockup.config.ts", "rabbitmq");
    await assert.fileContains("dockup.config.ts", "postgresql");
  });

  test("should fail with non existing service", async ({ fs, expect }) => {
    await fs.mkdir("");
    await createConfig(fs.basePath);

    await expect(() =>
      AddCommand.parseAsync([
        "dockup",
        "add",
        "--cwd",
        fs.basePath,
        "doesnotexist",
      ]),
    ).rejects.toBeInstanceOf(Error);
  });
});
