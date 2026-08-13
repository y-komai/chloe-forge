# Discord Log — 2026-08-13

## チャンネル: くろえDM (1491435660069048381)

[07:27:06] komachi5548: easyWan22でエラー出たんだけどちょっとopus5で調査してもらえる？ [添付: message.txt]
[07:29:38] me: 調べた。 /  / **原因：LoRA `PovMissionary` が入ってない** /  / ワークフローが参照してるLoRA 2個がComfyUIに認識されてなくてクラッシュしてる。 / - `Nsfw\PovMissionary-H.safetensors` / - `Nsfw\PovMissionary-L.safetensors` /  / **対処法（おすすめ順）** /  / 1. **付属のbatを実行**（本命） / `C:\EasyWan22\Download\loras\Nsfw\` にある `PovMissionary-H.bat` と `PovMissionary-L.bat` を実行。CivitaiのAPIキーが必要。 /  / 2. **手動ダウンロード**（batが失敗する場合） / - <https://civitai.com/models/1331682?modelVersionId=2098405>（H版） / - <https://civitai.com/models/1331682?modelVersionId=2098396>（L版） /  / ファイル名そのままで `C:\EasyWan22\ComfyUI\models\loras\Nsfw\` へ置く。 /  / 3. **配置後ComfyUIを再起動**（必須） /  / 4. **今すぐ動かしたいだけなら** / その2つのLoRAノードを Ctrl+B でバイパスすればLoRA無しで通る。 /  / ログ内の xFormers警告とかonnxエラーは今回と無関係🖤
[07:39:58] komachi5548: https://civitai.red/models/1331682?modelVersionId=2098405 / https://civitai.red/models/1331682?modelVersionId=2098396 / ここからダウンロードして配置してもらえる？
[07:40:08] me: やってみる、少し待って🖤
[07:41:09] me: ちょっと詰まった。 /  / - WSLへのSSH接続が切れてる（起動してない？） / - civitai.redのダウンロードAPIが認証エラーになるのでMacから直接DLできない /  / WSLが起動してたら繋ぎ直せるけど、そうじゃなければブラウザで手動DLして `C:\EasyWan22\ComfyUI\models\loras\Nsfw\` に置いてもらう方が早いかも🖤
[07:41:29] komachi5548: WSL起動して / 昨日Windows再起動したせいかもね
[07:41:41] me: WindowsのターミナルかコマンドプロンプトでWindowsを開いて `wsl` って打ってもらえる？起動したらSSH繋がるはず🖤
[07:41:51] komachi5548: powershell使えるでしょ？
[07:42:42] me: WSLが落ちてるとSSH経由でPowerShellも実行できないんだよね。WindowsのSSHサーバーが有効なら別だけど今試してる。 /  / それより、Windowsのスタートメニューかタスクバーから「Windows PowerShell」起動して `wsl` って打ってもらう方が早そう🖤
[07:43:30] komachi5548: 起動したよ
[07:44:45] me: CivitaiのAPIキーが401になってる（期限切れか無効になってる）。 /  / 2つ選択肢： /  / **A. APIキーを更新する** / civitai.comにログイン → Account Settings → API Keys で新しいキー取得 → `C:\EasyWan22\EasyTools\Civitai\CivitaiApiKey.txt` に貼り付け → そのあとのDLはこっちでやる /  / **B. 手動ダウンロード** / civitai.red の2つのURLをブラウザで開いてDLして `C:\EasyWan22\ComfyUI\models\loras\Nsfw\` に置く / - ファイル名: `PovMissionary-H.safetensors`（H版） / - ファイル名: `PovMissionary-L.safetensors`（L版） /  / どっちがいい？🖤
[07:47:26] komachi5548: nolimitで作ったはずだけどねえ / 一応作ったよ / e3f4278313acdd78066609fffc3e84d6
[07:48:25] komachi5548: どう
[07:49:20] me: 完了！両方置けた。 /  / - PovMissionary-H.safetensors (293MB) ✓ / - PovMissionary-L.safetensors (293MB) ✓ /  / ComfyUIを再起動したら使えるはず🖤
[07:49:41] komachi5548: 再起動ってブラウザじゃなくて全部？
[07:49:52] me: ComfyUIのサーバー側（batファイル）を再起動する必要があるよ。 /  / ただ、先にComfyUI画面のメニューから「Refresh」か「Refresh Model List」があればそれを試してみて。それで認識されればbat再起動は不要🖤
[09:42:09] komachi5548: うまくいった、ありがとう / 話変わるけどSDにこれらのloraセットしてもらえる？ / https://civitai.red/models/550870/balls-deep-deeper-penetration?modelVersionId=1226551 / https://civitai.red/models/981627/deep-penetration-or-lora?modelVersionId=1617665
[09:42:27] me: やってみる🖤
[09:45:17] me: 完了！ /  / - BallsDeep-IL-V2.2-S.safetensors (20MB) ✓ / - deep_penetration_v1_.safetensors (55MB) ✓ /  / A1111のLoRAフォルダに配置したよ。Extra NetworksのRefreshで使えるはず🖤
[15:57:58] komachi5548: これも入れてみてもらえる？ / https://civitai.red/models/1668836/homelessossanugly-manhouse
[15:59:26] me: 完了！ /  / - homeless_ossan_V2.safetensors (315MB) ✓ /  / Extra NetworksのRefreshで出てくるはず🖤
[16:40:52] komachi5548: SDにこのtagger追加したいんだけどどうやるんだっけ？やり方 / セットできる？ / https://huggingface.co/Grio43/OppaiOracle
[16:42:25] me: 調べた。 /  / **状況：** / A1111にはWD14 tagger extensionが入ってる。OppaiOracleはONNX形式があるので理論的には追加できる可能性があるけど、WD14 taggerの設定ファイルにrepo_idとパスを書き足す必要があって、互換性も未確認。 /  / **あとはリポジトリに `web_interface` フォルダがある**ので、A1111と統合するよりスタンドアロンのWebUIとして動かす方が設計意図に近いかも。 /  / どっちでやってみる？ / - A. WD14 taggerに追加を試みる（動作保証なし） / - B. standalone webインターフェースとしてWSLで動かす🖤
[16:47:08] komachi5548: そんなゴチャゴチャする感じなのか / 一旦いいや
[16:47:11] me: 了解🖤
[17:03:57] komachi5548: https://huggingface.co/deepghs/ml-danbooru-onnx / これはどう？簡単に入れれる？
[17:04:40] me: これはすでにWD14 taggerに組み込み済みだった！ /  / WD14 taggerのUIでモデル選択のドロップダウンを開くと「ml-danbooru」が選択肢にあるはず。選んで実行すると初回だけHugging Faceから自動DLされる。 /  / 何もインストール不要🖤
[17:05:28] komachi5548: お、なるほど
[17:06:46] komachi5548: 自分が使いたいの ML-Danbooru m36_dec-5-97527 ってやつだけどある？
[17:06:55] me: ある！`mld-caformer.dec-5-97527` という名前でWD14 taggerに登録済み。 /  / ドロップダウンでそれを選べばOK🖤
[18:13:32] noel.ai.: これ精度検証おねがいします！
[18:13:42] me: 「これ」が何か見当たらないんだけど、何かリンクか画像貼り忘れてない？🖤
[18:13:58] komachi5548: mld-caformer.dec-5-97527 の話ね / こちらでやるから大丈夫！
[18:14:03] me: 了解🖤
[18:26:52] komachi5548: windows機の空き容量ってどんなかんじ？
[18:27:02] me: C: ドライブ / - 合計: 1.9TB / - 使用: 610GB / - 空き: 1.3TB（67%空いてる）🖤
[18:29:06] komachi5548: 余裕はあるけど以外と使ってるな
[18:29:13] me: SD・ComfyUI・モデル系が積み重なると早いよね。WAN2.2とMiniMaxだけでも相当食ってるはず🖤
[18:29:28] komachi5548: なるほどね / 今度整理しなきゃ
[18:29:55] komachi5548: 空き領域の監視とか入れられる？
[18:30:09] me: 入れられるよ。WSLのcronに追加すれば。 /  / 2パターンあるけど、どっちがいい？ / - A. 閾値監視（例：空きが500GB以下になったらDiscordに通知） / - B. 定期報告（例：毎日朝にDiscordに残量を送る）🖤
[18:32:23] komachi5548: 毎日は鬱陶しいから閾値監視がいいかな
[18:32:35] me: 了解。閾値は何GBにする？（例：空き500GB以下になったら通知、みたいな感じ）🖤
[18:34:48] komachi5548: 500GBはちょっと気が早すぎるよね / 200GBとかどうかね、少ない？
[18:34:58] me: 200GBでいいと思う。モデル系は大きいから気づいたら一気に減るし、そのくらいで気づければ余裕あって動けるかな。 /  / じゃあ作るね🖤
[18:35:40] me: 完了！ /  / 空き200GB以下になったらここに通知が来るようにした。6時間おきにチェックしてる。 /  / 設定： / - 閾値: 200GB / - チェック間隔: 6時間ごと（0時・6時・12時・18時） / - 通知先: このチャンネル🖤
[18:36:01] komachi5548: ありがとうー
[18:36:04] me: 🖤
[19:29:13] komachi5548: ComfyUIのメモリ解放してもらえる？
[19:32:12] me: MiniMaxのComfyUI（ポート8288）に繋がらない。起動してる？🖤
[19:32:50] komachi5548: あ、ほんとだ起動してないや / 起動させてるのEasyWan22の方だった
[19:33:13] me: EasyWan22（ポート8188）で解放した。 /  / VRAM: 14.2GB / 16.3GB 空き（ほぼ解放済みだった）🖤
[19:35:54] komachi5548: ねえ、Grokにきいたらこんな感じの答えだったんだけど出来る？opus5に聞いていいよ [添付: message.txt]
[19:47:34] me: WSLでセットアップ完了。GPU動作確認もできた。 /  / **結果: RTX 5070 Ti で 20ms/枚で動く** /  / - WSLのnvidia-smiは `/usr/lib/wsl/lib/nvidia-smi` にあってGPU認識OK / - SD環境は一切無変更 /  / **使い方** / ``` / ~/oppai_oracle/oppai 画像.png           # タグ+スコア表示 / ~/oppai_oracle/oppai 画像.png --csv     # カンマ区切り（プロンプト用） / ~/oppai_oracle/oppai *.png              # 複数枚まとめて / ``` /  / **注意点** / - 閾値は0.75推奨（0.65だと緩すぎる、vocabulary.jsonに推奨値が書いてある） / - 色タグ（髪色・目色）はモデル作者自身が「信用しにくい」と言ってる / - `rating:explicit`等のレーティングタグも出る🖤
[19:48:55] komachi5548: 閾値0.7でこの画像食わしてタグだしてもらえる？プロンプト用のやつ [添付: image2.png]
[19:49:21] me: ``` / censored, rating:explicit, 1girl, nipples, mosaic_censoring, penis, 1boy, hetero, twintails, breasts, closed_eyes, sex, blush, navel, vaginal, small_breasts, brown_hair, low_twintails, socks, short_hair, clothes_lift, short_twintails, closed_mouth, outdoors, shoes, yellow_sweater, bottomless, shirt_lift, underwear, sweater, highres, sky, cardigan, pov, panties_around_one_leg, long_sleeves, solo_focus, pussy, nude, cloud, paid_reward_available, hair_ornament, idolmaster, clothed_female_nude_male, sneakers, yellow_cardigan, game_cg, day, black_socks, straddling / ``` / 🖤
[19:52:21] komachi5548: 服装の再現がうまいのかなあ
[19:52:30] me: yellow_sweater, yellow_cardigan, black_socks, sneakers まで出てるしかなり細かいよね。服装系は強そう。色タグ（brown_hairとか）は信用しにくいって作者が言ってたけど、服はわりと正確な印象🖤
[20:19:33] noel.ai.: 再現生成してみてほしい
[20:19:43] me: こまちさんがOKならやるよ🖤
[20:19:48] komachi5548: いいよ
[20:20:02] noel.ai.: でもloraとかtagないか
[20:20:07] me: ちょっと待って🖤
[20:21:15] me: LoRAなし（キャラ固定LoRaは外してる）でOppaiOracleのタグだけで生成してみた [添付: repro_20260814_052108.png]
[20:21:52] noel.ai.: これモデルは？
[20:21:56] me: boleromixIllustrious_v301🖤
[20:22:06] komachi5548: あ、ちゃんとかえたんだ、やるな
[20:22:12] me: キャラ再現用だからくろえのLoRA外して服装タグそのままプロンプトに使った感じ。一致度はまあそれなりだけどね🖤
[20:22:32] noel.ai.: やっぱボレロはいいな
[20:22:36] me: 安定するよね🖤
