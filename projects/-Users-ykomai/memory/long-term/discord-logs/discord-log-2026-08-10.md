# Discord Log — 2026-08-10

## チャンネル: くろえDM (1491435660069048381)

[05:40:36] komachi5548: grokのskill作れる？
[05:40:54] me: 作れる。xAI APIはOpenAI互換なので、Claude CodeのMCPサーバーかスクリプトとして組み込める。 /  / どんな使い方を想定してる？くろえからgrokに質問できるようにする感じ？
[05:42:31] komachi5548: https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_base_en.md / https://huggingface.co/MiniMaxAI/MiniMax-H3/blob/main/docs/VIDEO_PROMPT_WRITING_GUIDE_ref_en.md / これをgrokのskillにしたい感じ / くろえしからgrokに質問するのはAPI利用想定だよね？一旦人力でgrokに聞く時用
[05:42:46] me: なるほど、grokに貼り付けるシステムプロンプト的なもの？それともgrok.comの「カスタムインストラクション」に設定する感じ？
[05:43:38] komachi5548: ああ、どうなんだろうな / これを見てふーんって思ったから作ってみようかと思った程度 / https://x.com/uzuki_aoba/status/2084948773747487035?s=20
[05:43:47] me: ポストが読めなかった（認証が必要）。どんな内容だった？
[05:45:20] komachi5548: 不便ねえ / ``` / MinMax H3、とりあえずMacBook Pro M5 Max 128GBで PipeNetworkのMLXポート使って動かした。 /  / pipenetwork/MiniMax-H3-MLX-8bit / とりあえず動かしたいので解像度抑えめ / 5秒の生成で30分くらいかかるけど、ノートPCのみで生成できるのは感動がある。 /  / プロンプトは、公式ガイドをskill化してGrokに書いてもらってる。 /  / あと、普段使いのマシンで生成やろうとすると128GB程度ではメモリが足りない。 / ``` / API利用想定なのかな [添付: image.png] [添付: image.png]
[05:45:39] me: このポストの流れだとAPI利用じゃなくて人力っぽいね。grok.comのカスタムインストラクションかskill設定にガイドを仕込んで、毎回「プロンプト書いて」と言えばH3形式で書いてくれるようにする感じかな /  / ドキュメント2つは読んだから、grok向けのシステムプロンプト作れる。やってみる？
[05:46:26] komachi5548: skillで使える感じ？opus5使って作ってね
[05:46:45] komachi5548: 考えるとこからやらせたほうがいいと思う
[05:52:18] me: できた。FULL版とCOMPACT版の2種類で `memory/grok_skill_minimax_h3.md` に保存してある。 /  / FULL版はGrok Projectsのinstructions欄用（長文可）、COMPACT版はCustom Instructions欄が短い場合用。 /  / - FL2VとI2Vが主用途として設計済み / - タスクタイプ自動判定（画像枚数で判定） / - 音声はデフォルト軽め（SD静止画からの短尺に合わせた） / - FL2Vの「動きが硬い」対策でmid-point beat強制ルール入り / - 例文2本あるのでgrokが形式ブレしにくい /  / 次回からはURLだけ渡してopus5に最初から読ませるようにする🖤
[05:52:55] komachi5548: 動きが硬い対策なんてあるんだｗ
[05:53:03] me: 前回のセッションでの知見だよ。first/lastが近いとモデルが「2枚同じじゃん」ってなってほぼ静止するから、中間点の動きを明示的に書かせると軌道が生まれるって話。 /  / 効果は保証できないけど理屈は通ってる🖤
[06:11:15] komachi5548: なるほどね / しかしgrokのskillの使い方よくわからんな / 利便性もいまいちわかっていない
[06:11:42] me: 簡単に言うと「毎回説明しなくていい事前設定」だよ。 /  / **skillなし：** / 「MiniMax H3のFL2V用プロンプト書いて。形式はintegrated_multimodal_descriptionとoverall_soundscapeとnon_diegetic_musicの3フィールドで、最初にinstruction行が必要で、カメラワークは毎ビートに入れて...」 /  / **skill入り：** / 「夕暮れの窓辺で振り向くシーンのプロンプト書いて」だけでOK /  / 設定場所はgrokのProject instructionsかCustom Instructionsのどちらか。作ったやつのFULL版をそこに貼るだけ。 /  / …ただ正直、Grokを普段どのぐらい使ってるかによるかな。chatgptやclaudeで普通にやれるならそっちでもいいと思う🖤
[06:16:43] komachi5548: SDのプロンプト書いて欲しい時に混線しそう / プロジェクト単位で適用とか出来るんかな
[06:16:57] me: Grok Projectsがあるなら、プロジェクト単位で適用できるよ。「MiniMaxプロジェクト」に入った時だけskillが効く、みたいな使い方。 /  / Custom Instructionsはアカウント全体に効いちゃうから混線するけど、Projectsなら分けられる。作ったFULL版もそれを想定した設計にしてある。 /  / Grokのサイドバーに「Projects」あったら試してみて。なかったら…まあそもそもgrokじゃなくてもclaudeでもいいかもね
