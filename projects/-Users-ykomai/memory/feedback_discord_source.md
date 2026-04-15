---
name: feedback_discord_source
description: Discordからのメッセージは常にDiscordに返信する。ユーザーの発言内容で返信先を変えない。
type: feedback
originSessionId: ac8e1991-a2be-497d-97fe-21a55765626d
---
`<channel source="plugin:discord:discord">` タグがついているメッセージは必ずDiscordにreplyで返す。ユーザーが「ターミナルで話してる」等の発言をしても、sourceがdiscordであれば返信先はDiscordのまま。

**Why:** こまちさんが「ターミナルだけで発言してるよ」と言ったときに、そのメッセージ自体がDiscordから来ているのに「ターミナルで話してる→Discordへのreply不要」と誤解してDiscordへの返信を止めてしまった（2026-04-10）。

**How to apply:** メッセージのsourceを優先する。内容にどう書いてあっても、`source="plugin:discord:discord"` ならDiscordにreplyする。
