import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../../../visual-designer-system/templates");
const OUTPUT_DIR    = resolve(__dirname, "../../output");

export async function createDesignVariant({
  template,
  handle,
  name,
  headline,
  primary_color,
  accent_color,
  stats,
  output_path,
}) {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const templateFile = join(TEMPLATES_DIR, `${template}.html`);
  if (!existsSync(templateFile)) {
    return { message: `Template not found: ${templateFile}` };
  }

  let html = readFileSync(templateFile, "utf-8");

  // Replace handle
  if (handle) {
    html = html.replace(/@yourhandle/g, handle);
    html = html.replace(/yourhandle/g, handle.replace("@", ""));
  }

  // Replace name/brand
  if (name) {
    html = html.replace(/\[YOUR NAME\]/g, name);
    html = html.replace(/DESIGN MASTER/g, name.toUpperCase());
    html = html.replace(/Design Master/g, name);
  }

  // Replace headline
  if (headline) {
    // Replace the main headline text patterns
    html = html.replace(/FOLLOW<br>\s*FOR <span class="accent-purple">PRO<\/span><br>\s*<span class="accent-cyan">DESIGN<\/span>/g,
      headline.toUpperCase().replace(/\n/g, "<br>"));
  }

  // Replace primary color (purple #7B2FFF)
  if (primary_color) {
    html = html.replace(/#7B2FFF/g, primary_color);
    html = html.replace(/rgba\(123,47,255/g, `rgba(${hexToRgb(primary_color)}`);
  }

  // Replace accent color (cyan #00F5FF)
  if (accent_color) {
    html = html.replace(/#00F5FF/g, accent_color);
    html = html.replace(/rgba\(0,245,255/g, `rgba(${hexToRgb(accent_color)}`);
  }

  // Replace stats
  if (stats) {
    if (stats.projects) html = html.replace(/500\+/g, stats.projects);
    if (stats.experience) html = html.replace(/8yr/g, stats.experience);
    if (stats.label) html = html.replace(/2D·3D/g, stats.label);
  }

  // Replace portfolio url
  html = html.replace(/yourportfolio\.com/g, handle ? `${handle.replace("@", "")}.com` : "yourportfolio.com");

  const out = output_path ?? join(OUTPUT_DIR, `${template}-variant.html`);
  writeFileSync(out, html, "utf-8");

  return {
    message: `Created variant → ${out}\nCustomizations applied: ${[
      handle && `handle=${handle}`,
      name && `name=${name}`,
      headline && `headline="${headline}"`,
      primary_color && `primary=${primary_color}`,
      accent_color && `accent=${accent_color}`,
      stats && `stats`,
    ].filter(Boolean).join(", ")}`,
  };
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`
    : "123,47,255";
}
