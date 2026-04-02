#!/usr/bin/env node
/**
 * yt-pipeline — Full YouTube → Clip → Upload pipeline
 *
 * Step 1: Download any YouTube video (yt-dlp)
 * Step 2: Auto-clip into 20 × 30s TikTok clips (clip-swarm)
 * Step 3: Upload each clip as a YouTube Short
 *
 * Setup:
 *   1. Go to console.developers.google.com → APIs → YouTube Data API v3
 *   2. Create OAuth2 credentials → Desktop App
 *   3. Download JSON → save as credentials.json in this folder
 *   4. npm install && node yt-pipeline.js <youtube-url>
 */

import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import { readFileSync, writeFileSync, existsSync, createReadStream } from "fs";
import { resolve, basename } from "path";
import { execSync, exec } from "child_process";
import { promisify } from "util";
import { createServer } from "http";
import { URL } from "url";
import open from "open";

const execAsync = promisify(exec);

const SCOPES        = ["https://www.googleapis.com/auth/youtube.upload"];
const TOKEN_PATH    = resolve("token.json");
const CREDS_PATH    = resolve("credentials.json");
const REDIRECT_PORT = 3000;

// ─── Auth ─────────────────────────────────────────────────────────────────────
async function getAuth() {
  if (!existsSync(CREDS_PATH)) {
    console.error(`
❌ credentials.json not found.

  1. Go to: https://console.developers.google.com/apis/credentials?project=353817098591
  2. Click "Create Credentials" → "OAuth 2.0 Client IDs" → "Desktop App"
  3. Download JSON → save as: ${CREDS_PATH}
  4. Run this script again.
`);
    process.exit(1);
  }

  const { installed } = JSON.parse(readFileSync(CREDS_PATH, "utf8"));
  const oauth2 = new OAuth2Client(
    installed.client_id,
    installed.client_secret,
    `http://localhost:${REDIRECT_PORT}`
  );

  // Use cached token if available
  if (existsSync(TOKEN_PATH)) {
    oauth2.setCredentials(JSON.parse(readFileSync(TOKEN_PATH, "utf8")));
    return oauth2;
  }

  // First-time OAuth flow
  const authUrl = oauth2.generateAuthUrl({ access_type: "offline", scope: SCOPES });
  console.log("\n🔐 Opening browser for YouTube authorization...");
  await open(authUrl);

  const code = await waitForCode();
  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);
  writeFileSync(TOKEN_PATH, JSON.stringify(tokens));
  console.log("✅ Authorized. Token saved.\n");
  return oauth2;
}

function waitForCode() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const code = new URL(req.url, "http://localhost").searchParams.get("code");
      if (code) {
        res.end("<h2>✅ Authorized! You can close this tab.</h2>");
        server.close();
        resolve(code);
      }
    }).listen(REDIRECT_PORT);
    console.log(`Waiting for auth on http://localhost:${REDIRECT_PORT} ...`);
  });
}

// ─── Download ─────────────────────────────────────────────────────────────────
async function downloadVideo(url, outDir = ".") {
  console.log(`\n📥 Downloading: ${url}`);

  // Check yt-dlp
  let ytdlp = "yt-dlp";
  try { execSync("yt-dlp --version", { stdio: "ignore" }); }
  catch {
    console.log("Installing yt-dlp...");
    execSync("pip3 install yt-dlp", { stdio: "inherit" });
  }

  const outFile = resolve(outDir, "downloaded.mp4");
  execSync(
    `${ytdlp} -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]" -o "${outFile}" "${url}"`,
    { stdio: "inherit" }
  );
  console.log(`✅ Downloaded → ${outFile}`);
  return outFile;
}

// ─── Upload ───────────────────────────────────────────────────────────────────
const CATEGORIES = {
  "Entertainment": "24",
  "HowTo": "26",
  "People": "22",
};

