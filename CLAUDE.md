# CLAUDE.md — awesome-claude-skills

This file provides AI assistants with context about the repository structure, conventions, and workflows.

---

## What This Repository Is

A curated collection of **Claude Skills** — reusable instruction sets that extend Claude's capabilities across Claude.ai, Claude Code, and the Claude API. The repository contains:

- **32+ individual skills** covering productivity, development, design, and analysis
- **832 pre-generated composio automation skills** for SaaS app integration
- **Document processing skills** (PDF, DOCX, XLSX, PPTX)
- **Templates and contribution guides** for creating new skills

---

## Repository Structure

```
awesome-claude-skills/
├── README.md                   # Main documentation and skill catalog
├── CONTRIBUTING.md             # Contribution guidelines and skill standards
├── CLAUDE.md                   # This file
│
├── template-skill/             # Reference template for new skills
│   └── SKILL.md
│
├── <skill-name>/               # Individual skill directories
│   ├── SKILL.md                # Required: skill definition (always present)
│   ├── scripts/                # Optional: executable Python/shell scripts
│   ├── reference/              # Optional: reference docs loaded on-demand
│   ├── assets/                 # Optional: fonts, templates, static files
│   └── LICENSE.txt             # Optional: license terms
│
├── document-skills/            # Grouped: document processing skills
│   ├── pdf/SKILL.md
│   ├── docx/SKILL.md
│   ├── xlsx/SKILL.md
│   └── pptx/SKILL.md
│
├── composio-skills/            # Grouped: 832 pre-built SaaS automation skills
│   └── <service>-automation/SKILL.md
│
├── mcp-builder/                # MCP server creation guide
│   ├── SKILL.md
│   └── reference/              # python_mcp_server.md, node_mcp_server.md, best practices
│
└── connect-apps-plugin/        # Claude plugin (not a skill)
    ├── .claude-plugin/plugin.json
    ├── commands/setup.md
    └── README.md
```

---

## SKILL.md File Format

Every skill is defined by a `SKILL.md` file with this structure:

```markdown
---
name: skill-name
description: One-line description of what the skill does and when to use it
[optional]
license: Complete terms in LICENSE.txt
requires:
  mcp: [mcp-server-name]
---

# Skill Name

Brief overview of purpose and capabilities.

## When to Use

- Trigger condition 1
- Trigger condition 2

## What This Skill Does

1. Capability one
2. Capability two

## How to Use

### Basic Usage
Simple invocation example.

### Advanced Usage
Complex options and workflows.

## Examples

**User:** "example prompt"
**Output:** what Claude produces

## Tips

- Best practice 1
- Best practice 2
```

**Key conventions:**
- `name`: lowercase, hyphen-separated
- `description`: imperative voice, single line, covers the "what" and "when"
- Body written for Claude to follow, not for end-users to read
- Imperative/infinitive language ("Do X", not "You should do X")

---

## Skill Resource Levels

Skills use a tiered resource model. Only add what's needed:

| Level | What's Included | When to Use |
|-------|----------------|-------------|
| 1 — Minimal | `SKILL.md` only | Simple instruction-based skills |
| 2 — Scripts | + `scripts/` directory | Skills requiring executable code (Python, shell) |
| 3 — Reference | + `reference/` directory | Skills needing large docs loaded on-demand |
| 4 — Assets | + `assets/` directory | Skills using fonts, templates, static files |
| 5 — Complex | Multiple subdirectories | Multi-component skills like document processing |

---

## Composio Skills Pattern

The 832 skills in `composio-skills/` follow a standardized pattern:

```yaml
---
name: <service>-automation
description: "Automate <Service> tasks via Rube MCP (Composio)"
requires:
  mcp: [rube]
---
```

They use three Composio/Rube MCP tools:
1. `RUBE_SEARCH_TOOLS` — discover available tools for a service
2. `RUBE_MANAGE_CONNECTIONS` — check/establish service connections
3. `RUBE_MULTI_EXECUTE_TOOL` — execute one or more tools

---

## Development Conventions

### Adding a New Skill

1. Create a new directory: `<skill-name>/` (lowercase, hyphen-separated)
2. Add `SKILL.md` following the template in `template-skill/SKILL.md`
3. Add supporting files only if needed (`scripts/`, `reference/`, `assets/`)
4. Update `README.md` to list the skill in the appropriate category
5. Optionally include `LICENSE.txt` for complex or third-party skills

### Skill Quality Standards (from CONTRIBUTING.md)

- Solves a **real problem**, not a hypothetical one
- Well-documented with **working examples**
- **Accessible** to non-technical users
- **Tested** across Claude.ai, Claude Code, and the API
- **Safe**: confirms before destructive operations
- **Portable**: no environment-specific assumptions

### Naming Conventions

- Skill directories: `lowercase-hyphen-separated`
- YAML `name` field: matches directory name exactly
- Scripts: `snake_case.py` or `kebab-case.sh`
- Reference files: `descriptive-name.md`

---

## No Build System

This repository has **no build process, CI/CD, or package manager** at the root level:
- No `package.json`, `pyproject.toml`, or `requirements.txt` at root
- No `.github/workflows/` CI configuration
- Each skill is self-contained; external dependencies (if any) are noted in `SKILL.md`

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `README.md` | Skill catalog with categories and quick-start guide |
| `CONTRIBUTING.md` | Full contribution guidelines and quality standards |
| `template-skill/SKILL.md` | Canonical template for new skills |
| `skill-creator/SKILL.md` | Skill that helps users create new skills interactively |
| `mcp-builder/reference/` | Reference docs for building MCP servers |

---

## When Working in This Repository

- **Adding a skill**: Follow the template, update README, match existing formatting
- **Updating a skill**: Preserve YAML frontmatter structure; update examples if behavior changes
- **Reviewing a skill**: Check that `name` matches directory, description is concise, examples are realistic
- **Bulk composio skills**: These are auto-generated — don't manually edit individual files; modify the generation pattern instead
- **Plugin files** (`connect-apps-plugin/`): These follow plugin manifest conventions, not skill conventions
