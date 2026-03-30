const HOOKS = {
  "process-reveal": {
    bold: [
      "Nobody shows this part. I will.",
      "This is what {topic} actually looks like behind the scenes.",
      "Watch me build {topic} from absolute zero.",
      "The process they never teach you in design school.",
    ],
    educational: [
      "Here's my exact workflow for {topic} — step by step.",
      "Breaking down how I approach {topic} from start to finish.",
      "5-step process I use every time for {topic}.",
    ],
    hype: [
      "POV: You just hired the best designer for {topic} 🔥",
      "This {topic} build goes CRAZY. Watch till the end.",
      "I spent 40 hours on {topic}. Here's every second.",
    ],
    minimal: [
      "{topic}. Process.",
      "How it's made: {topic}.",
      "From idea to final: {topic}.",
    ],
  },
  "before-after": {
    bold: [
      "I redesigned this {topic} in 2 hours. [Before → After]",
      "What $5 vs $500 {topic} design actually looks like.",
      "Amateur vs Pro: the {topic} details that matter.",
    ],
    educational: [
      "Why the original {topic} wasn't working — and how I fixed it.",
      "The 3 changes that transformed this {topic} design.",
      "Design breakdown: what changed and why it works better.",
    ],
    hype: [
      "This {topic} glow-up is INSANE 😭🔥 [Before/After]",
      "They almost went with the first version... thank god they didn't.",
      "Client said 'make it pop.' I said 'say less.' [Swipe]",
    ],
    minimal: [
      "Before. After. {topic}.",
      "{topic}: version 1 vs version 4.",
      "The difference detail makes.",
    ],
  },
  "design-tip": {
    bold: [
      "3 {topic} rules every designer ignores (and why they matter).",
      "Stop doing this with {topic}. Do this instead.",
      "The {topic} mistake that's making your work look amateur.",
    ],
    educational: [
      "How to use {topic} effectively — a practical guide.",
      "Everything I know about {topic} in one post.",
      "The {topic} principle that changed how I design.",
    ],
    hype: [
      "This {topic} trick made my designs 10x better overnight 🤯",
      "I can't believe I didn't know this {topic} hack sooner.",
      "Designers who know {topic}: thriving. Everyone else: suffering.",
    ],
    minimal: [
      "{topic}. One rule.",
      "The simplest {topic} advice: [tip]",
      "Good design: {topic}.",
    ],
  },
  "portfolio-drop": {
    bold: [
      "New work just dropped. {topic}.",
      "Spent 40 hours on this {topic}. Worth every minute.",
      "This {topic} took 3 iterations to get right. Here's version 4.",
    ],
    educational: [
      "New project: {topic}. Here's the brief and how I approached it.",
      "Behind the {topic}: goals, constraints, and final result.",
      "The thinking behind this {topic} design.",
    ],
    hype: [
      "Just dropped the hardest {topic} of my career 🔥",
      "New {topic} who dis 😤",
      "This {topic} is giving everything it needs to give.",
    ],
    minimal: [
      "{topic}.",
      "New work: {topic}.",
      "{topic} — done.",
    ],
  },
};

