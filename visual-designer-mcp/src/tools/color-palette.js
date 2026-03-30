import chroma from "chroma-js";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = resolve(__dirname, "../../output");

function wcagRatio(c1, c2) {
  return chroma.contrast(c1, c2).toFixed(2);
}

function buildScale(base, steps) {
  const scale = chroma.scale(["#ffffff", base, "#000000"]).mode("lab").colors(steps + 2);
  return scale.slice(1, -1).map((hex, i) => ({
    step: Math.round((i / (steps - 1)) * 900 + 50),
    hex,
    on_white: wcagRatio(hex, "#ffffff"),
    on_black: wcagRatio(hex, "#000000"),
  }));
}

export async function generateColorPalette({ base_color, palette_type, steps, output_format }) {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const base = chroma(base_color);
  const hsl = base.hsl();
  const result = { base: base_color, type: palette_type };

  if (palette_type === "tints-shades" || palette_type === "full") {
    result.scale = buildScale(base_color, steps);
  }

  if (palette_type === "complementary" || palette_type === "full") {
    const comp = chroma.hsl((hsl[0] + 180) % 360, hsl[1], hsl[2]);
    result.complementary = { hex: comp.hex(), scale: buildScale(comp.hex(), 5) };
  }

  if (palette_type === "analogous" || palette_type === "full") {
    result.analogous = [
      { angle: -30, hex: chroma.hsl((hsl[0] - 30 + 360) % 360, hsl[1], hsl[2]).hex() },
      { angle:  30, hex: chroma.hsl((hsl[0] + 30) % 360, hsl[1], hsl[2]).hex() },
    ];
  }

  if (palette_type === "triadic" || palette_type === "full") {
    result.triadic = [
      { angle: 120, hex: chroma.hsl((hsl[0] + 120) % 360, hsl[1], hsl[2]).hex() },
      { angle: 240, hex: chroma.hsl((hsl[0] + 240) % 360, hsl[1], hsl[2]).hex() },
    ];
  }

  if (palette_type === "split-complementary" || palette_type === "full") {
    result.split_complementary = [
      { angle: 150, hex: chroma.hsl((hsl[0] + 150) % 360, hsl[1], hsl[2]).hex() },
      { angle: 210, hex: chroma.hsl((hsl[0] + 210) % 360, hsl[1], hsl[2]).hex() },
    ];
  }

  // Contrast-safe pairs
  result.safe_pairs = {
    on_white: `WCAG ratio on white: ${wcagRatio(base_color, "#ffffff")} ${Number(wcagRatio(base_color, "#ffffff")) >= 4.5 ? "✓ AA" : "✗ fails AA"}`,
    on_black: `WCAG ratio on black: ${wcagRatio(base_color, "#000000")} ${Number(wcagRatio(base_color, "#000000")) >= 4.5 ? "✓ AA" : "✗ fails AA"}`,
    on_bg:    `WCAG ratio on #0A0A0F: ${wcagRatio(base_color, "#0A0A0F")} ${Number(wcagRatio(base_color, "#0A0A0F")) >= 4.5 ? "✓ AA" : "✗ fails AA"}`,
  };

  let output = "";

  if (output_format === "json") {
    output = JSON.stringify(result, null, 2);
  } else if (output_format === "css") {
    const lines = [`/* Color palette generated from ${base_color} */`, `:root {`];
    if (result.scale) {
      result.scale.forEach(({ step, hex }) => lines.push(`  --color-${step}: ${hex};`));
    }
    if (result.complementary) lines.push(`  --color-complementary: ${result.complementary.hex};`);
    if (result.analogous) result.analogous.forEach((a, i) => lines.push(`  --color-analogous-${i + 1}: ${a.hex};`));
    if (result.triadic) result.triadic.forEach((t, i) => lines.push(`  --color-triadic-${i + 1}: ${t.hex};`));
    lines.push(`}`);
    output = lines.join("\n");
  } else if (output_format === "figma-tokens") {
    const tokens = {};
    if (result.scale) {
      result.scale.forEach(({ step, hex }) => { tokens[step] = { $value: hex, $type: "color" }; });
    }
    output = JSON.stringify({ generated: tokens }, null, 2);
  }

  const ext = output_format === "figma-tokens" ? "json" : output_format === "json" ? "json" : "css";
  const outFile = join(OUTPUT_DIR, `palette-${base_color.replace("#", "")}.${ext}`);
  writeFileSync(outFile, output, "utf-8");

  return { output: output + `\n\n// Saved to: ${outFile}` };
}
