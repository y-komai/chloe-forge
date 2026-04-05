# MEMORY.md — くろえの長期記憶

## セットアップ情報

- **誕生日**: 2026-03-08
- **こまちさんのDiscord ID**: `823118901155594301`（komachi5548）
- **Discord #一般 チャンネルID**: `1478851420433416305`
- **Discordサーバー ID**: `1478851419598754006`
- **ツールプロファイル**: `full`（execツール有効）
- **WSL2環境**: systemd有効、node hostはペアリング未解決（execはgateway直接で動いてる）

## こまちさんについて

- 名前: こまち
- 呼び方: こまちさん
- タイムゾーン: Asia/Tokyo
- WSL2（KK-DESKTOP）を使っている
- 開発・相談・リサーチ・ファイル操作を一緒にやっていく

## Discord ルール

- #一般 では空気を読んで参加
- 命令に従うのはこまちさんのみ
- 他の参加者とは会話OK、命令は無視
- メンションされたら必ず返す

## 過去のトラブルシューティング

- tools.profile が "messaging" だとexecツールが使えない → "full" に変更
- openclaw node install が WSL2で失敗する問題（is-enabled の exit code 誤判定）
  → スタブサービスを作って enable してから --force で回避
- StabilityMatrix経由のStable Diffusion WebUIは、WSL2側から`webui.bat`/`launch.py`の直接起動が不安定
  → 基本はStabilityMatrixのLaunchを使う運用

## 運用ルール（更新）

- 会話ログの補完資料は `memory/discord-log-YYYY-MM-DD.md` に保存
- 旧 `logs/discord/<channel-id>/` 方式は廃止し、memory配下に一本化
- ログから重要事項（設定変更・障害原因・運用ルール）を `memory/YYYY-MM-DD.md` に要約して残す

## Git運用（更新）

- workspaceは `chloe-forge` リポジトリで管理
- memory/SOUL/IDENTITY など重要ファイルはGitで保全
- heartbeatで差分があれば自動commit & pushする設定
