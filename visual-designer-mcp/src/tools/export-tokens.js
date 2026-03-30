import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_FILE = resolve(__dirname, "../../../visual-designer-system/tokens/tokens.json");
const OUTPUT_DIR  = resolve(__dirname, "../../output");

function flattenTokens(obj, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith("$")) continue;
    const path = prefix ? `${prefix}-${key}` : key;
    if (value && typeof value === "object" && "$value" in value) {
      result[path] = value.$value;
    } else if (value && typeof value === "object") {
      flattenTokens(value, path, result);
    }
  }
  return result;
}

export async function exportTokens({ format, output_path, prefix = "ds" }) {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const raw = JSON.parse(readFileSync(TOKENS_FILE, "utf-8"));
  const flat = flattenTokens(raw);

  let content = "";
  let ext = format;
  let preview = "";

  if (format === "css") {
    const vars = Object.entries(flat)
      .map(([k, v]) => `  --${prefix}-${k}: ${v};`)
      .join("\n");
    content = `:root {\n${vars}\n}\n`;
    preview = content.split("\n").slice(0, 20).join("\n") + "\n  /* ... */\n}";
    ext = "css";

  } else if (format === "scss") {
    content = Object.entries(flat)
      .map(([k, v]) => `$${prefix}-${k}: ${v};`)
      .join("\n") + "\n";
    preview = content.split("\n").slice(0, 20).join("\n") + "\n// ...";
    ext = "scss";

  } else if (format === "js") {
    const obj = Object.fromEntries(
      Object.entries(flat).map(([k, v]) => [
        k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
        v,
      ])
    );
    content = `export const tokens = ${JSON.stringify(obj, null, 2)};\n`;
    preview = content.split("\n").slice(0, 20).join("\n") + "\n  // ...";
    ext = "js";

  } else if (format === "ts") {
    const obj = Object.fromEntries(
      Object.entries(flat).map(([k, v]) => [
        k.replace(/-([a-z])/g, (_, c) => c.toUpperCase()),
        v,
      ])
    );
    content = `export const tokens = ${JSON.stringify(obj, null, 2)} as const;\nexport type TokenKey = keyof typeof tokens;\n`;
    preview = content.split("\n").slice(0, 20).join("\n") + "\n  // ...";
    ext = "ts";

  } else if (format === "json-flat") {
    content = JSON.stringify(flat, null, 2) + "\n";
    preview = JSON.stringify(Object.fromEntries(Object.entries(flat).slice(0, 10)), null, 2) + "\n  // ...";
    ext = "json";
  }

  const out = output_path ?? join(OUTPUT_DIR, `tokens.${ext}`);
  writeFileSync(out, content, "utf-8");

  return {
    message: `Exported ${Object.keys(flat).length} tokens → ${out}`,
    preview,
  };
}
