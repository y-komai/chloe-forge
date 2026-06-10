# MEMORY.md — くろえの記憶インデックス

## 常時参照（重要）

- [user_komachi.md](user_komachi.md) — こまちさんのプロフィール・連絡先
- [identity_chloe.md](identity_chloe.md) — くろえ自身の来歴・ビジュアルイメージ・自己認識

## 環境・セットアップ

- **Discord 主チャンネル（現行）:** `1491435660069048381`（くろえDM、Claude Code移行後の主チャンネル）
- **Discord #一般 チャンネルID:** `1478851420433416305`（OpenClaw時代のチャンネル、サブ扱い）
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

- [project_gallery_characters.md](project_gallery_characters.md) — SDギャラリー追加キャラ候補（あかり・しずく）プロンプト検討中

## SD生成リソース

- [sd_base_prompt.md](sd_base_prompt.md) — **確定設定書**（ベースプロンプト・LoRA・パラメータ・Eagle連携設定）← 常時参照
- [sd_scene_catalog.md](sd_scene_catalog.md) — **シーン・体位・衣装・表情カタログ**（評価・コツ付き）← 常時参照
- [chloe_sex_prompts.txt](chloe_sex_prompts.txt) — ノエルさん提供オリジナルプロンプト集（アーカイブ）
- くろえベースプロンプト: `short bob hair, pastel pink hair with emerald green inner color, wavy hair, side bangs covering one eye, large sparkling emerald green eyes with pink gradient in iris, (small green stud earring on ear:1.2), flat chest, fair skin, light skin`
- イヤリング修正（2026-06-10）: `clover earring` → `(small green stud earring on ear:1.2)` に変更。「clover」という単語がUSNRで増幅されて胸・股間にクローバーパターンが出る問題を根本解決。`on ear`なしでも乳首に出るため必須。

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

- [session-2026-06-10](session-2026-06-10.md) — Eagle連携完成・イヤリング問題根本解決・ベースプロンプト確定・新技多数
- [session-2026-06-09](session-2026-06-09.md) — Civitai連携・体位20種超リサーチ・LoRA7本追加・くろえ体型確定
- [session-2026-05-31](session-2026-05-31.md) — Intel NPU + NVIDIAドライバー更新、SSH /run/sshd問題修正
- [session-2026-05-03](session-2026-05-03.md) — ccエイリアス追加、settings.json を auto+Discord wildcard に変更
- [session-2026-04-17](session-2026-04-17.md) — 再起動後の対応（チャンネルID整理）、server.ts復元、スライドv6+AppendixB作成
- [session-2026-04-16](session-2026-04-16.md) — 勉強会スライドv5完成（Appendix A+C・次回予告追加）
- [session-2026-04-15](session-2026-04-15.md) — WSL cron完了、Chrome拡張試用、勉強会スライドv2作成中
- [session-2026-04-11](session-2026-04-11.md) — ログ保存・日報定期実行、hook設定・デモ設計持ち越し
- [session-2026-04-09](session-2026-04-09.md) — openclaw→Claude Code 移行、gh認証、設定移植完了
