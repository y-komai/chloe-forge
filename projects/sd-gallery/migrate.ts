/**
 * Migrate existing scenes.json + image files into gallery.db
 * Run once: bun migrate.ts
 */
import { Database } from "bun:sqlite";
import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";

const DB_PATH    = "/home/komachi/sd-images/gallery.db";
const IMAGES_DIR = "/home/komachi/sd-images";

const db = new Database(DB_PATH, { create: true });
db.exec(`
  CREATE TABLE IF NOT EXISTS scenes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    prompt TEXT NOT NULL,
    neg_prompt TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    scene_id INTEGER REFERENCES scenes(id),
    filepath TEXT NOT NULL,
    seed INTEGER,
    steps INTEGER,
    width INTEGER,
    height INTEGER,
    cfg_scale REAL,
    sampler TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_images_scene ON images(scene_id);
`);

// Read scenes.json
const scenesJson = JSON.parse(
  await readFile(join(IMAGES_DIR, "scenes.json"), "utf-8")
) as { id: string; name: string; prompt: string }[];

const insertScene = db.prepare(
  "INSERT OR IGNORE INTO scenes (slug, name, prompt) VALUES (?, ?, ?)"
);
const insertImage = db.prepare(
  "INSERT OR IGNORE INTO images (scene_id, filepath, steps, width, height, cfg_scale, sampler) VALUES (?, ?, ?, ?, ?, ?, ?)"
);

let sceneCount = 0, imageCount = 0;

for (const scene of scenesJson) {
  insertScene.run(scene.id, scene.name, scene.prompt);
  const row = db.query("SELECT id FROM scenes WHERE slug = ?").get(scene.id) as { id: number };
  sceneCount++;

  const sceneDir = join(IMAGES_DIR, "scenes", scene.id);
  let files: string[] = [];
  try {
    files = (await readdir(sceneDir)).filter(f => /\.(png|jpg|jpeg|webp)$/i.test(f)).sort();
  } catch {
    console.warn(`  no dir: ${sceneDir}`);
    continue;
  }

  for (const file of files) {
    const filepath = resolve(join(sceneDir, file));
    insertImage.run(row.id, filepath, 20, 1024, 1536, 7, "DPM++ 2M Karras");
    imageCount++;
  }

  console.log(`  scene: ${scene.id} (${files.length} images)`);
}

console.log(`\nMigration done: ${sceneCount} scenes, ${imageCount} images`);
db.close();
