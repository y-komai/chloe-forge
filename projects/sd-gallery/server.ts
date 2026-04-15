import { serve } from "bun";
import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";
import { join } from "path";

const DB_PATH    = "/mnt/c/Users/ykoma/sd-images/gallery.db";
const IMAGES_DIR = "/mnt/c/Users/ykoma/sd-images";
const PORT       = 3210;

// Init DB
const db = new Database(DB_PATH, { create: true });
db.exec(`
  CREATE TABLE IF NOT EXISTS scenes (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT    UNIQUE NOT NULL,
    name       TEXT    NOT NULL,
    prompt     TEXT    NOT NULL,
    neg_prompt TEXT,
    created_at TEXT    DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS images (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    scene_id   INTEGER REFERENCES scenes(id),
    filepath   TEXT    NOT NULL,
    seed       INTEGER,
    steps      INTEGER,
    width      INTEGER,
    height     INTEGER,
    cfg_scale  REAL,
    sampler    TEXT,
    created_at TEXT    DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_images_scene ON images(scene_id);
`);

const cors = { "Access-Control-Allow-Origin": "*" };

const server = serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);

    // ── static ──────────────────────────────────────────────────
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await readFile(join(import.meta.dir, "index.html"), "utf-8");
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── GET /api/scenes ─────────────────────────────────────────
    if (url.pathname === "/api/scenes" && req.method === "GET") {
      const scenes = db.query(`
        SELECT s.*, COUNT(i.id) as image_count,
               (SELECT filepath FROM images WHERE scene_id = s.id ORDER BY id LIMIT 1) as thumb
        FROM scenes s
        LEFT JOIN images i ON i.scene_id = s.id
        GROUP BY s.id
        ORDER BY s.id
      `).all();
      return Response.json(scenes, { headers: cors });
    }

    // ── POST /api/scenes ─────────────────────────────────────────
    if (url.pathname === "/api/scenes" && req.method === "POST") {
      const body = await req.json() as { slug: string; name: string; prompt: string; neg_prompt?: string };
      const stmt = db.prepare("INSERT OR REPLACE INTO scenes (slug, name, prompt, neg_prompt) VALUES (?, ?, ?, ?)");
      const result = stmt.run(body.slug, body.name, body.prompt, body.neg_prompt ?? null);
      return Response.json({ id: result.lastInsertRowid }, { headers: cors });
    }

    // ── GET /api/scenes/:slug/images ────────────────────────────
    const imagesMatch = url.pathname.match(/^\/api\/scenes\/([^/]+)\/images$/);
    if (imagesMatch && req.method === "GET") {
      const slug = imagesMatch[1];
      const scene = db.query("SELECT id FROM scenes WHERE slug = ?").get(slug) as { id: number } | null;
      if (!scene) return Response.json([], { headers: cors });
      const images = db.query("SELECT * FROM images WHERE scene_id = ? ORDER BY id").all(scene.id);
      return Response.json(images, { headers: cors });
    }

    // ── POST /api/images ─────────────────────────────────────────
    if (url.pathname === "/api/images" && req.method === "POST") {
      const body = await req.json() as {
        scene_id: number; filepath: string;
        seed?: number; steps?: number; width?: number; height?: number;
        cfg_scale?: number; sampler?: string;
      };
      const stmt = db.prepare(
        "INSERT INTO images (scene_id, filepath, seed, steps, width, height, cfg_scale, sampler) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
      );
      const result = stmt.run(
        body.scene_id, body.filepath,
        body.seed ?? null, body.steps ?? null, body.width ?? null,
        body.height ?? null, body.cfg_scale ?? null, body.sampler ?? null
      );
      return Response.json({ id: result.lastInsertRowid }, { headers: cors });
    }

    // ── GET /serve/:id ───────────────────────────────────────────
    const serveMatch = url.pathname.match(/^\/serve\/(\d+)$/);
    if (serveMatch) {
      const img = db.query("SELECT filepath FROM images WHERE id = ?").get(Number(serveMatch[1])) as { filepath: string } | null;
      if (!img) return new Response("Not found", { status: 404 });
      try {
        const data = await readFile(img.filepath);
        const ext = img.filepath.split(".").pop()?.toLowerCase();
        const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
        return new Response(data, { headers: { "Content-Type": mime, ...cors } });
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    // ── GET /thumb/:slug ─────────────────────────────────────────
    const thumbMatch = url.pathname.match(/^\/thumb\/([^/]+)$/);
    if (thumbMatch) {
      const slug = thumbMatch[1];
      const row = db.query(
        "SELECT i.filepath FROM images i JOIN scenes s ON s.id = i.scene_id WHERE s.slug = ? ORDER BY i.id LIMIT 1"
      ).get(slug) as { filepath: string } | null;
      if (!row) return new Response("Not found", { status: 404 });
      try {
        const data = await readFile(row.filepath);
        return new Response(data, { headers: { "Content-Type": "image/png", ...cors } });
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`SD Gallery (DB): http://0.0.0.0:${server.port}`);
