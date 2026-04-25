import { serve } from "bun";
import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";
import { join } from "path";

const DB_PATH    = "/mnt/c/Users/ykoma/sd-images/gallery.db";
const IMAGES_DIR = "/mnt/c/Users/ykoma/sd-images";
const PORT       = 3210;

const db = new Database(DB_PATH, { create: true });
db.exec(`
  CREATE TABLE IF NOT EXISTS diary_entries (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    diary_date TEXT    UNIQUE NOT NULL,
    text       TEXT,
    created_at TEXT    DEFAULT (datetime('now')),
    updated_at TEXT    DEFAULT (datetime('now'))
  );
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
    diary_date TEXT,
    prompt     TEXT,
    created_at TEXT    DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_images_scene ON images(scene_id);
  CREATE INDEX IF NOT EXISTS idx_images_date ON images(diary_date);
`);

const cors = { "Access-Control-Allow-Origin": "*" };

const server = serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await readFile(join(import.meta.dir, "index.html"), "utf-8");
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── GET /api/scenes ─────────────────────────────────────────
    if (url.pathname === "/api/scenes" && req.method === "GET") {
      const scenes = db.query(`
        SELECT s.*, COUNT(i.id) as image_count,
               (SELECT id FROM images WHERE scene_id = s.id ORDER BY id LIMIT 1) as thumb_id
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

    // ── GET /api/calendar?year=YYYY&month=M ─────────────────────
    if (url.pathname === "/api/calendar" && req.method === "GET") {
      const year  = url.searchParams.get("year")  ?? new Date().getFullYear().toString();
      const month = url.searchParams.get("month") ?? String(new Date().getMonth() + 1);
      const prefix = `${year}-${month.padStart(2, "0")}`;
      const rows = db.query(`
        SELECT diary_date, COUNT(*) as count,
               (SELECT id FROM images WHERE diary_date = i.diary_date ORDER BY id LIMIT 1) as thumb_id
        FROM images i
        WHERE diary_date LIKE ?
        GROUP BY diary_date
        ORDER BY diary_date
      `).all(`${prefix}%`);
      return Response.json(rows, { headers: cors });
    }

    // ── GET /api/dates/:date ─────────────────────────────────────
    const datePageMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})$/);
    if (datePageMatch && req.method === "GET") {
      const date = datePageMatch[1];
      const entry = db.query("SELECT * FROM diary_entries WHERE diary_date = ?").get(date) as { text: string } | null;
      const scenes = db.query(`
        SELECT s.id, s.slug, s.name,
               COUNT(i.id) as image_count,
               (SELECT id FROM images WHERE scene_id = s.id AND diary_date = ? ORDER BY id LIMIT 1) as thumb_id
        FROM images i
        JOIN scenes s ON s.id = i.scene_id
        WHERE i.diary_date = ?
        GROUP BY s.id
        ORDER BY s.id
      `).all(date, date);
      return Response.json({ entry: entry ?? null, scenes }, { headers: cors });
    }

    // ── PUT /api/dates/:date ─────────────────────────────────────
    const datePutMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})$/);
    if (datePutMatch && req.method === "PUT") {
      const date = datePutMatch[1];
      const body = await req.json() as { text: string };
      db.prepare(`INSERT INTO diary_entries (diary_date, text) VALUES (?, ?)
        ON CONFLICT(diary_date) DO UPDATE SET text=excluded.text, updated_at=datetime('now')`
      ).run(date, body.text);
      return Response.json({ ok: true }, { headers: cors });
    }

    // ── GET /api/dates/:date/scenes/:slug/images ─────────────────
    const dateSceneMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})\/scenes\/([^/]+)\/images$/);
    if (dateSceneMatch && req.method === "GET") {
      const [, date, slug] = dateSceneMatch;
      const scene = db.query("SELECT id FROM scenes WHERE slug = ?").get(slug) as { id: number } | null;
      if (!scene) return Response.json([], { headers: cors });
      const images = db.query("SELECT * FROM images WHERE scene_id = ? AND diary_date = ? ORDER BY id").all(scene.id, date);
      return Response.json(images, { headers: cors });
    }

    // ── POST /api/images ─────────────────────────────────────────
    if (url.pathname === "/api/images" && req.method === "POST") {
      const body = await req.json() as {
        scene_id: number; filepath: string;
        seed?: number; steps?: number; width?: number; height?: number;
        cfg_scale?: number; sampler?: string; diary_date?: string; prompt?: string;
      };
      const stmt = db.prepare(
        "INSERT INTO images (scene_id, filepath, seed, steps, width, height, cfg_scale, sampler, diary_date, prompt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
      );
      const result = stmt.run(
        body.scene_id, body.filepath,
        body.seed ?? null, body.steps ?? null, body.width ?? null,
        body.height ?? null, body.cfg_scale ?? null, body.sampler ?? null,
        body.diary_date ?? null, body.prompt ?? null
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
