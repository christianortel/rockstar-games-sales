import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const rootUrl = new URL("../", import.meta.url);
const extensions = ["", ".ts", ".tsx", ".js", ".mjs", ".json"];

function resolveWorkspaceUrl(pathname) {
  for (const extension of extensions) {
    const url = new URL(`${pathname}${extension}`, rootUrl);
    if (existsSync(fileURLToPath(url))) {
      if (statSync(fileURLToPath(url)).isDirectory()) {
        continue;
      }
      return url.href;
    }
  }

  for (const extension of extensions.slice(1)) {
    const url = new URL(`${pathname}/index${extension}`, rootUrl);
    if (existsSync(fileURLToPath(url))) {
      return url.href;
    }
  }

  return new URL(pathname, rootUrl).href;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    return nextResolve(resolveWorkspaceUrl(specifier.slice(2)), context);
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (url.endsWith(".json")) {
    return {
      format: "module",
      shortCircuit: true,
      source: `export default ${readFileSync(fileURLToPath(url), "utf8")};`
    };
  }

  if (url.endsWith(".ts") || url.endsWith(".tsx")) {
    const source = readFileSync(fileURLToPath(url), "utf8");
    const output = ts.transpileModule(source, {
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        moduleResolution: ts.ModuleResolutionKind.Bundler,
        target: ts.ScriptTarget.ES2022
      },
      fileName: fileURLToPath(url)
    });

    return {
      format: "module",
      shortCircuit: true,
      source: output.outputText
    };
  }

  return nextLoad(url, context);
}
