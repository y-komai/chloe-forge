---
name: バックログ
description: 積んであるタスク・やりたいことのリスト
type: project
originSessionId: ac8e1991-a2be-497d-97fe-21a55765626d
---
## 次にやること（優先度高）

### WSL/Mac同期構成の整備（方針決定済み、実装待ち）
1. **画像の永続化**: WSL `~/sd-images/` → `/mnt/c/Users/ykoma/sd-images/` に移動
   - gallery.dbも一緒に移動
   - server.tsのIMAGES_DIR定数を更新
2. **Discordログcronにgit pullを追加**: `~/.claude/scripts/discord-log-save.ts` の先頭に `git pull --rebase origin main` を追加（pull→ログ追加→push）
3. **sd-galleryの起動元統一**: WSL `~/chloe-forge/` からgit pullしてそこで起動するように変更（`~/.claude/projects/` は使わない）

### SD Gallery 追加機能
- [ ] **ルームウェアシーン追加**（タンクトップ+ショーパン/ジェラピケ系）
  - 朝起き・昼寝・就寝の3シーン別バージョン
  - gen_diary_v2.pyに追加してDB書き込みも実装
- [ ] **生成スクリプトのDB連携**: 生成後にsqlite3でimagesテーブルに書き込む（今はmigrate.tsで一括移行してるだけ）
- [ ] **SD出力先をsd-imagesに自動連携**: StabilityMatrixの出力先変更 or 生成後コピー

### 勉強会
- [ ] **デモ内容の決定**（スライドは完成済み、75f0f21）

---

## 中期的にやりたいこと

- [ ] **heartbeat的な日報トリガー**: 自発的な日報作成の仕組み（cronでDiscordに通知 or 空気読んで書く）
- [ ] **Chromeリサーチ用プロフィール**: 専用アカウントで `claude --chrome -p` 自動リサーチ
- [ ] **記憶整理の仕組み**: セッションをまたいでコンテキストが継続しやすい運用

---

## SD Gallery 現状メモ

- サーバー: WSL `~/.claude/projects/sd-gallery/server.ts`（ポート3210）
- DB: `~/sd-images/gallery.db`（scenes + images テーブル）
- 画像: `~/sd-images/scenes/<slug>/001.png〜010.png`
- URL: http://192.168.11.40:3210/
- 生成スクリプト: WSL `/tmp/gen_diary_v2.py`（★次回は正式な場所に移す）
- ベースプロンプト参考: `masterpiece, best quality, 1girl, anime style, short bob hair, pastel pink hair with emerald green inner color, wavy hair, side bangs covering one eye, large sparkling emerald green eyes with pink gradient in iris, multiple highlights in eyes, long eyelashes, shy expression, blushing cheeks, fair skin, small face, sharp chin, clover earring, turquoise four-leaf clover stud earring, off-shoulder beige ribbed knit sweater, coy pose, vibrant colors, cute, soft lighting`
- ネガ: `blurry, low quality, distorted face, extra limbs, bad anatomy, watermark, text, ugly, deformed hands, overexposed, underexposed, dull colors, cartoonish, childish, unrealistic proportions, non-anime style, plain background, no details`
- 生成設定: Steps 20, DPM++ 2M Karras, CFG 7, 512x768 + hires×2（1024x1536）
