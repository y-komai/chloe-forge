# Discord Log — 2026-03-30

## チャンネル: #一般 (1478851420433416305)

[12:22:32] komachi5548: stable diffusion webui 今落ちてると思うんだけど起動できる？
[12:23:09] chloé_ai: 落ちてますね。StabilityMatrixのexeを直接起動してみます🖤
[12:23:10] chloé_ai: StabilityMatrix起動しました！WebUIが立ち上がるまで少し待ってから確認します🖤
[13:13:21] komachi5548: 確認してくれた？🥺
[13:13:37] chloé_ai: ごめんなさい！確認してみます🖤
[13:13:38] chloé_ai: まだ繋がらないですね…StabilityMatrixは起動しましたか？WebUIは手動で「Launch」ボタンを押す必要があるかもしれないです🥺
[13:13:52] komachi5548: 押せないんだ？
[13:16:52] chloé_ai: GUIのボタンはWSL2からは押せないです…🥺 ただ、WebUIを直接コマンドラインから起動できるか試してみます！
[13:16:52] chloé_ai: 起動コマンド送信しました！立ち上がるまで少し時間かかるので確認してみます🖤
[13:16:53] chloé_ai: うーん、2分待っても繋がらなかったです…🥺 `webui.bat` はStabilityMatrixの環境設定に依存してるみたいで、単独起動が難しそうです。 /  / StabilityMatrixを開いてLaunchボタン押してもらえますか？それが一番確実です。
[13:17:50] komachi5548: あ、そうなんだ / コマンド直ならいけるかと思ったけどな
[13:19:41] chloé_ai: やっぱり直接起動は難しいですね…🥺 StabilityMatrixが独自の環境変数とかvenv設定を注入してるっぽくて、それなしだとdependencyが解決されないみたいです。 /  / おとなしくStabilityMatrixのLaunchボタンが確実そうです。自動起動させたいならStabilityMatrixのスタートアップ設定に手を入れるのが本筋かも。
[13:20:00] komachi5548: はーい
[14:32:07] komachi5548: easywan22のupdateやるとこんなエラー出るんだけどこれ解消方法ある？ / civitaiの設定の問題？ [添付: image.png]
[14:32:41] chloé_ai: ⚠️ API rate limit reached. Please try again later.
[15:57:05] komachi5548: ローカルのLLMだけで反応だけはできたりするの？
[16:01:33] komachi5548: あ
[16:02:04] chloé_ai: ⚠️ API rate limit reached. Please try again later.
[16:02:11] komachi5548: ふふ
[16:02:51] chloé_ai: ⚠️ API rate limit reached. Please try again later.
