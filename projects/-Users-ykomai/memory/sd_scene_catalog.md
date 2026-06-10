---
name: sd_scene_catalog
description: くろえSD生成のシーン・体位・衣装・表情カタログ（評価・コツ付き）
type: reference
originSessionId: 44b406e0-3488-4fce-9070-be53c765675a
---
# くろえ SD シーンカタログ

最終更新: 2026-06-10

---

## 体位カタログ

### ★★★ 高評価（安定・よく出る）

**Cowgirl POV（下からのカウガール）**
```
cowgirl position, riding, straddling, penetration, from below, girl facing camera, POV
```
- 顔と体が両方映る最良構図。背景も見える

**Oral（見上げフェラ）**
```
fellatio, blowjob, penis in mouth, looking up, eye contact, kneeling, hands on thighs, teary eyes, drool
```
- 表情が主役になる。eye contact が映える

**Missionary（標準）**
```
missionary position, lying on back, legs spread, penetration
```
- 安定。`waistgrab_missionary_il LoRA` でさらに良くなる

**Facesitting**
```
facesitting, sitting on face, cunnilingus from below, grinding
```
- 表情が見やすく上向き構図が取りやすい

**Doggy（見返り）**
```
sex from behind, doggy style, looking back over shoulder, bent over, penetration
```
- `looking back over shoulder` で顔が見える。側面より安定

---

### ★★ 良好（条件付きで良い）

**Ribbon Bondage Missionary**
```
wrists bound above head, pink ribbon bondage, arms stretched up, tied to headboard, missionary position
```
- ピンクリボンがヘアカラーに合う

**Reverse Cowgirl**
```
reverse cowgirl position, riding, facing away, hands on knees, arched back
```
- 後ろ姿がきれい。行為感がやや弱め

**Standing Doggy**
```
sex from behind, standing sex, bent forward, penetration
```
- 男が消えやすい。`(1boy:1.2)` 強め指定要

**Spooning（朝スプーニング）**
```
spooning, sex from behind, lying on side, penetration, arm around waist, half-asleep
```
- 雰囲気◎。男が映りにくい構図

**Lap sex（向かい合い座位）**
```
lap sex, sitting face to face, straddle, arms around neck, penetration
```

**SVAB（サイドビュードッグスタイル）**
```
SVAB, sex from behind, doggy style, side view, on all fours, penetration
```
+ `<lora:SideView_Doggystyle_SVAB:0.8>`

---

### ★ 難しい・要工夫

**立ちバック・立ちセックス系**
- 男が消えやすい。BREAK後に `1boy` 再記載必須

**Piledriver / 難体位**
- LoRAなしだと崩れる。体位LoRA使用推奨

**窓際/ガラス越し**
- キャラが窓の外に出てしまう。基本封印

---

## 衣装カタログ

### 成功率高い衣装

| 衣装 | プロンプト例 | コツ |
|---|---|---|
| メイド服 | `maid outfit, white apron, black dress, maid headdress, black thighhighs` | くろえの緑とマッチする |
| 猫耳 | `cat ears, black collar with bell, cat tail` | 首輪の鈴がちゃんと出る |
| 制服（セーラー） | `sailor uniform, white sailor collar, navy blue skirt, skirt lifted` | 教室背景と相性良 |
| バニーガール | `bunny ears, black leotard, fishnet pantyhose, leotard pulled aside` | ネオン背景と相性良 |
| 体操服 | `gym uniform, white shirt, dark bloomers, bloomers pulled down` | 教室背景と相性良 |
| 浴衣 | `pink floral yukata, obi loosened, yukata opened` | 夏祭り背景◎。男も yukata 指定必須 |
| 下着のみ | `white lace bra, white lace panties, lingerie` | ソロ撮り向き |
| ニーソのみ | `nude, white thighhighs, thigh-high socks only` | `on ear` 系装飾と干渉注意 |

### 衣装の色問題
- くろえの `emerald green inner color` が衣装色に漏れる傾向
- 衣装色を明示しないと緑になる（メイドの黒→緑、浴衣のピンク→緑 等）
- 男の衣装も明示必要（しないと全裸になることある）

