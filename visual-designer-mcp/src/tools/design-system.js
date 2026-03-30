import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TOKENS_FILE   = resolve(__dirname, "../../../visual-designer-system/tokens/tokens.json");
const BRAND_FILE    = resolve(__dirname, "../../../visual-designer-system/brand/brand-kit.json");
const STRATEGY_FILE = resolve(__dirname, "../../../visual-designer-system/docs/follower-growth-strategy.md");

export async function getDesignSystem({ section }) {
  const tokens = JSON.parse(readFileSync(TOKENS_FILE, "utf-8"));
  const brand  = JSON.parse(readFileSync(BRAND_FILE, "utf-8"));

  let output = "";

  if (section === "all" || section === "colors") {
    output += "## COLOR TOKENS\n\n";
    output += "### Base Colors\n";
    for (const [name, token] of Object.entries(tokens.color.base)) {
      output += `- **${name}**: \`${token.$value}\` — ${token.$description ?? ""}\n`;
    }
    output += "\n### Semantic Colors\n";
    for (const [name, token] of Object.entries(tokens.color.semantic)) {
      output += `- **${name}**: \`${token.$value}\`\n`;
    }
    output += "\n### Gradients\n";
    for (const [name, token] of Object.entries(tokens.color.gradient)) {
      output += `- **${name}**: \`${token.$value}\`\n`;
    }
    output += "\n";
  }

  if (section === "all" || section === "typography") {
    output += "## TYPOGRAPHY\n\n";
    output += "### Font Families\n";
    for (const [name, token] of Object.entries(tokens.typography.fontFamily)) {
      output += `- **${name}**: ${token.$value} — ${token.$description ?? ""}\n`;
    }
    output += "\n### Font Sizes\n";
    const sizes = Object.entries(tokens.typography.fontSize).map(([k, v]) => `${k}: ${v.$value}`).join(" | ");
    output += sizes + "\n\n";
    output += "### Font Weights\n";
    const weights = Object.entries(tokens.typography.fontWeight).map(([k, v]) => `${k}: ${v.$value}`).join(" | ");
    output += weights + "\n\n";
  }

  if (section === "all" || section === "spacing") {
    output += "## SPACING\n\n";
    const sp = Object.entries(tokens.spacing).map(([k, v]) => `${k}: ${v.$value}`).join(" | ");
    output += sp + "\n\n";
  }

  if (section === "all" || section === "shadows") {
    output += "## SHADOWS / GLOW EFFECTS\n\n";
    for (const [name, token] of Object.entries(tokens.shadow)) {
      output += `- **${name}**: \`${token.$value}\`\n`;
    }
    output += "\n";
  }

  if (section === "all" || section === "platforms") {
    output += "## PLATFORM CANVAS SIZES\n\n";
    for (const [name, token] of Object.entries(tokens.platform)) {
      output += `- **${name}**: ${token.$value} — ${token.$description ?? ""}\n`;
    }
    output += "\n";
  }

  if (section === "all" || section === "brand") {
    output += "## BRAND KIT\n\n";
    output += `**Name**: ${brand.identity.name}\n`;
    output += `**Handle**: ${brand.identity.handle}\n`;
    output += `**Title**: ${brand.identity.title}\n`;
    output += `**Tagline**: ${brand.tagline}\n`;
    output += `**Bio**: ${brand.identity.bio}\n`;
    output += `**Primary CTA**: ${brand.identity.cta_primary}\n\n`;
    output += "### Skill Stack\n";
    brand.skills_stack.forEach(s => { output += `${s.icon} ${s.label}\n`; });
    output += "\n";
  }

  if (section === "all" || section === "strategy") {
    const strategy = readFileSync(STRATEGY_FILE, "utf-8");
    output += "## FOLLOWER GROWTH STRATEGY\n\n";
    // Return first 2000 chars to keep it digestible
    output += strategy.substring(0, 2000) + "\n\n[...see full strategy in docs/follower-growth-strategy.md]\n";
  }

  return { output };
}
