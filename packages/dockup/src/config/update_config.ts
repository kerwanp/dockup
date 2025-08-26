import { loadFile, writeFile } from "magicast";
import { loadConfig } from "./load_config.js";
import { ObjectExpression } from "@babel/types";

export async function updateConfig(cwd = process.cwd(), ...ids: string[]) {
  const { configFile } = await loadConfig(cwd);

  if (!configFile) throw new Error("Config not found");

  const module = await loadFile(configFile);

  for (const id of ids) {
    module.imports.$append({
      from: "dockup/services",
      imported: id,
    });
  }

  const root = module.exports.$ast;
  if (root.type === "Program") {
    const defaultExport = root.body.find(
      (node) => node.type === "ExportDefaultDeclaration",
    );

    if (!defaultExport) return false;
    if (defaultExport.declaration.type !== "CallExpression") return false;

    const obj = defaultExport.declaration.arguments[0];
    if (obj.type !== "ObjectExpression") return false;
    updateConfigObjectExpression(ids, obj);
  }

  await writeFile(module.$ast, configFile);

  return true;
}

function updateConfigObjectExpression(
  ids: string[],
  expression: ObjectExpression,
) {
  let prop;
  for (const property of expression.properties) {
    if (property.type !== "ObjectProperty") continue;
    if (property.key.type !== "Identifier") continue;
    prop = property;
  }

  if (!prop || prop.value.type !== "ArrayExpression") return false;

  for (const id of ids) {
    prop.value.elements.push({
      type: "CallExpression",
      callee: {
        type: "Identifier",
        name: id,
      },
      arguments: [],
    });
  }
}
