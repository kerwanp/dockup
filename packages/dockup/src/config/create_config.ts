import { writeFile } from "node:fs/promises";
import { join } from "pathe";
import { format } from "prettier";

export async function createConfig(
  cwd = process.cwd(),
  services: string[] = [],
) {
  const path = join(cwd, "dockup.config.ts");
  const code = [
    "import { defineConfig } from 'dockup/config';",
    services.length
      ? `import { ${services.join(", ")} } from 'dockup/services';`
      : "",
    "",
    "export default defineConfig({",
    "  services: [",
    services.map((s) => `${s}()`).join(", "),
    "  ]",
    "})",
  ].join("\n");

  await writeFile(path, await format(code, { filepath: path }));
}
