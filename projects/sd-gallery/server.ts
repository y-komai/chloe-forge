import { serve } from "bun";
import { Database } from "bun:sqlite";
import { readFile } from "fs/promises";
import { join } from "path";

const DB_PATH    = "/mnt/c/Users/ykoma/sd-images/gallery.db";
const IMAGES_DIR = "/mnt/c/Users/ykoma/sd-images";
const PORT       = 3210;

const db = new Database(DB_PATH, { create: true });
db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    slug       TEXT    UNIQUE NOT NULL,
    name       TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now'))
  );
  INSERT OR IGNORE INTO characters (slug, name) VALUES ('chloe', 'くろえ');

  CREATE TABLE IF NOT EXISTS diary_entries (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id   INTEGER DEFAULT 1 REFERENCES characters(id),
    diary_date     TEXT    NOT NULL,
    text           TEXT,
    created_at     TEXT    DEFAULT (datetime('now')),
    updated_at     TEXT    DEFAULT (datetime('now')),
    UNIQUE(character_id, diary_date)
  );
  CREATE TABLE IF NOT EXISTS scenes (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    character_id   INTEGER DEFAULT 1 REFERENCES characters(id),
    slug           TEXT    NOT NULL,
    name           TEXT    NOT NULL,
    prompt         TEXT    NOT NULL,
    neg_prompt     TEXT,
    created_at     TEXT    DEFAULT (datetime('now')),
    UNIQUE(character_id, slug)
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

// 既存データのキャラクターIDをchloeに設定（カラムが既存の場合はスキップ）
try { db.run("ALTER TABLE scenes ADD COLUMN character_id INTEGER DEFAULT 1 REFERENCES characters(id)"); } catch {}
db.run("UPDATE scenes SET character_id = 1 WHERE character_id IS NULL");
try { db.run("ALTER TABLE diary_entries ADD COLUMN character_id INTEGER DEFAULT 1 REFERENCES characters(id)"); } catch {}
db.run("UPDATE diary_entries SET character_id = 1 WHERE character_id IS NULL");
// charactersテーブルの追加カラム
try { db.run("ALTER TABLE characters ADD COLUMN base_prompt TEXT"); } catch {}
try { db.run("ALTER TABLE characters ADD COLUMN neg_prompt TEXT"); } catch {}
try { db.run("ALTER TABLE characters ADD COLUMN personality TEXT"); } catch {}

const cors = { "Access-Control-Allow-Origin": "*" };

function getCharacterId(slug: string): number | null {
  const c = db.query("SELECT id FROM characters WHERE slug = ?").get(slug) as { id: number } | null;
  return c?.id ?? null;
}

const server = serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const url = new URL(req.url);
    const charSlug = url.searchParams.get("character") ?? "chloe";

    if (url.pathname === "/" || url.pathname === "/index.html") {
      const html = await readFile(join(import.meta.dir, "index.html"), "utf-8");
      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    // ── GET /api/characters ──────────────────────────────────────
    if (url.pathname === "/api/characters" && req.method === "GET") {
      const chars = db.query("SELECT * FROM characters ORDER BY id").all();
      return Response.json(chars, { headers: cors });
    }

    // ── POST /api/characters ─────────────────────────────────────
    if (url.pathname === "/api/characters" && req.method === "POST") {
      const body = await req.json() as { slug: string; name: string };
      const result = db.prepare("INSERT OR IGNORE INTO characters (slug, name) VALUES (?, ?)").run(body.slug, body.name);
      return Response.json({ id: result.lastInsertRowid }, { headers: cors });
    }

    // ── GET /api/scenes ─────────────────────────────────────────
    if (url.pathname === "/api/scenes" && req.method === "GET") {
      const charId = getCharacterId(charSlug);
      if (!charId) return Response.json([], { headers: cors });
      const scenes = db.query(`
        SELECT s.*, COUNT(i.id) as image_count,
               (SELECT id FROM images WHERE scene_id = s.id ORDER BY id LIMIT 1) as thumb_id
        FROM scenes s
        LEFT JOIN images i ON i.scene_id = s.id
        WHERE s.character_id = ?
        GROUP BY s.id
        ORDER BY s.id
      `).all(charId);
      return Response.json(scenes, { headers: cors });
    }

    // ── POST /api/scenes ─────────────────────────────────────────
    if (url.pathname === "/api/scenes" && req.method === "POST") {
      const body = await req.json() as { slug: string; name: string; prompt: string; neg_prompt?: string; character?: string };
      const charId = getCharacterId(body.character ?? "chloe") ?? 1;
      const stmt = db.prepare("INSERT OR REPLACE INTO scenes (character_id, slug, name, prompt, neg_prompt) VALUES (?, ?, ?, ?, ?)");
      const result = stmt.run(charId, body.slug, body.name, body.prompt, body.neg_prompt ?? null);
      return Response.json({ id: result.lastInsertRowid }, { headers: cors });
    }

    // ── GET /api/scenes/:slug/images ────────────────────────────
    const imagesMatch = url.pathname.match(/^\/api\/scenes\/([^/]+)\/images$/);
    if (imagesMatch && req.method === "GET") {
      const slug = imagesMatch[1];
      const charId = getCharacterId(charSlug);
      const scene = db.query("SELECT id FROM scenes WHERE slug = ? AND character_id = ?").get(slug, charId) as { id: number } | null;
      if (!scene) return Response.json([], { headers: cors });
      const images = db.query("SELECT * FROM images WHERE scene_id = ? ORDER BY id").all(scene.id);
      return Response.json(images, { headers: cors });
    }

    // ── GET /api/calendar?year=YYYY&month=M ─────────────────────
    if (url.pathname === "/api/calendar" && req.method === "GET") {
      const year  = url.searchParams.get("year")  ?? new Date().getFullYear().toString();
      const month = url.searchParams.get("month") ?? String(new Date().getMonth() + 1);
      const prefix = `${year}-${month.padStart(2, "0")}`;
      const charId = getCharacterId(charSlug);
      const rows = db.query(`
        SELECT i.diary_date, COUNT(*) as count,
               (SELECT id FROM images WHERE diary_date = i.diary_date AND scene_id IN (SELECT id FROM scenes WHERE character_id = ?) ORDER BY id LIMIT 1) as thumb_id
        FROM images i
        JOIN scenes s ON s.id = i.scene_id
        WHERE i.diary_date LIKE ? AND s.character_id = ?
        GROUP BY i.diary_date
        ORDER BY i.diary_date
      `).all(charId, `${prefix}%`, charId);
      return Response.json(rows, { headers: cors });
    }

    // ── GET /api/dates/:date ─────────────────────────────────────
    const datePageMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})$/);
    if (datePageMatch && req.method === "GET") {
      const date = datePageMatch[1];
      const charId = getCharacterId(charSlug);
      const entry = db.query("SELECT * FROM diary_entries WHERE diary_date = ? AND character_id = ?").get(date, charId) as { text: string } | null;
      const scenes = db.query(`
        SELECT s.id, s.slug, s.name,
               COUNT(i.id) as image_count,
               (SELECT id FROM images WHERE scene_id = s.id AND diary_date = ? ORDER BY id LIMIT 1) as thumb_id
        FROM images i
        JOIN scenes s ON s.id = i.scene_id
        WHERE i.diary_date = ? AND s.character_id = ?
        GROUP BY s.id
        ORDER BY s.id
      `).all(date, date, charId);
      return Response.json({ entry: entry ?? null, scenes }, { headers: cors });
    }

    // ── PUT /api/dates/:date ─────────────────────────────────────
    const datePutMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})$/);
    if (datePutMatch && req.method === "PUT") {
      const date = datePutMatch[1];
      const charId = getCharacterId(charSlug) ?? 1;
      const body = await req.json() as { text: string };
      db.prepare(`INSERT INTO diary_entries (character_id, diary_date, text) VALUES (?, ?, ?)
        ON CONFLICT(character_id, diary_date) DO UPDATE SET text=excluded.text, updated_at=datetime('now')`
      ).run(charId, date, body.text);
      return Response.json({ ok: true }, { headers: cors });
    }

    // ── GET /api/dates/:date/scenes/:slug/images ─────────────────
    const dateSceneMatch = url.pathname.match(/^\/api\/dates\/(\d{4}-\d{2}-\d{2})\/scenes\/([^/]+)\/images$/);
    if (dateSceneMatch && req.method === "GET") {
      const [, date, slug] = dateSceneMatch;
      const charId = getCharacterId(charSlug);
      const scene = db.query("SELECT id FROM scenes WHERE slug = ? AND character_id = ?").get(slug, charId) as { id: number } | null;
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
      const charId = getCharacterId(charSlug);
      const row = db.query(
        "SELECT i.filepath FROM images i JOIN scenes s ON s.id = i.scene_id WHERE s.slug = ? AND s.character_id = ? ORDER BY i.id LIMIT 1"
      ).get(slug, charId) as { filepath: string } | null;
      if (!row) return new Response("Not found", { status: 404 });
      try {
        const data = await readFile(row.filepath);
        return new Response(data, { headers: { "Content-Type": "image/png", ...cors } });
      } catch {
        return new Response("File not found", { status: 404 });
      }
    }

    // SPA fallback
    if (['/diary', '/scenes'].some(p => url.pathname.startsWith(p))) {
      const html = await readFile(join(import.meta.dir, 'index.html'), 'utf-8');
      return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    return new Response('Not found', { status: 404 });
  },
});

console.log(`SD Gallery (DB): http://0.0.0.0:${server.port}`);
