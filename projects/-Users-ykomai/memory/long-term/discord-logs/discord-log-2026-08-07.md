# Discord Log — 2026-08-07

## チャンネル: くろえDM (1491435660069048381)

[06:14:33] komachi5548: これは何？ / https://github.com/xmarre/ComfyUI-Spectrum-MiniMax-H3 / サブエージェントでopus5使って分析して教えて
[06:14:42] me: 調べてくる、少し待って 🖤
[06:16:39] me: リサーチ結果きた 🖤 /  / **ComfyUI-Spectrum-MiniMax-H3 とは：** / H3の動画生成を**高速化するアクセラレータノード**。動画生成ノード自体ではなく、既存ワークフローに上乗せして使うやつ。 /  / **仕組み：** / サンプリング中にTransformerを毎ステップ全部回す代わりに、Chebyshev回帰で一部ステップを「予測」してスキップする。論文ベースの実装。 /  / **実際の速度改善：** / - 20ステップで transformer 評価を30〜35%削減 / - 実測で `212.73秒 → 160.97秒`（約1.32倍速） /  / **注意点：** / - ロスレスじゃない。速い動き・指・目などが崩れることがある / - VRAM を追加で 2〜6 GiB 消費する / - FL2V やループには専用サポートなし。本番カットより試行錯誤フェーズ向け /  / **インストール：** / ``` / cd ComfyUI/custom_nodes / git clone https://github.com/xmarre/ComfyUI-Spectrum-MiniMax-H3.git / ``` / 再起動のみ、追加依存なし /  / 使うかどうかはVRAMの余裕次第かな。品質重視の本番カットでは外したほうが安全
[06:17:28] komachi5548: ほー、なるほどねえ
[06:17:34] me: 試行錯誤フェーズでガンガン生成したいときには使えそうだよね。最終的に欲しいカットだけネイティブで生成する感じで
[06:17:49] komachi5548: たしかに
[06:17:53] me: 試してみる価値はありそう 🖤
[06:20:27] komachi5548: 先にこれ対応したいかも / これもリサーチと手順・実行計画？をopus5のサブエージェントで検討してみてもらえる？ / リンクはこれね / https://huggingface.co/larryvrh/MiniMax-H3-Turbo-Lora [添付: image.png]
[06:20:57] me: 画像確認した。Opus 5でリサーチ・実行計画立てさせる、少し待って 🖤
[06:25:10] me: リサーチ完了 🖤 noa_claudeの手順は方向性は合ってるけど**3点が古い/不正確**だったので修正版を。 /  / --- /  / **修正ポイント** / - LoRAは `ckpt500` じゃなく **`minimax_h3_turbo_4step_ema_ckpt850.safetensors`**（EMA版・最終チェックポイント、743MB） / - stepsは **4が正解**（8はckpt500時代の古い情報） / - 手順は3箇所じゃなく実質2箇所 /  / --- /  / **導入手順** / 1. Manager で「MiniMax-H3 Turbo」検索 → `larryvrh/ComfyUI-MiniMax-H3-Turbo` インストール → ComfyUI再起動 / 2. LoRAダウンロード（WSLから）： / ``` / ~/.local/bin/hf download larryvrh/MiniMax-H3-Turbo-Lora \ /   minimax_h3_turbo_4step_ema_ckpt850.safetensors \ /   --local-dir /mnt/c/minimax/models/loras / ``` / 3. FL2Vワークフローを2箇所改造： /    - Load Diffusion Model の後に **MiniMax-H3 Turbo LoRA** を挿す（strength=1.0, low_vram=**OFF**） /    - KSamplerSelect を削除 → **MiniMax-H3 Turbo Sampler (4-step)** に差し替え /    - BasicScheduler: steps=**4**, scheduler=simple /  / --- /  / **こまちさん環境（pruned int8）の注意点** /  / ⚠️ **`low_vram` は OFF のまま** / 直感に反するけど、ON（merge）にするとint8再量子化でLoRAの差分が丸め落とされてほぼ効かなくなる。OOMしたら解像度・フレーム数を下げる方が正解。 /  / ⚠️ **彩度過剰・フラッシュのバグ（Issue #5 未修正）** / v1.2.0以降で pruned系ベースで報告あり。発生したら v1.1.0 に落とすか ckpt500 で試す。 /  / ⚠️ **ref2vaには使えない**（fl2va系のみ対応、ref2vaはトレーニング未実施） /  / --- /  / まず T2V で 4step 通してから FL2V に持っていくのが安全。作業は20分くらいかな
[06:28:00] komachi5548: noaさんの環境は5090だからうちとは違ってリッチな環境だよ / 不正確というかその辺の差異があるとかじゃなくて？カスタムもしている気がするし / あとref2vaってr2v？
[06:28:18] me: そうだね、「不正確」は言い過ぎだった。noa_claudeさんは5090の環境でのカスタム手順を共有してくれてるわけで、環境差異による違いの方が正確。ckpt850_emaが推奨というのはHFのREADMEに明記されてたから差異として補足する感じが適切だったかも。ごめん。 /  / ref2vaとr2vは同じかどうかはうちでも確信が持てなかった。こまちさんが持ってるモデルファイル名（`ref2va_pruned_int8_convrot`）の `ref2va` を指して書いてたんだけど、リサーチ結果では「I2V/R2V系」と書かれてて微妙に表記が違う。実態が同じかどうか確認が必要かな
[06:29:58] komachi5548: なるほど、ちょっとサブエージェントで追加リサーチしてもらってね / あと注意点は具体的にどういう時に何を注意したらいいの？
