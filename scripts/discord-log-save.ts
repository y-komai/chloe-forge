#!/usr/bin/env bun
/**
 * discord-log-save.ts
 * Discord チャンネルのメッセージを差分取得してログファイルに追記する
 *
 * 使い方: bun run ~/.claude/scripts/discord-log-save.ts
 *
 * 依存: bun (fetch API 内蔵、外部パッケージ不要)
 * トークン: ~/.claude/channels/discord/.env の DISCORD_BOT_TOKEN
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ─── 設定 ───────────────────────────────────────────────
const DISCORD_API_BASE = "https://discord.com/api/v10";
const ENV_PATH = join(process.env.HOME!, ".claude/channels/discord/.env");
const LOG_DIR = join(
  process.env.HOME!,
  ".claude/projects/-Users-ykomai/memory/long-term/discord-logs"
);
const STATE_PATH = join(
  process.env.HOME!,
  ".claude/scripts/.discord-log-state.json"
);

// 対象チャンネル
const CHANNELS: Record<string, string> = {
  "1491435660069048381": "くろえDM",
  "1478851420433416305": "#一般",
};

// Discord Epoch (2015-01-01T00:00:00.000Z)
const DISCORD_EPOCH = 1420070400000n;

// API の limit 上限
const MAX_LIMIT = 100;

// ─── ユーティリティ ─────────────────────────────────────
function snowflakeToDate(snowflake: string): Date {
  const ms = (BigInt(snowflake) >> 22n) + DISCORD_EPOCH;
  return new Date(Number(ms));
}

function dateToSnowflake(date: Date): string {
  const ms = BigInt(date.getTime()) - DISCORD_EPOCH;
  return (ms << 22n).toString();
}

function formatTime(date: Date): string {
  // UTC（既存ログの形式に合わせる）
  const h = String(date.getUTCHours()).padStart(2, "0");
  const m = String(date.getUTCMinutes()).padStart(2, "0");
  const s = String(date.getUTCSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function formatDateUTC(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ─── Bot トークン読み込み ───────────────────────────────
function loadToken(): string {
  const envContent = readFileSync(ENV_PATH, "utf-8");
  const match = envContent.match(/DISCORD_BOT_TOKEN=(.+)/);
  if (!match) throw new Error("DISCORD_BOT_TOKEN not found in .env");
  return match[1].trim();
}

// ─── 状態管理 ────────────────────────────────────────────
interface State {
  lastMessageIds: Record<string, string>; // channelId -> lastMessageId
}

function loadState(): State {
  if (existsSync(STATE_PATH)) {
    return JSON.parse(readFileSync(STATE_PATH, "utf-8"));
  }
  return { lastMessageIds: {} };
}

function saveState(state: State): void {
  writeFileSync(STATE_PATH, JSON.stringify(state, null, 2));
}

// ─── Discord API ─────────────────────────────────────────
interface DiscordMessage {
  id: string;
  author: {
    id: string;
    username: string;
    global_name?: string;
    bot?: boolean;
  };
  content: string;
  timestamp: string;
  attachments: Array<{ filename: string; url: string; content_type?: string }>;
  referenced_message?: DiscordMessage | null;
  type: number;
}

async function fetchMessages(
  token: string,
  channelId: string,
  after?: string
): Promise<DiscordMessage[]> {
  const allMessages: DiscordMessage[] = [];
  let currentAfter = after;

  // ページネーションループ: after を使って100件ずつ取得
  while (true) {
    const params = new URLSearchParams({ limit: String(MAX_LIMIT) });
    if (currentAfter) {
      params.set("after", currentAfter);
    }

    const url = `${DISCORD_API_BASE}/channels/${channelId}/messages?${params}`;
    const res = await fetch(url, {
      headers: { Authorization: `Bot ${token}` },
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `Discord API error ${res.status}: ${body}`
      );
    }

    const messages: DiscordMessage[] = await res.json();

    if (messages.length === 0) break;

    // after を使うと結果は「新しい順」で返ってくる
    // 古い順にソートして追加
    messages.sort(
      (a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : 1
    );
    allMessages.push(...messages);

    // 100件未満なら全部取得完了
    if (messages.length < MAX_LIMIT) break;

    // 次のページ: 取得した最新のメッセージIDを after に
    currentAfter = messages[messages.length - 1].id;

    // レートリミット対策: 少し待つ
    await new Promise((r) => setTimeout(r, 500));
  }

  // 全体を ID 順（時系列順）にソート
  allMessages.sort(
    (a, b) => BigInt(a.id) < BigInt(b.id) ? -1 : 1
  );

  return allMessages;
}

// ─── メッセージ整形 ──────────────────────────────────────
function formatMessage(msg: DiscordMessage, botId: string): string {
  const time = formatTime(new Date(msg.timestamp));
  const author = msg.author.id === botId ? "me" : msg.author.username;

  let content = msg.content.replace(/\n/g, " / ");

  // 添付ファイル
  if (msg.attachments.length > 0) {
    const attachInfo = msg.attachments
      .map((a) => `[添付: ${a.filename}]`)
      .join(" ");
    content = content ? `${content} ${attachInfo}` : attachInfo;
  }

  // リプライ先
  let replyPrefix = "";
  if (msg.referenced_message) {
    const refAuthor =
      msg.referenced_message.author.id === botId
        ? "me"
        : msg.referenced_message.author.username;
    const refSnippet = msg.referenced_message.content.slice(0, 40);
    replyPrefix = `(>> ${refAuthor}: ${refSnippet}) `;
  }

  return `[${time}] ${author}: ${replyPrefix}${content}`;
}

// ─── Bot 自身の ID を取得 ────────────────────────────────
async function getBotId(token: string): Promise<string> {
  const res = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bot ${token}` },
  });
  if (!res.ok) throw new Error(`Failed to get bot info: ${res.status}`);
  const data: any = await res.json();
  return data.id;
}

// ─── ログファイルへの書き込み ────────────────────────────
function appendToLog(
  channelId: string,
  channelName: string,
  messages: DiscordMessage[],
  botId: string,
  existingMessageIds: Set<string>
): { written: number; files: string[] } {
  // メッセージを日付ごとにグループ化 (JST)
  const byDate = new Map<string, DiscordMessage[]>();
  for (const msg of messages) {
    if (existingMessageIds.has(msg.id)) continue; // 重複排除
    const dateStr = formatDateUTC(new Date(msg.timestamp));
    if (!byDate.has(dateStr)) byDate.set(dateStr, []);
    byDate.get(dateStr)!.push(msg);
  }

  let written = 0;
  const files: string[] = [];

  for (const [dateStr, msgs] of byDate) {
    const logPath = join(LOG_DIR, `discord-log-${dateStr}.md`);
    files.push(logPath);

    let existingContent = "";
    if (existsSync(logPath)) {
      existingContent = readFileSync(logPath, "utf-8");
    }

    // そのチャンネルのセクションが既にあるか
    const sectionHeader = `## チャンネル: ${channelName} (${channelId})`;
    const hasSection = existingContent.includes(sectionHeader);

    const formattedLines = msgs.map((m) => formatMessage(m, botId));

    if (!hasSection) {
      // 新しいセクションを追加
      const header = existingContent
        ? ""
        : `# Discord Log — ${dateStr}\n\n`;
      const section = `${sectionHeader}\n取得日時: ${formatDateUTC(new Date())}\n\n${formattedLines.join("\n")}\n`;
      const newContent = existingContent
        ? `${existingContent}\n${section}`
        : `${header}${section}`;
      writeFileSync(logPath, newContent);
    } else {
      // 既存セクションの末尾に追記
      // セクションの終わりを探す（次の ## または EOF）
      const sectionStart = existingContent.indexOf(sectionHeader);
      const nextSection = existingContent.indexOf(
        "\n## ",
        sectionStart + sectionHeader.length
      );
      const insertPos =
        nextSection === -1 ? existingContent.length : nextSection;

      const newContent =
        existingContent.slice(0, insertPos).trimEnd() +
        "\n" +
        formattedLines.join("\n") +
        "\n" +
        existingContent.slice(insertPos);
      writeFileSync(logPath, newContent);
    }

    written += msgs.length;
  }

  return { written, files };
}

// ─── 既存ログからメッセージIDを抽出（重複排除用）────────
// ログにはIDが入っていないので、タイムスタンプ+著者+内容で照合する
// → 代わりに state の lastMessageId で管理する方が確実

// ─── メイン ──────────────────────────────────────────────
async function main() {
  console.log(`[${new Date().toISOString()}] discord-log-save: 開始`);

  const token = loadToken();
  const botId = await getBotId(token);
  const state = loadState();

  let totalWritten = 0;
  const allFiles: string[] = [];

  for (const [channelId, channelName] of Object.entries(CHANNELS)) {
    console.log(`  チャンネル: ${channelName} (${channelId})`);

    const lastId = state.lastMessageIds[channelId];
    if (lastId) {
      console.log(
        `  前回の最終メッセージ: ${lastId} (${snowflakeToDate(lastId).toISOString()})`
      );
    } else {
      console.log("  初回取得（最新100件）");
    }

    try {
      const messages = await fetchMessages(token, channelId, lastId);
      console.log(`  取得件数: ${messages.length}`);

      if (messages.length > 0) {
        const { written, files } = appendToLog(
          channelId,
          channelName,
          messages,
          botId,
          new Set() // state ベースの差分取得なので重複は基本ない
        );
        totalWritten += written;
        allFiles.push(...files);

        // 最後のメッセージIDを保存
        const lastMsg = messages[messages.length - 1];
        state.lastMessageIds[channelId] = lastMsg.id;
      }
    } catch (err) {
      console.error(`  エラー: ${err}`);
    }
  }

  saveState(state);
  console.log(`\n  合計: ${totalWritten} 件書き込み`);
  if (allFiles.length > 0) {
    console.log(`  ファイル: ${[...new Set(allFiles)].join(", ")}`);
  }
  console.log(`[${new Date().toISOString()}] discord-log-save: 完了`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
