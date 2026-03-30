import puppeteer from "puppeteer-core";
import { fileURLToPath } from "url";
import { dirname, resolve, join } from "path";
import { mkdirSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(__dirname, "../../../visual-designer-system/templates");
const OUTPUT_DIR = resolve(__dirname, "../../output");

const TEMPLATE_SIZES = {
  "instagram-post": { width: 1080, height: 1080 },
  "youtube-banner": { width: 2560, height: 1440 },
  "story":          { width: 1080, height: 1920 },
  "poster":         { width: 1240, height: 1754 }, // A4 at 150dpi
};

export async function renderTemplate({ template, output_path, width, height }) {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });

  const size = TEMPLATE_SIZES[template];
  const w = width  ?? size.width;
  const h = height ?? size.height;

  const templateFile = join(TEMPLATES_DIR, `${template}.html`);
  if (!existsSync(templateFile)) {
    return { message: `Template not found: ${templateFile}` };
  }

  const out = output_path ?? join(OUTPUT_DIR, `${template}.png`);

  // Resolve Chromium path: env override → common locations
  const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ??
    process.env.CHROME_PATH ??
    [
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/usr/bin/google-chrome",
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    ].find(p => existsSync(p));

  if (!executablePath) {
    return { message: "Chromium not found. Set PUPPETEER_EXECUTABLE_PATH or install chromium." };
  }

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--font-render-hinting=none",
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
    await page.goto(`file://${templateFile}`, { waitUntil: "networkidle0", timeout: 30000 });

    // Wait for Google Fonts to load
    await page.waitForTimeout(2000);

    // Grab the canvas element specifically
    const canvasEl = await page.$(".canvas");
    if (canvasEl) {
      await canvasEl.screenshot({ path: out, type: "png" });
    } else {
      await page.screenshot({ path: out, type: "png", fullPage: false });
    }

    return {
      message: `Rendered ${template} → ${out}\nSize: ${w}×${h}px`,
    };
  } finally {
    await browser.close();
  }
}
