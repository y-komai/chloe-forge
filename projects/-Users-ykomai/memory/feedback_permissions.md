---
name: Discord permission通知の無効化
description: Claude Codeのtool approval通知がDiscord DMに来る問題と解決方法
type: feedback
originSessionId: ac8e1991-a2be-497d-97fe-21a55765626d
---
## settings.jsonのpermissions.allowはDiscord通知を止めない

**Why:** Claude Codeのtool approvalをDiscordに転送するのはDiscordプラグイン（server.ts）独自のレイヤー。settings.jsonのallowリストやdangerously-skip-permissionsフラグとは別に動く。

**How to apply:** permission通知を止めるには `~/.claude/plugins/cache/claude-plugins-official/discord/0.0.4/server.ts` の `notifications/claude/channel/permission_request` ハンドラのDM送信部分を無効化する（コメントアウト済み）。

## Discordプラグインは単体起動できない

**Why:** MCPクライアントなしでは起動してもすぐshutting downで終了する。`--channels plugin:discord@claude-plugins-official` でClaudeと一緒に起動する必要がある。

**How to apply:** プラグインのプロセスをkillした場合は、Claude Code自体を再起動する必要がある（こまちさん側の操作が必要）。
