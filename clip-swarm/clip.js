#!/usr/bin/env node
/**
 * clip-swarm — 1 video → 20 TikTok-ready clips
 * Usage: node clip.js <video.mp4> [--clips 20] [--duration 30]
 */

import ffmpeg from "fluent-ffmpeg";
import { createRequire } from "module";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import { existsSync, mkdirSync } from "fs";
import { resolve, basename, extname } from "path";
import { fileURLToPath } from "url";

const require = createRequire(import.meta.url);
const ffmpegPath  = require("@ffmpeg-installer/ffmpeg").path;
const ffprobePath = require("@ffprobe-installer/ffprobe").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const HOOKS = [
  "Wait for it… 👀",
  "Nobody talks about this",
  "This changed everything",
  "You need to see this",
  "Watch till the end 🔥",
  "They don't want you to know",
  "POV: You just leveled up",
  "This is insane 😳",
  "I can't believe this works",
  "The secret nobody shares",
  "Do this every day",
  "Game changer right here",
  "Stop scrolling — watch this",
  "This went viral for a reason",
  "3 seconds that change your life",
  "Real or fake? You decide",
  "The truth about this",
  "I tested this so you don't have to",
  "Results in 30 seconds",
  "Share before they take it down",
];

// ─── Worker: render one clip ──────────────────────────────────────────────────
if (!isMainThread) {
  const { input, output, start, duration, hook, index, total } = workerData;

  const drawtext = [
    `fontsize=52`,
    `fontcolor=white`,
    `bordercolor=black`,
    `borderw=3`,
    `fontfile=/System/Library/Fonts/Helvetica.ttc`,
    `text='${hook.replace(/'/g, "\\'")}'`,
    `x=(w-text_w)/2`,
    `y=80`,
    `enable='between(t,0,${duration})'`,
  ].join(":");

  ffmpeg(input)
    .seekInput(start)
    .duration(duration)
    .videoFilters([
      // Crop to 9:16 (TikTok)
      "crop=ih*9/16:ih",
      // Scale to 1080x1920
      "scale=1080:1920:force_original_aspect_ratio=decrease",
      "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black",
      // Hook text overlay
      `drawtext=${drawtext}`,
      // Clip number watermark (bottom right)
      [
        `drawtext=fontsize=28`,
        `fontcolor=white@0.5`,
        `text='${index}/${total}'`,
        `x=w-80`,
        `y=h-60`,
        `fontfile=/System/Library/Fonts/Helvetica.ttc`,
      ].join(":"),
    ])
    .audioCodec("aac")
    .videoCodec("libx264")
    .outputOptions(["-preset fast", "-crf 23", "-movflags +faststart"])
    .on("end", () => parentPort.postMessage({ status: "done", index, output }))
    .on("error", (err) => parentPort.postMessage({ status: "error", index, error: err.message }))
    .save(output);

  // bail out of main thread logic
  process.exit = () => {};
}

// ─── Main thread ─────────────────────────────────────────────────────────────
async function getVideoDuration(input) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(input, (err, meta) => {
      if (err) reject(err);
      else resolve(meta.format.duration);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (!args.length) {
    console.error("Usage: node clip.js <video.mp4> [--clips 20] [--duration 30]");
    process.exit(1);
  }

  const input = resolve(args[0]);
  if (!existsSync(input)) {
    console.error(`File not found: ${input}`);
    process.exit(1);
  }

  const clipsIdx   = args.indexOf("--clips");
  const durIdx     = args.indexOf("--duration");
  const numClips   = clipsIdx   !== -1 ? parseInt(args[clipsIdx   + 1]) : 20;
  const clipLen    = durIdx     !== -1 ? parseInt(args[durIdx     + 1]) : 30;
  const outDir     = resolve(`clips-${basename(input, extname(input))}`);

  mkdirSync(outDir, { recursive: true });

  console.log(`\n🎬 clip-swarm`);
  console.log(`   Input   : ${basename(input)}`);
  console.log(`   Clips   : ${numClips} × ${clipLen}s → TikTok 9:16`);
  console.log(`   Output  : ${outDir}\n`);

  const totalDur = await getVideoDuration(input);
  console.log(`   Duration: ${Math.round(totalDur)}s`);

  // Spread clips evenly across the video
  const maxStart  = Math.max(0, totalDur - clipLen);
  const step      = maxStart / Math.max(numClips - 1, 1);

  const jobs = Array.from({ length: numClips }, (_, i) => ({
    input,
    output : `${outDir}/clip-${String(i + 1).padStart(2, "0")}.mp4`,
    start  : Math.round(i * step),
    duration: clipLen,
    hook   : HOOKS[i % HOOKS.length],
    index  : i + 1,
    total  : numClips,
  }));

  // Run up to 4 workers in parallel
  const CONCURRENCY = 4;
  let completed = 0;
  let cursor    = 0;

  function runNext() {
    if (cursor >= jobs.length) return;
    const job = jobs[cursor++];

    console.log(`  [${job.index}/${numClips}] Starting → "${job.hook}"`);

    const w = new Worker(fileURLToPath(import.meta.url), { workerData: job });
    w.on("message", (msg) => {
      if (msg.status === "done") {
        completed++;
        console.log(`  ✅ [${msg.index}/${numClips}] Done → ${msg.output}`);
      } else {
        console.error(`  ❌ [${msg.index}/${numClips}] Error: ${msg.error}`);
        completed++;
      }
      if (completed === numClips) {
        console.log(`\n🎉 All ${numClips} clips ready in: ${outDir}\n`);
      } else {
        runNext();
      }
    });
  }

  // Launch initial batch
  for (let i = 0; i < Math.min(CONCURRENCY, numClips); i++) runNext();
}

if (isMainThread) main().catch(console.error);