const HASHTAGS = {
  instagram: {
    core: ["#graphicdesign", "#visualdesign", "#designinspo", "#designcommunity"],
    skill: ["#3dart", "#3ddesign", "#2ddesign", "#printdesign", "#branddesign"],
    growth: ["#designtips", "#designprocess", "#learndesign"],
    niche: ["#motiondesign", "#typographydesign", "#posterdesign", "#logodesign"],
  },
  tiktok: {
    core: ["#graphicdesign", "#designtok", "#creativetok", "#designtips"],
    skill: ["#3ddesign", "#2ddesign", "#logodesign", "#branddesign"],
    growth: ["#learnontiktok", "#designprocess", "#designschool"],
    niche: ["#blender3d", "#illustrator", "#figmadesign", "#adobeillustrator"],
  },
  youtube: { core: [], skill: [], growth: [], niche: [] },
  twitter: {
    core: ["#GraphicDesign", "#Design", "#CreativeWork"],
    skill: ["#3DArt", "#Branding", "#VisualDesign"],
    growth: ["#DesignTips", "#DesignCommunity"],
    niche: ["#Blender", "#Figma", "#AdobeCC"],
  },
  linkedin: {
    core: ["#GraphicDesign", "#VisualDesign", "#CreativeDirection"],
    skill: ["#3DDesign", "#BrandIdentity", "#PrintDesign"],
    growth: ["#DesignThinking", "#CreativeProcess", "#Portfolio"],
    niche: ["#Branding", "#DesignStrategy", "#CreativeAgency"],
  },
  pinterest: {
    core: ["graphic design", "visual design", "design inspiration"],
    skill: ["3d design", "2d illustration", "print design", "brand identity"],
    growth: ["design tips", "design process", "learn design"],
    niche: ["poster design", "logo design", "typography design"],
  },
};

const CTAS = {
  instagram: ["Follow for daily design drops 👇", "Save this for your next project", "Drop a 🔥 if this helped", "Share with a designer friend"],
  tiktok:    ["Follow for more design content", "Like if you learned something", "Share this with a designer 🙏", "Comment your biggest design struggle"],
  youtube:   ["Subscribe for weekly tutorials", "Like if this helped you", "Comment your questions below", "Check the description for resources"],
  twitter:   ["RT if this was useful", "Follow for daily design content", "Reply with your take"],
  linkedin:  ["Follow for weekly design insights", "Share if this resonates", "Connect with me for collaborations"],
  pinterest: ["Follow for more design inspiration", "Save to your design board", "Pin for your next project"],
};

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function generateSocialCopy({ platform, pillar, topic, tone }) {
  const hookTemplates = HOOKS[pillar][tone] ?? HOOKS[pillar]["bold"];
  const hook = pick(hookTemplates).replace(/\{topic\}/g, topic);

  const tags = HASHTAGS[platform] ?? HASHTAGS.instagram;
  const allTags = [...tags.core, ...tags.skill, ...tags.growth, ...tags.niche];
  const selectedTags = allTags.slice(0, platform === "instagram" ? 28 : 10);

  const cta = pick(CTAS[platform] ?? CTAS.instagram);

  let copy = "";

  if (platform === "instagram" || platform === "tiktok") {
    copy = `HOOK:\n${hook}\n\nCAPTION:\n${hook}\n\n${pillar === "design-tip" ? `Here's what you need to know about ${topic}:\n\n→ [Point 1]\n→ [Point 2]\n→ [Point 3]\n\n` : ""}${cta}\n\nHASHTAGS:\n${selectedTags.join(" ")}`;
  } else if (platform === "youtube") {
    copy = `TITLE:\n${hook}\n\nDESCRIPTION:\nIn this video: ${topic}\n\nTimestamps:\n0:00 Intro\n0:30 [Step 1]\n2:00 [Step 2]\n5:00 [Step 3]\n8:00 Final result\n\n${cta}\n\nLinks:\n↳ Portfolio: [yoursite.com]\n↳ Design System: [link]\n↳ Tools used: [list]`;
  } else if (platform === "twitter") {
    copy = `TWEET:\n${hook}\n\n[Thread 1/5] ${topic}:\n\n→ [Point 1]\n→ [Point 2]\n→ [Point 3]\n\n${cta}\n\n${selectedTags.join(" ")}`;
  } else if (platform === "linkedin") {
    copy = `POST:\n${hook}\n\nHere's what I've learned about ${topic}:\n\n1. [Insight 1]\n2. [Insight 2]\n3. [Insight 3]\n\n[Closing thought]\n\n${cta}\n\n${selectedTags.join(" ")}`;
  } else if (platform === "pinterest") {
    copy = `PIN TITLE:\n${hook}\n\nDESCRIPTION:\n${hook} — ${topic}. ${cta}\n\nKEYWORDS: ${selectedTags.join(", ")}`;
  }

  return { copy };
}
