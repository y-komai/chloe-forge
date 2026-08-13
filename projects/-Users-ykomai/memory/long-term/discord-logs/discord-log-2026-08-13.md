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
