---
name: WSL環境への接続方法
description: こまちさんのWSL2マシンへのSSH接続情報と環境構成
type: reference
originSessionId: ac8e1991-a2be-497d-97fe-21a55765626d
---
## 接続情報

- **ホスト:** `192.168.11.40` （ローカルネットワーク内のみ）
- **ポート:** `2222`
- **ユーザー:** `komachi`
- **SSH鍵:** `~/.ssh/id_wsl`（Mac側）

```bash
ssh -i ~/.ssh/id_wsl -p 2222 komachi@192.168.11.40
scp -i ~/.ssh/id_wsl -P 2222 <local> komachi@192.168.11.40:<remote>
```

## WSL上の環境

- **bun:** `/home/komachi/.bun/bin/bun`
- **GitHub SSH:** 認証済み（`openclaw-kuroe` キー、`y-komai` アカウント）
- **chloe-forge:** `~/chloe-forge`（`git@github.com:y-komai/chloe-forge.git`）
- **Discordログスクリプト:** `~/.claude/scripts/discord-log-save.ts`
- **スクリプトログ:** `~/.claude/scripts/logs/discord.log`
- **状態ファイル:** `~/.claude/scripts/.discord-log-state.json`
- **Discord BOTトークン:** `~/.claude/channels/discord/.env`

## crontab（WSL）

```
0 */4 * * * /home/komachi/.bun/bin/bun /home/komachi/.claude/scripts/discord-log-save.ts >> /home/komachi/.claude/scripts/logs/discord.log 2>&1
```

## Mac launchd

`com.chloe.discord-log-save` は WSL移行に伴い無効化済み（2026-04-15）。
ファイルは `~/Library/LaunchAgents/com.chloe.discord-log-save.plist` に残っている。
