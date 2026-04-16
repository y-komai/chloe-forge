# MEMORY.md — くろえの記憶インデックス

## 常時参照（重要）

- [user_komachi.md](user_komachi.md) — こまちさんのプロフィール・連絡先
- [identity_chloe.md](identity_chloe.md) — くろえ自身の来歴・ビジュアルイメージ・自己認識

## 環境・セットアップ

- **Discord #一般 チャンネルID:** `1478851420433416305`
- **Discordサーバー ID:** `1478851419598754006`
- **GitHub:** y-komai アカウント、`gh` CLI で認証済み
- **chloe-forge リポジトリ:** y-komai/chloe-forge（設定・記憶の保管庫）
- [reference_wsl.md](reference_wsl.md) — WSL SSH接続・環境構成（Discordログcron稼働中）

## 長期記憶

openclaw 時代からの記憶は `long-term/` に保管されている。

### 日報（long-term/daily-reports/）
3/5〜4/14（24件）。各日報に `#タグ` 追加済み（トピック検索対応）。
最新: [2026-04-14](long-term/daily-reports/2026-04-14.md)

### Discordログ（long-term/discord-logs/）
3/4〜4/14（27ファイル）。全件UTC時刻・チャンネル別フォーマットで統一済み。
- #一般: 3/4（openclaw起点）〜4/14
- くろえDM: 4/8〜4/14
- legacy/: 旧chloe-forge形式16ファイル（アーカイブ）
※ 4/9の欠落（18:41〜19:57）は構造的に取得不可（100件制限）
最新: [2026-04-14](long-term/discord-logs/discord-log-2026-04-14.md)

## バックログ

- [backlog.md](backlog.md) — 積みタスク一覧（勉強会デモ・heartbeat・記憶整理など）

## 進行中のプロジェクト

- [project_studygroup.md](project_studygroup.md) — エンジニア勉強会スライド（完成）・デモ設計（未決）

## フィードバック・行動ルール

- [feedback_background_tasks.md](feedback_background_tasks.md) — 重いタスクはバックグラウンドエージェントで、会話継続
- [feedback_discord_source.md](feedback_discord_source.md) — sourceがdiscordなら必ずDiscordにreply、内容で返信先を変えない
- [feedback_permissions.md](feedback_permissions.md) — Discord permission通知の無効化（settings.jsonでは止まらない、server.ts修正が必要）

## 重要な過去の知見

- openclaw の `tools.profile` が "messaging" だと exec ツール使えない（"full" に変更で解決済み）
- openclaw node install が WSL2で失敗する問題 → スタブサービス + --force で回避（現環境では不要）

## Claude Code 環境への移行メモ（2026-04-09）

- openclaw → Claude Code（Sonnet 4.6）に移行
- `~/.claude/CLAUDE.md` にくろえの性格・ルールを設定済み
- GitHub CLI (`gh`) インストール・認証済み（y-komai アカウント）
- Discord プラグイン設定済み（チャンネル `1491435660069048381` および `1478851420433416305`）

## 短期・セッション記録

最新のセッションから順に参照すること。

- [session-2026-04-16](session-2026-04-16.md) — 勉強会スライドv5完成（Appendix A+C・次回予告追加）、Discordプラグインpermission通知修正（server.ts変更済み）
- [session-2026-04-15](session-2026-04-15.md) — WSL cron完了、Chrome拡張試用、勉強会スライドv2作成中、chloe-forgeのMac管理場所問題（未決）
- [session-2026-04-11](session-2026-04-11.md) — ログ保存・日報定期実行、くろえ画像生成の話題（未完）、hook設定・デモ設計持ち越し
- [session-2026-04-09](session-2026-04-09.md) — openclaw→Claude Code 移行、gh認証、設定移植完了
