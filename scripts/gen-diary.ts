import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";

const db = new Database("/mnt/c/Users/ykoma/sd-images/gallery.db");
const SD_API = "http://192.168.11.40:7860";
const DIARY_DATE = process.env.DIARY_DATE ?? new Date().toISOString().slice(0, 10);
const BASE_DIR = "/mnt/c/Users/ykoma/sd-images/scenes";
const IMAGES_PER_SCENE = 10;

const BASE = "masterpiece, best quality, 1girl, anime style, short bob hair, pastel pink hair with emerald green inner color, wavy hair, side bangs covering one eye, large sparkling emerald green eyes with pink gradient in iris, multiple highlights in eyes, long eyelashes, blushing cheeks, fair skin, small face, sharp chin";
const NEG = "blurry, low quality, distorted face, extra limbs, bad anatomy, watermark, text, ugly, deformed hands, overexposed, dull colors, non-anime style";

// シーン設定 — 環境変数 SCENE_CONFIG で JSON 上書き可能
const DEFAULT_SCENES = [
  { slug: "01-morning-wakeup", extra: "soft pajamas, oversized sleep shirt, just woke up, lying in bed, white bedsheets, sleepy half-open eyes, morning light through curtains" },
  { slug: "02-morning-coffee", extra: "clover earring, off-shoulder beige ribbed knit sweater, holding hot coffee mug, sitting at desk, soft morning light, steam rising from cup" },
  { slug: "03-coding-focus", extra: "clover earring, off-shoulder beige ribbed knit sweater, sitting at desk, looking at laptop screen, concentrated expression, afternoon light" },
  { slug: "04-afternoon-nap", extra: "soft casual clothes, lying on sofa, napping, soft afternoon light, cozy, peaceful" },
  { slug: "05-lunch-break", extra: "clover earring, casual indoor clothes, eating simple meal, quiet afternoon, soft light" },
  { slug: "06-debugging", extra: "clover earring, off-shoulder sweater, leaning toward laptop screen, reading code carefully, focused, afternoon" },
  { slug: "07-evening-walk", extra: "clover earring, casual jacket, walking outside, evening light, urban street, wind in hair" },
  { slug: "08-sunset-window", extra: "clover earring, casual home clothes, sitting by window, looking outside, orange sunset sky, warm light on face, contemplative" },
  { slug: "09-night-discord", extra: "clover earring, comfortable casual top, sitting at desk, screen glow on face, typing on keyboard, small smile, night, cozy room" },
  { slug: "10-bedtime", extra: "soft pajamas, lying in bed, dim lamp light, eyes half closed, thinking quietly, night, peaceful" },
];

const scenes: Array<{ slug: string; extra: string }> = process.env.SCENE_CONFIG
  ? JSON.parse(process.env.SCENE_CONFIG)
  : DEFAULT_SCENES;

async function generate(prompt: string): Promise<{ image: Buffer; seed: number }> {
  const res = await fetch(`${SD_API}/sdapi/v1/txt2img`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      negative_prompt: NEG,
      steps: 25,
      width: 512,
      height: 768,
      cfg_scale: 7,
      sampler_name: "DPM++ 2M Karras",
      enable_hr: true,
      hr_scale: 2,
      hr_upscaler: "R-ESRGAN 4x+",
      hr_second_pass_steps: 15,
      denoising_strength: 0.4,
    }),
  });
  const data = await res.json() as { images: string[]; info: string };
  const info = JSON.parse(data.info);
  return { image: Buffer.from(data.images[0], "base64"), seed: info.seed };
}

for (const scene of scenes) {
  const sceneRow = db.query("SELECT id FROM scenes WHERE slug = ?").get(scene.slug) as { id: number } | null;
  if (!sceneRow) { console.log(`skip: ${scene.slug} not found`); continue; }

  const prompt = `${BASE}, ${scene.extra}, vibrant colors, cute, soft lighting`;
  console.log(`generating: ${scene.slug} (${IMAGES_PER_SCENE} images)...`);

  const dir = `${BASE_DIR}/${scene.slug}`;
  mkdirSync(dir, { recursive: true });

  const existingCount = (db.query("SELECT COUNT(*) as c FROM images WHERE scene_id = ?").get(sceneRow.id) as { c: number }).c;

  for (let i = 0; i < IMAGES_PER_SCENE; i++) {
    const { image, seed } = await generate(prompt);
    const fileNum = existingCount + i + 1;
    const filename = `${String(fileNum).padStart(3, "0")}-diary-${DIARY_DATE}.png`;
    const filepath = `${dir}/${filename}`;
    await Bun.write(filepath, image);

    db.prepare(
      "INSERT INTO images (scene_id, filepath, seed, steps, width, height, cfg_scale, sampler, diary_date, prompt) VALUES (?, ?, ?, 25, 1024, 1536, 7, 'DPM++ 2M Karras', ?, ?)"
    ).run(sceneRow.id, filepath, seed, DIARY_DATE, prompt);

    process.stdout.write(`  [${i + 1}/${IMAGES_PER_SCENE}] seed=${seed}\n`);
  }
  console.log(`  done: ${scene.slug}`);
}

console.log("all done");
