import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { renderTemplate } from "./tools/render-template.js";
import { exportTokens } from "./tools/export-tokens.js";
import { generateSocialCopy } from "./tools/generate-copy.js";
import { generateColorPalette } from "./tools/color-palette.js";
import { createDesignVariant } from "./tools/design-variant.js";
import { getDesignSystem } from "./tools/design-system.js";

const server = new McpServer({
  name: "visual-designer-mcp",
  version: "1.0.0",
});

// ─── Tool: Render Template to PNG ───────────────────────────────────────────
server.tool(
  "render_template",
  "Render a design template (instagram-post, youtube-banner, story, poster) to a PNG file using headless Chrome",
  {
    template: z.enum(["instagram-post", "youtube-banner", "story", "poster"]).describe("Which template to render"),
    output_path: z.string().optional().describe("Output file path (default: output/<template>.png)"),
    width: z.number().optional().describe("Override canvas width in pixels"),
    height: z.number().optional().describe("Override canvas height in pixels"),
  },
  async ({ template, output_path, width, height }) => {
    const result = await renderTemplate({ template, output_path, width, height });
    return {
      content: [{ type: "text", text: result.message }],
    };
  }
);

// ─── Tool: Export Design Tokens ──────────────────────────────────────────────
server.tool(
  "export_tokens",
  "Export design tokens from tokens.json to CSS custom properties, SCSS variables, or JS/TS constants",
  {
    format: z.enum(["css", "scss", "js", "ts", "json-flat"]).describe("Output format"),
    output_path: z.string().optional().describe("Output file path (default: output/tokens.<ext>)"),
    prefix: z.string().optional().default("ds").describe("Variable name prefix (default: ds)"),
  },
  async ({ format, output_path, prefix }) => {
    const result = await exportTokens({ format, output_path, prefix });
    return {
      content: [{ type: "text", text: result.message }, { type: "text", text: "```\n" + result.preview + "\n```" }],
    };
  }
);

// ─── Tool: Generate Social Copy ──────────────────────────────────────────────
server.tool(
  "generate_social_copy",
  "Generate platform-optimized social media copy for a visual designer post — hooks, captions, hashtags, CTAs",
  {
    platform: z.enum(["instagram", "tiktok", "youtube", "twitter", "linkedin", "pinterest"]).describe("Target platform"),
    pillar: z.enum(["process-reveal", "before-after", "design-tip", "portfolio-drop"]).describe("Content pillar"),
    topic: z.string().describe("Specific topic or skill to feature (e.g. '3D logo in Blender', 'brand color theory')"),
    tone: z.enum(["bold", "educational", "hype", "minimal"]).optional().default("bold").describe("Tone of copy"),
  },
  async ({ platform, pillar, topic, tone }) => {
    const result = await generateSocialCopy({ platform, pillar, topic, tone });
    return {
      content: [{ type: "text", text: result.copy }],
    };
  }
);

// ─── Tool: Generate Color Palette ────────────────────────────────────────────
server.tool(
  "generate_color_palette",
  "Generate a complete color palette from a base color — tints, shades, complementary, analogous, triadic, and contrast-safe pairs",
  {
    base_color: z.string().describe("Base hex color (e.g. #7B2FFF)"),
    palette_type: z.enum(["full", "tints-shades", "complementary", "analogous", "triadic", "split-complementary"]).optional().default("full"),
    steps: z.number().min(3).max(12).optional().default(9).describe("Number of tint/shade steps"),
    output_format: z.enum(["json", "css", "figma-tokens"]).optional().default("json"),
  },
  async ({ base_color, palette_type, steps, output_format }) => {
    const result = await generateColorPalette({ base_color, palette_type, steps, output_format });
    return {
      content: [{ type: "text", text: result.output }],
    };
  }
);

// ─── Tool: Create Design Variant ─────────────────────────────────────────────
server.tool(
  "create_design_variant",
  "Create a customized HTML design variant with your own handle, name, colors, and headline text",
  {
    template: z.enum(["instagram-post", "youtube-banner", "story", "poster"]).describe("Base template"),
    handle: z.string().optional().describe("Your social media handle (e.g. @designmaster)"),
    name: z.string().optional().describe("Your name or brand name"),
    headline: z.string().optional().describe("Custom headline text"),
    primary_color: z.string().optional().describe("Override primary brand color (hex)"),
    accent_color: z.string().optional().describe("Override accent color (hex)"),
    stats: z.object({
      projects: z.string().optional(),
      experience: z.string().optional(),
      label: z.string().optional(),
    }).optional().describe("Custom stats to display"),
    output_path: z.string().optional().describe("Output HTML file path"),
  },
  async ({ template, handle, name, headline, primary_color, accent_color, stats, output_path }) => {
    const result = await createDesignVariant({ template, handle, name, headline, primary_color, accent_color, stats, output_path });
    return {
      content: [{ type: "text", text: result.message }],
    };
  }
);

// ─── Tool: Get Design System ──────────────────────────────────────────────────
server.tool(
  "get_design_system",
  "Get the full design system spec — colors, typography, spacing, platform sizes, and brand guidelines",
  {
    section: z.enum(["all", "colors", "typography", "spacing", "shadows", "platforms", "brand", "strategy"]).optional().default("all"),
  },
  async ({ section }) => {
    const result = await getDesignSystem({ section });
    return {
      content: [{ type: "text", text: result.output }],
    };
  }
);

// ─── Start server ─────────────────────────────────────────────────────────────
const transport = new StdioServerTransport();
await server.connect(transport);
console.error("Visual Designer MCP server running on stdio");
