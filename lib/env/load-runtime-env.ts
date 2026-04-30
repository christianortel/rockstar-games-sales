import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const loadedFiles = new Set<string>();

function parseEnvLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice("export ".length).trim() : trimmed;
  const equalsIndex = normalized.indexOf("=");

  if (equalsIndex <= 0) {
    return null;
  }

  const key = normalized.slice(0, equalsIndex).trim();
  let value = normalized.slice(equalsIndex + 1).trim();

  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
    return null;
  }

  if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

export function loadRuntimeEnv(cwd = process.cwd()) {
  const envFiles = [".env.local", ".env"];
  const loaded: string[] = [];

  for (const envFile of envFiles) {
    const absolutePath = path.join(cwd, envFile);

    if (!existsSync(absolutePath) || loadedFiles.has(absolutePath)) {
      continue;
    }

    const contents = readFileSync(absolutePath, "utf8");

    for (const line of contents.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);

      if (parsed && process.env[parsed.key] === undefined) {
        process.env[parsed.key] = parsed.value;
      }
    }

    loadedFiles.add(absolutePath);
    loaded.push(envFile);
  }

  return loaded;
}
