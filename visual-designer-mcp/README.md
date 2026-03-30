# Visual Designer MCP

A Model Context Protocol server for visual designers — render templates to PNG, export design tokens, generate social media copy, and build color palettes. Runs inside Docker, works with Claude Desktop.

## Tools

| Tool | Description |
|------|-------------|
| `render_template` | Render any design template to PNG using headless Chrome |
| `export_tokens` | Export design tokens to CSS, SCSS, JS, TS, or flat JSON |
| `generate_social_copy` | Generate hooks, captions, and hashtags per platform |
| `generate_color_palette` | Full palette from any base hex — tints, shades, harmonies |
| `create_design_variant` | Customize templates with your handle, colors, and text |
| `get_design_system` | Get the full design system spec |

## Setup

### 1. Build the Docker image

```bash
cd visual-designer-mcp
docker compose build
```

### 2. Add to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "visual-designer": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "/ABSOLUTE/PATH/TO/awesome-claude-skills/visual-designer-mcp/output:/app/output",
        "-v", "/ABSOLUTE/PATH/TO/awesome-claude-skills/visual-designer-system:/app/visual-designer-system:ro",
        "visual-designer-mcp:latest"
      ]
    }
  }
}
```

Replace `/ABSOLUTE/PATH/TO/awesome-claude-skills` with your actual path.

### 3. Restart Claude Desktop

The MCP tools will appear in Claude's tool palette.

## Usage Examples

Once connected to Claude Desktop, just ask:

- *"Render my Instagram post template to PNG"*
- *"Export design tokens as CSS variables"*
- *"Generate Instagram copy for a 3D logo process reveal"*
- *"Create a color palette from #FF5733"*
- *"Customize the poster template with my handle @designmaster and red as primary color"*
- *"Show me the full design system"*

## Output

All generated files land in `visual-designer-mcp/output/` which is volume-mounted to your Mac.

## Development

```bash
# Install deps locally
npm install

# Run without Docker (requires Chromium installed)
npm start

# Run with Docker
docker compose up
```

## Architecture

```
visual-designer-mcp/
├── src/
│   ├── index.js              ← MCP server entry point
│   └── tools/
│       ├── render-template.js   ← Puppeteer PNG renderer
│       ├── export-tokens.js     ← Token format converter
│       ├── generate-copy.js     ← Social media copy engine
│       ├── color-palette.js     ← chroma-js palette generator
│       ├── design-variant.js    ← HTML template customizer
│       └── design-system.js     ← Design system reader
├── Dockerfile
├── docker-compose.yml
├── claude.json               ← MCP config reference
└── output/                   ← Generated files land here
```