async function uploadShort(auth, filePath, title, description, tags = []) {
  const yt = google.youtube({ version: "v3", auth });

  const res = await yt.videos.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title        : title.slice(0, 100),
        description,
        tags,
        categoryId   : CATEGORIES.Entertainment,
        defaultLanguage: "en",
      },
      status: {
        privacyStatus    : "public",
        selfDeclaredMadeForKids: false,
      },
    },
    media: {
      body: createReadStream(filePath),
    },
  });

  return res.data;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────
async function main() {
  const args     = process.argv.slice(2);
  const mode     = args[0];

  if (!mode || mode === "--help") {
    console.log(`
🎬 yt-pipeline — YouTube → Clips → Shorts

Commands:
  node yt-pipeline.js download <youtube-url>     Download video
  node yt-pipeline.js upload   <clips-folder>    Upload all clips as Shorts
  node yt-pipeline.js run      <youtube-url>     Full pipeline (download→clip→upload)
  node yt-pipeline.js auth                       Authorize YouTube account
`);
    process.exit(0);
  }

  if (mode === "auth") {
    await getAuth();
    console.log("✅ YouTube account authorized.");
    return;
  }

  if (mode === "download") {
    const url = args[1];
    if (!url) { console.error("Usage: node yt-pipeline.js download <url>"); process.exit(1); }
    await downloadVideo(url);
    return;
  }

  if (mode === "upload") {
    const folder = resolve(args[1] || ".");
    const auth   = await getAuth();
    await uploadFolder(auth, folder);
    return;
  }

  if (mode === "run") {
    const url = args[1];
    if (!url) { console.error("Usage: node yt-pipeline.js run <youtube-url>"); process.exit(1); }

    // 1. Auth
    const auth = await getAuth();

    // 2. Download
    const videoFile = await downloadVideo(url);

    // 3. Clip
    console.log("\n✂️  Clipping into 20 × 30s TikTok clips...");
    const { default: clip } = await import("./clip.js");
    // clip.js runs itself — invoke via exec
    const clipsDir = videoFile.replace(".mp4", "");
    execSync(`node clip.js "${videoFile}" --clips 20`, { stdio: "inherit" });

    // 4. Upload
    await uploadFolder(auth, clipsDir + "-" + basename(videoFile, ".mp4"));
    return;
  }

  console.error(`Unknown command: ${mode}`);
  process.exit(1);
}

async function uploadFolder(auth, folder) {
  const { readdirSync } = await import("fs");
  const clips = readdirSync(folder)
    .filter(f => f.endsWith(".mp4"))
    .sort()
    .map(f => resolve(folder, f));

  if (!clips.length) {
    console.error(`No .mp4 files found in: ${folder}`);
    process.exit(1);
  }

  console.log(`\n🚀 Uploading ${clips.length} clips as YouTube Shorts...\n`);

  const HOOKS = [
    "Wait for it 👀", "Nobody talks about this", "This changed everything",
    "You need to see this", "Watch till the end 🔥", "This is insane 😳",
    "POV: You just leveled up", "Game changer right here", "Stop scrolling",
    "The secret nobody shares", "Do this every day", "Real results",
    "I tested this for you", "Results in 30 seconds", "Going viral for a reason",
    "The truth about this", "Share before it's gone", "This works every time",
    "Nobody does this", "Drop everything and watch",
  ];

  const TAGS = ["shorts", "viral", "fyp", "foryou", "trending", "tiktok", "reels"];

  for (let i = 0; i < clips.length; i++) {
    const hook  = HOOKS[i % HOOKS.length];
    const title = `${hook} #Shorts`;
    const desc  = `${hook}\n\n#Shorts #Viral #FYP #Trending`;

    try {
      const result = await uploadShort(auth, clips[i], title, desc, TAGS);
      console.log(`  ✅ [${i+1}/${clips.length}] https://youtube.com/shorts/${result.id}`);
    } catch (e) {
      console.error(`  ❌ [${i+1}/${clips.length}] Failed: ${e.message}`);
    }

    // Avoid quota hammering — 2s between uploads
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("\n🎉 Done! All clips uploaded to YouTube Shorts.\n");
}

main().catch(console.error);
