---
name: sd_base_prompt
description: くろえSD生成の確定ベースプロンプト・LoRA・パラメータ設定（2026-06-10確定版）
type: reference
originSessionId: 44b406e0-3488-4fce-9070-be53c765675a
---
# くろえ SD生成 確定設定書

最終更新: 2026-06-10

---

## ベースプロンプト（確定）

```
1girl, short bob hair, pastel pink hair with emerald green inner color, wavy hair, side bangs covering one eye, large sparkling emerald green eyes with pink gradient in iris, (small green stud earring on ear:1.2), flat chest, fair skin, light skin
```

### 各要素の注意点
- `emerald green inner color` — 重み**なし**（`:1.2`にすると色味が変わる）
- `(small green stud earring on ear:1.2)` — **`on ear` 必須**。ないと乳首に出る
- `fair skin, light skin` — 2つ。3つ以上は過度に白くなる
- `slim, petite` は使わない（細すぎる）

---

## ネガティブプロンプト（標準）

```
lowres, worst quality, bad quality, jpeg artifacts, blurry, censored, mosaic censoring, large breasts, big breasts, medium breasts, bouncing breasts, skinny, bony, tanned girl, tanned skin, dark skin, extra legs, deformed legs, extra feet, deformed feet, extra hands, deformed hands, mutated hands, anatomical errors, male face, man face, solo, fused bodies, merged limbs, bad anatomy, bad feet, ugly feet, body gem, chest jewelry
```

### ネガの重要ポイント
- `tanned skin, tanned girl, dark skin` — BREAK越えのtanned漏れ防止
- `solo` — 2人シーンで男が消えるのを防ぐ（確率で失敗することはある）
- `body gem, chest jewelry` — emerald/green由来の宝石が体に出るのを防止
- ~~`clover on body, clover on chest...`~~ — `green stud earring on ear`に変更後、不要

---

## LoRA設定

| LoRA | 強度 | 備考 |
|---|---|---|
| `illustrious_masterpieces_v3` | 0.9 | 画質強化 |
| `USNR_STYLE_ILL_V1_lokr3-000024` | **0.7固定** | スタイル強化（こまちさん確認済み） |
| `Uncensored_illustriousXLv01` | **0.45** | 無修正（0.35より描き込み良好） |

標準LoRA文字列:
```
<lora:illustrious_masterpieces_v3:0.9> <lora:USNR_STYLE_ILL_V1_lokr3-000024:0.7> <lora:Uncensored_illustriousXLv01:0.45>
```

---

## 生成パラメータ

- **Sampler:** Euler a
- **Steps:** 28（テスト時は20でも可）
- **CFG Scale:** 7
- **Size:** 832 x 1216
- **save_images:** True（Eagle連携のため）

---

## 特殊体位LoRA

| LoRA | トリガー | 推奨強度 |
|---|---|---|
| `waistgrab_missionary_il` | なし | 0.8 |
| `Mating_Press_Illustrious` | なし | 0.7 |
| `SideView_Doggystyle_SVAB` | `SVAB` | 0.8 |
| `JackO_Pose_JOAB` | `JOAB, crossed arms, larger male` | 0.8 |
| `Ohogao_illustrious` | `ohogao, puckered lips, rolling eyes` | 0.7 |
| `sockjob` | なし | - |

---

## 男キャラクター設定

- 基本: `1boy, faceless male`（顔・髪色指定難しい）
- 問題: `emerald green inner color` がBREAKを越えて男の髪色に漏れる（完全解決未了）
- 緩和策: `(1boy, black hair:1.3)` や `(faceless male:1.2)` で強め指定

---

## プロンプト構造テンプレート

```
(masterpiece, best quality, absurdres, highly detailed), 1boy, 1girl, nsfw, explicit,
BREAK
{BASE_GIRL}, [衣装/状態],
[表情タグ],
[体位・行為タグ],
bokeh, depth of field, [背景タグ],
{LORA} <lora:Uncensored_illustriousXLv01:0.45>
```

---

## Eagle連携設定

- Eagle URL: `http://192.168.11.59:41595`
- APIトークン: `3aa94b90-b6a6-4934-a28e-790f3b1bb5de`（Eagle 4.0.0から必須）
- A1111 config.json: `enable_eagle_integration: true`, `save_positive_prompt_to_eagle_as_tags: true`