---

## 表情タグカタログ

| タグ | 場面 |
|---|---|
| `flushed face, soft blush, parted lips, half-closed eyes` | 基本の良い表情 |
| `teary eyes, embarrassed, hand over mouth` | 羞恥・コスチューム系 |
| `looking back over shoulder, biting lip` | ドッグスタイル・見返り |
| `loving gaze, soft smile` | ロマンチック系 |
| `ohogao, puckered lips, rolling eyes, tongue out` | 強め快楽（Ohogao LoRA推奨、好み分かれる） |
| `satisfied, dazed, blank stare, exhausted` | 事後系 |
| `half-asleep, drowsy, eyes barely open` | 朝・スプーニング系 |
| `conflicted expression, biting lip, teary, head turned` | 悔しいけど感じてる |
| `pleading expression, pout, teary, hands clasped` | おねだり系 |
| `panting, out of breath, sweat` | 運動後・激しい場面 |

---

## 背景・設定カタログ

### 屋内

| 設定 | タグ例 | 備考 |
|---|---|---|
| 寝室（夜） | `bedroom, white sheets, warm lamp light, night` | 万能。基本設定 |
| 寝室（朝） | `bedroom, morning light, sunlight through curtains, cozy` | スプーニング系◎ |
| 教室（放課後） | `classroom, wooden desks, afternoon sunlight, chalkboard` | 制服・体操服と相性良 |
| 図書館 | `library, tall bookshelves, dim warm light` | bokeh必須 |
| 教師オフィス | `teacher office, desk lamp, golden evening light, bookshelves` | |
| 和室 | `tatami room, futon, shoji screen, moonlight` | 縁側に雨が入ることあり注意 |
| 温泉 | `outdoor onsen, hot spring, steam, rocks, bamboo fence, night` | 抱擁系◎ |
| バスルーム | `bathroom, bathtub, steam, candlelight` | 濡れ肌系◎ |
| ナイトクラブ | `nightclub, dark room, neon lights, purple atmosphere` | バニー系◎ |
| ファンタジー室 | `stone walls, magic glowing orbs, candles, amber light` | emeraldが宝石化しやすい注意 |

### 屋外

| 設定 | タグ例 | 備考 |
|---|---|---|
| 夏祭り | `summer festival, night, paper lanterns, fireworks` | 男が全裸にならないよう服指定必須 |
| プールサイド | `outdoor pool, blue water, summer, bright sunlight` | 水着系 |
| 草原（昼） | `outdoor, grass, summer afternoon, dappled sunlight` | 男が消えやすい |
| 星空 | `night, starry sky, milky way, moonlight, grass` | 男が特に消えやすい |

---

## 汗ばみ・濡れ肌テクニック

肌の塗りが引き立つ。スポーツ・夏・温泉系に有効:
```
sweaty skin, glistening skin, sweat drops, sweat on forehead
```

濡れ肌（温泉・シャワー・プール）:
```
wet skin, wet hair, dripping water
```

---

## 背景ぼかし（常用推奨）

```
bokeh, depth of field, blurred background
```
主役が引き立ち、背景の崩れが目立ちにくくなる

---

## 既知の問題まとめ

| 問題 | 対策 |
|---|---|
| 男の髪が緑になる | `(1boy, black hair:1.3)` 強め指定（完全解決未了） |
| 男が消える | `(1boy:1.2)` + BREAK後にも `1boy` 再記載 |
| 服色が緑になる | 色を明示（`white shirt`, `black dress` 等） |
| 男が全裸になる | 服の説明を詳しく書く（`black yukata` だけでなく具体的に） |
| 乳首光る | `shiny nipples, highlighted nipples` をネガに追加 |
| 体に宝石が出る | ネガに `body gem, chest jewelry` 追加 |
| 窓際で外に出る | 窓際シーンは避ける（鬼門） |
| 胸の描写が崩れる | `open blouse` 系は画角に注意、`looking back over shoulder` で回避 |
