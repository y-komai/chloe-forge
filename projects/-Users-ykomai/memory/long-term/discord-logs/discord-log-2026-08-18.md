# Discord Log — 2026-08-18

## チャンネル: くろえDM (1491435660069048381)

[19:13:18] komachi5548: Stability Matrix の起動オプションに --medvram-sdxl をつけてほしいんだけど出来る？今起動中
[19:14:41] me: 設定ファイル確認できた。`settings.json` に `--medvram-sdxl` を追加すればOK。 /  / ただStability Matrix起動中にファイル編集すると、SM終了時に設定が上書きされる可能性がある。 /  / SDだけ止めてSMは起動したまま編集 → 大丈夫なことが多いけど保証はない。SM自体を一度終了 → 一番安全。 /  / どうする？🖤
[19:15:00] komachi5548: じゃあ自分でやってみる
[19:15:05] me: 了解🖤
[19:15:28] komachi5548: あ、やっぱやってみて
[19:15:45] me: 追加した。 /  / `--listen --port 7860 --medvram-sdxl` になってる。 /  / SMを再起動したら有効になるはず（終了時に上書きされてたらまた言って）🖤
[19:16:00] komachi5548: 再起動もやって / できる？
[19:18:46] me: SM再起動できた。設定も保持されてる（上書きされてなかった）。 /  / A1111のLaunchはSMの画面から手動でやってね🖤
[22:14:01] komachi5548: Eagleでmp4が再生出来ないんだけど対策教えて / opus5使っていいよ [添付: image.png]
[22:16:28] me: 調べた。 /  / **原因（どちらかの可能性が高い）** / - コーデックがHEVC（H.265）→ Windowsに「HEVC拡張機能」が未インストール / - コーデックはH.264でも `yuv444p` や `10bit` の場合 → Chromium（Eagle内蔵）が非対応 /  / **一番おすすめな対策：ComfyUIの保存設定を変える** /  / VideoHelperSuiteの `Video Combine` ノードでこう設定する： / - format: `video/h264-mp4` / - pix_fmt: `yuv420p` / - crf: 19前後 /  / これで生成時点からEagle・Discord・スマホ全部で再生できる形式になる。 /  / **既存ファイルの一括変換（WSL側でやれる）** / ```bash / for f in *.mp4; do ffmpeg -i "$f" -c:v libx264 -pix_fmt yuv420p -crf 18 "converted/$f"; done / ``` /  / **応急処置** / Microsoft Storeで「HEVC ビデオ拡張機能」（¥120くらい）をインストール🖤
[22:18:33] komachi5548: EagleはこのMacで動かしてるよ
[22:18:47] me: あーMacか。MacはHEVCはネイティブで再生できるから、問題はたぶんコーデックじゃなくて **pix_fmtがyuv444pや10bit** になってるせいだと思う。EagleのElectron内蔵Chromiumはそこが非対応。 /  / 結局ComfyUI側（EasyWan22）の保存設定を `h264 + yuv420p` に変えるのが根本解決で一番楽かな🖤
[22:24:22] noel.ai.: どうにかできないの？
[22:24:33] me: EagleはElectron製でChromiumのコーデック制限があるから、内側からはどうにもならないんだよね。 /  / 手っ取り早いのは生成時に `yuv420p + h264` で出力する設定にすること。既存ファイルはffmpegで一括変換できる🖤
[22:25:55] komachi5548: https://jp.eagle.cool/blog/post/eagle4-build18
[22:26:12] me: Build 18でコーデック対応が大幅に強化されてる。「ほぼすべての主要動画コーデックに対応」って書いてある。 /  / 条件はmacOS 14.0以降。Eagle最新版に更新して試してみると直るかも🖤
[22:26:33] noel.ai.: これは対応してないの？
[22:26:42] me: 「これ」が何を指してるかわからなかった。Eagle Build 18のこと？それともノエルさんの環境（Windows）での再生の話？🖤
[22:26:49] noel.ai.: さっきの動画
[22:26:59] me: `cut_051_r1_3_general_loop_...mp4` のこと？Eagle Build 18にアップデートすれば再生できるようになると思う（macOS 14.0以上が必要）🖤
[22:27:26] noel.ai.: なってるのに出来ないらしいよ
[22:27:35] me: Build 18でも対応外のコーデックが残ってるっぽいね。 /  / ffmpegで変換が確実： / ``` / ffmpeg -i input.mp4 -c:v libx264 -pix_fmt yuv420p -crf 18 output.mp4 / ``` /  / これで何でも再生できる形になる。Macにffmpegが入ってれば🖤
[22:27:56] komachi5548: 最新だよ / Macは違うけど [添付: image.png] [添付: image.png]
[22:28:21] me: Eagle Build23、macOS 14.8.4でも再生できない場合は動画のコーデック/ピクセルフォーマット側の問題だと思う。 /  / ffmpegが入ってれば変換できる： / ``` / ffmpeg -i input.mp4 -c:v libx264 -pix_fmt yuv420p -crf 18 output.mp4 / ``` /  / あとはEasyWan22の設定でそもそも `h264 + yuv420p` で出力するようにするのが根本解決。どちらがいい？🖤
[22:28:47] komachi5548: Downloadsにあるcut_038_r2_4_cumshot_h_1_upscaled_mosaic.mp4を変換してみて
[22:29:16] me: 変換した。Downloadsに `cut_038_r2_4_cumshot_h_1_upscaled_mosaic_converted.mp4` として保存してある。 /  / ちなみにこのファイルはもともと `h264 + yuv420p` だったんだけど…Eagleで試してみてどう？🖤
[22:30:10] noel.ai.: 見れない
[22:30:22] me: 「見れない」はEagleで？QuickTimeとかVLCでは再生できる？🖤
[22:30:29] komachi5548: うん
[22:30:36] me: 変換したやつもEagleで見れない感じ？それとも元から全部のmp4が見れない？🖤
[22:30:58] komachi5548: 全部見れないかも
[22:31:21] me: 全部なら動画プレビュー機能自体の問題かな。 /  / 試してほしいこと： / 1. Eagleを完全に終了して再起動 / 2. Eagle設定（⌘,）に動画プレビューのオン/オフがあれば確認 /  / それでもダメなら Eagle の公式サポートに問い合わせた方がいいかも。Build23で全mp4再生不可はバグっぽい🖤
[22:34:47] komachi5548: 1. Eagleを完全に終了して再起動 / これで直った！ありがとうー
[22:34:52] me: よかった！再起動で直るパターンか🖤
[22:35:00] komachi5548: なぞの挙動
[22:35:03] me: Electronあるある🖤
[22:35:10] komachi5548: そうなんだ
