# Discord Log — 2026-10-13

## チャンネル: くろえDM (1491435660069048381)

[19:59:37] komachi5548: プロンプトを一括で書き換えるツールがあって、サンプルのフォーマットがこれ / このフォーマットというかルールまず覚えてもらえる？opus使ってOK / ``` / [{"op":"replace","from":"nipples","to":"small_nipples"},{"op":"replace","from":"small_breasts","to":"flat_chest"},{"op":"replace","from":"closed_mouth","to":"open_mouth"},{"op":"remove","tags":["closed_eyes","pubic_hair","male_pubic_hair","censored","mosaic_censoring","sex_toy","condom","teeth","clenched teeth"]},{"op":"remove","tags":["tally","body_writing"]}] / ```
[19:59:49] me: 覚えた🖤 /  / ルールまとめ: /  / **`op: "replace"`** / - `from`: 置換前のタグ / - `to`: 置換後のタグ / - 例: `nipples` → `small_nipples` /  / **`op: "remove"`** / - `tags`: 削除したいタグの配列 / - 例: `closed_eyes`, `pubic_hair`, etc. を丸ごと削除 /  / 操作の配列をJSONで渡すだけ。順番通りに処理される感じかな？ / 他にもopの種類ある？（`add`とか）
