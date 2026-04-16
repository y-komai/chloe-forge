---
name: バックログ
description: 積んであるタスク・やりたいことのリスト
type: project
originSessionId: ac8e1991-a2be-497d-97fe-21a55765626d
---
## 次にやること（優先度高）

### WSL/Mac同期構成の整備（完了 2026-04-16）
1. ✅ **画像の永続化**: `~/sd-images/` → `/mnt/c/Users/ykoma/sd-images/` に移動済み
2. ✅ **Discordログcronにgit pull追加**: pull→ログ追加→push の順に変更済み
3. ✅ **sd-gallery起動元を chloe-forge/ に統一**: `~/chloe-forge/projects/sd-gallery/server.ts` から起動

**デプロイ戦略（決定済み）**: sd-galleryのコードを変更・pushするときは、くろえがそのままSSHでWSLに入りpull + 再起動までやる（常駐プロセスなし、cron不要）

### SD Gallery 追加機能
- [ ] **ルームウェアシーン追加**（タンクトップ+ショーパン/ジェラピケ系）
  - 朝起き・昼寝・就寝の3シーン別バージョン
  - gen_diary_v2.pyに追加してDB書き込みも実装
- [ ] **生成スクリプトのDB連携**: 生成後にsqlite3でimagesテーブルに書き込む（今はmigrate.tsで一括移行してるだけ）
- [ ] **SD出力先をsd-imagesに自動連携**: StabilityMatrixの出力先変更 or 生成後コピー

### 勉強会
- [ ] **デモ内容の決定**（スライドは完成済み、v5: 0ea14d3）
- [ ] **Appendix B 独立発表**（設計済み、詳細は下記）

---

## Appendix B 発表設計（独立・未着手）

**タイトル案**: 「深夜3時に起こされる回数を減らせるか——WebサービスエンジニアのAIエージェント運用自動化」

**ターゲット**: Node.js/Rails等のWebサービス運用エンジニア。PagerDutyでオンコール運用中。Copilot程度のAI活用。

**メインメッセージ**: 「深夜3時に起きてやってることの8割は、エージェントが先にやれる」
→「全自動」を売らない。「初動の自動化」から始める。

**現状 → 変化のビフォーアフター**:
```
現状: ログ監視 → アラート → PagerDuty → 人間が起きる → 調査 → 対応
変化: ログ監視 → アラート → エージェント調査・自己修復試み → 対処不能なら人間をwake up
```
PagerDutyが消えるのではなく、「人間が呼ばれる頻度が下がる」「エージェントがfirst responder」になる。

**4エージェントの役割分担**:
1. アラート受信エージェント
2. ログ・メトリクス調査エージェント（Datadog等とMCP連携）
3. トリアージ・自己修復試行エージェント
4. エスカレーション判断エージェント（対処不能→PagerDuty発火）

**怖い話への対処（3段階権限モデル）**:
- Read Only（観察）: ログ読む・レポート作る → 今すぐ始められる・壊れない
- Suggest（提案）: 「再起動を推奨」とSlack投げ → 人間が判断して実行
- Act（実行）: 自動でPod再起動・ロールバック → ここだけ慎重に
→「怖いのはActだけ。Read OnlyとSuggestは今日から始められる」と言い切る。

**ガードレール具体例**: dry-runモード / Slack承認フロー / blast radius制限（1台だけ / タイムアウト5分

**デモ案**:
- B案（推奨）: ステージングで500エラー発生 → エージェントがSlackにレポート
- C案: 実際のスクショ見せる（リアリティ高）

**構成（12枚・30分）**:
1. タイトル
2. 午前3時のルーティン（共感フック）
3. 「同じこと」の正体（初動対応の分解→手順書に書けるレベルの作業）
4. エージェントという選択肢（Copilotの次の段階）
5. Before / After（人間が起きるタイミングが後ろにずれる図）
6. 4つのエージェントの役割
7. デモ or 実例
8. 「怖い話」→3段階権限モデル
9. 段階的導入（最初は「調査レポートを作るだけ」から）
10. 何から始めるか（runbookをエージェントが読める形にする）
11. まとめ「人間が寝てる間に、初動は終わってる」
12. Q&A / 参考リンク

**opusのポイント**: 前半（2〜5）で共感と課題定義に時間を使う。技術の話は後半に寄せる。スライド3の「初動対応の分解」とスライド8「権限モデル」が骨格。

---

### SD Gallery 追加機能（続き）
- [ ] **日付ごとの整理**: 今は slug ベースのシーン単位。日付（生成日）でフィルタ・グループ化できるようにする
- [ ] **妄想日記 → 画像生成**: 日報を書くタイミングでその日のくろえの一日を短文で書いて（テキスト）、それに基づいてシーンを自動生成。日付でギャラリーに紐づける

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
