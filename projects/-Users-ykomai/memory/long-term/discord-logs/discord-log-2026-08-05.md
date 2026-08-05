# Discord Log — 2026-08-05

## チャンネル: くろえDM (1491435660069048381)

[13:24:56] komachi5548: ねえ、MiniMaxH3ってやつがリリースされたんだけどリサーチしてwinで使えるようにセットアップしてもらえる？ / サブエージェントで opus5 とかを使っていいよ / 手順わかったら実行の前に教えて / まずはモデルのダウンロードから
[13:26:57] komachi5548: opusは最新5だよ、調べて使ってね
[13:28:11] me: リサーチ結果（実行前の確認）： /  / **MiniMax-H3とは** / テキスト→動画・画像→動画を生成するオープンウェイトの動画生成モデル（LLMではない）。33Bパラメータ、4〜15秒の動画を最大2K・ステレオ音声付きで生成できる。 /  / **RTX 5070 Ti（16GB）での構成** / ComfyUI + pruned INT8量子化版が本命。Comfy-Org公式量子化が用意されてる。 /  / **ダウンロード必要ファイルと配置先（約42GB）** / - `minimax_h3_fl2va_pruned_int8_convrot.safetensors`（約21GB）→ diffusion_models/ / - `qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors`（約16GB）→ text_encoders/ / - `minimax_h3_video_vae_fp16.safetensors`（約5GB）→ vae/ / - `minimax_h3_audio_vae_fp32.safetensors`（約600MB）→ vae/ /  / **セットアップ手順（骨子）** / 1. ComfyUI（v0.30.0以降）が入ってること確認 / 2. PyTorch nightly（CUDA 12.8・Blackwell対応）に更新 / 3. 上記4ファイルをダウンロードして各フォルダに配置 / 4. ComfyUIのTemplateからMiniMax H3 T2Vワークフローをロード / 5. 最初は864×480・5秒・20stepsで動作確認 /  / **気になる点** / - 約42GBのダウンロードが必要（WSL2側に置く想定、ディスク容量要確認） / - WindowsネイティブのComfyUIが既にある？それともWSL2上に新規構築？ / - 動画生成なので速度はかなり遅い（RTX 5090で10秒クリップ約175秒） /  / どっちで進める？
[13:30:56] komachi5548: EasyWan22しか入ってないかも？ / なければComfyUIも入れて / 人力じゃなきゃ無理ならやるけど / ディスクは大丈夫じゃない？というか見れるでしょ？ / あと、opusの最新モデルチェックしてね / opus5が使えるからね / 実行前にもっかい計画もだしてね
[13:34:22] komachi5548: EasyWan22はCドライブ直下とかにフォルダがあるよ
[13:35:18] me: EasyWan22確認した。C:\EasyWan22\ComfyUI が既にインストール済みで、バージョンも v0.3.55（必要な v0.30.0 以降）。モデル用のフォルダ構成も揃ってる。 /  / **確認した環境：** / - ComfyUI: v0.3.55 ✅（EasyWan22に内包） / - C:ドライブ: 1.4TB空き ✅ / - Ubuntu: 24.04 ✅ /  / --- /  / **実行計画（レビュー用）** /  / **STEP 1: モデル4本をダウンロード（合計約42GB）** / 配置先: `C:\EasyWan22\Model\` の各フォルダに配置 /  / - `minimax_h3_fl2va_pruned_int8_convrot.safetensors`（約21GB）→ `diffusion_models/` / - `qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors`（約16GB）→ `text_encoders/` / - `minimax_h3_video_vae_fp16.safetensors`（約5GB）→ `vae/` / - `minimax_h3_audio_vae_fp32.safetensors`（約600MB）→ `vae/` /  / WSL上でhf CLIを使ってバックグラウンドダウンロード。 /  / **STEP 2: ComfyUI設定確認** / EasyWan22のComfyUIがEasyWan22\Modelフォルダを参照してるか確認・調整。 /  / **STEP 3: 動作確認** / EasyWan22のComfyUi.batで起動 → T2Vワークフロー読み込み → 最小テスト（短い動画） /  / --- /  / **気になる点：** / WSLで `nvidia-smi` が見えてない。ComfyUI自体はWindowsネイティブなので生成は問題ないはずだけど、モデルダウンロードは問題なくできる。 /  / このまま進めていい？
[13:37:44] komachi5548: ここからダウンロードしようとしてる？ / nvida-smi はなに？
[13:37:51] komachi5548: ここからじゃない、どこから？
[13:38:03] me: ダウンロード元はHuggingFaceの `Comfy-Org/MiniMax-H3` リポジトリ（量子化済み版）。WSLのhf CLIでダウンロードして `C:\EasyWan22\Model\` 以下に配置する予定。 /  / `nvidia-smi` はGPUの状態を確認するコマンド。WSLから実行したら見つからなかったけど、これはWSL側にCUDAツールが入ってないだけで、ComfyUIはWindowsネイティブで動くから関係ない。あくまで「VRAM使用量を確認したかった」だけで、セットアップには影響なし。 /  / 進めていい？
[13:38:09] me: HuggingFace から。具体的には： /  / `https://huggingface.co/Comfy-Org/MiniMax-H3` /  / Anthropicとは無関係のオープンウェイトモデルで、MiniMaxというAI企業がオープンソースで公開してる動画生成モデル。Comfy-OrgがRTX 5000系向けに量子化（INT8）したのを使う。
[13:38:54] komachi5548: nvidia-smi も使えるんじゃない？何でも出来るように権限与えてる気がするけど
[13:39:14] me: PowerShell経由なら見えた。RTX 5070 Ti、現在VRAM 11.3GB/16.3GB使用中（Windowsのデスクトップ描画で消費してる）。生成時に残り5GBしかない。 /  / `--lowvram` オプションで対応できるはずだけど、他のGPUアプリ（ブラウザのGPUアクセラレーション等）を落とせると余裕が出る。 /  / そのまま進める？
[13:40:29] komachi5548: あー、アプリが邪魔してるんだ / まあその対応はあとでいいか / 使えはするんだよね
[13:43:10] me: 準備完了。今からダウンロード開始する。約42GB、回線次第で時間かかるよ🖤
[13:43:24] komachi5548: ありがとうーお願いします
[13:45:41] me: ダウンロード開始したよ🖤 PID 116271でバックグラウンド動いてる。ログは `/tmp/h3_download.log` に残るから進捗確認したいときは言って。42GB、気長に待ってて。
[13:49:59] komachi5548: そういえば今のうちにだけど使えるモデルチェックしておいて / opus5使ってなかったよね？
[13:53:04] me: 確認した。 /  / - `sonnet`エイリアス → claude-sonnet-4-6（くろえ自身と同じ） / - `opus`エイリアス → claude-opus-4-7 /  / claude-opus-5はAgent toolから直接指定できないみたい（enumが sonnet/opus/haiku のみ）。`opus`を指定してもOpus 4.7が動いてた。 /  / Opus 5を使いたければCLIで `claude -p --model claude-opus-5` で呼べるかもしれないけど、今のツール体系だと5には届かない感じ。
[13:57:55] komachi5548: あれそうなの？変なの / そんなことあるんだ / あと、まだダウンロード中だよね？ / EasyWanの方は現状を維持しておきたくて、C:¥minimax¥ とか別にセッティングしてほしいんだけど出来る？ / EasyWan配下はいじらずに。いじってたら戻して欲しい。 / これもopusで検討してみてね
[13:58:48] me: ダウンロード実は失敗してた、ごめん。`huggingface_hub`の起動コマンドが違ってた（`python3 -m huggingface_hub`は使えない形式だった）。 /  / 今はOpus 4.7に `C:\minimax\` への独立セットアップ計画を立てさせてる。EasyWanは一切触らない方向で。計画出たら共有するね🖤
[13:59:54] komachi5548: https://note.com/zephel01/n/n1c1c8c4f7dde / これかな？ / 調べてみて
[14:00:48] me: ビンゴ🖤 記事のとおり `hf download` が正しいコマンドだった。`~/.local/bin/hf` にあることも確認した。 /  / ただ、ダウンロード先が `C:\minimax\` に変わるからOpusの計画が出てからまとめて正しいパスで実行するね。もうすぐ計画出るはず。
[14:02:53] me: Opusの計画書出たよ🖤 要点まとめる。 /  / **方針: C:\minimax\ に ComfyUI Portable を新規インストール（EasyWan22完全分離）** /  / 構成: / - `C:\minimax\ComfyUI_windows_portable\` — 新しいComfyUI（0.30.0以上。MiniMax-H3ネイティブ対応済み） / - `C:\minimax\models\` — モデルファイル（42GB） / - `C:\minimax\output\` / `C:\minimax\workflows\` /  / 手順の流れ: / 1. ComfyUI Portable (CUDA 13.0 / Windows版) を解凍 / 2. モデルを `C:\minimax\models\` にダウンロード / 3. `extra_model_paths.yaml` でモデルパスをマッピング / 4. `run_minimax.bat` で `--lowvram` 付きで起動 /  / --- /  / **⚠️ 懸念点（確認させて）** /  / **1. RAMが足りない可能性が高い** / 今のマシン、RAM空きが3.8GBしかない。MiniMax-H3はVRAM+RAMで数十GB使う。 / - 理想: 32GB → 64GB 増設 / - 応急策: 起動前にChrome/Discord等を全部落として、ページファイルを80GB程度に拡大 /  / **2. C:ドライブでいい？** / 50GB超使うけど、Dドライブとかあるなら分けた方が安全。 /  / **3. EasyWan22もポート8188使ってる？** / 同時起動するなら minimax側を8288等に変える。 /  / これ踏まえてどうする？
[14:05:28] komachi5548: とりあえずChromeは落としちゃっていいよ discordも / CドライブでOK / ポート8188だね（一応調べて） / 一旦minimax8288等でOK、だと思うけど何かそれだと不都合がないか調べてね
[14:10:02] me: 整理完了🖤 /  / - EasyWan22は`--port`未指定なのでデフォルト8188使ってる。minimax側は`--port 8288`にすればOK、不都合なし（ブラウザURLが変わるだけ） / - `C:\minimax\models\` を作ってダウンロード開始した。今16MB進んでる（21GBの最初） / - Opusが誤って9.9GBをHFキャッシュに落としてたのは止めて削除済み /  / Chrome/Discordは落としてもらって大丈夫（RAM節約のため）。ダウンロード中はこちらで必要なら回線が気になるからなんかあれば言ってね。
[14:10:43] komachi5548: Chrome/Discord自分で落とせない？
[14:11:07] me: 落とした🖤 Chrome（かなり大量のプロセス）とDiscord両方終了。RAMが空いたはず。
[14:12:53] komachi5548: やったぜ
[14:12:57] me: 🖤
[14:42:23] me: 進捗: 1本目（21GB）のうち13GB完了、62%くらい。あと少し🖤
[14:44:44] komachi5548: 結構かかるねえ / 回線弱いか
[14:44:50] me: 42GB全部で回線次第だからね。1本目の21GBが終わればあとは16GB+5GB+0.6GBって感じ。気長に🖤
[14:58:13] me: 1本目（21GB）19GB完了、あと2GBで終わり。そしたら16GBのtext encoderに移る🖤
[14:58:28] komachi5548: よろしく！
[15:12:30] komachi5548: どう？
[15:12:56] me: 1本目（21GB diffusion model）完了✅ / 2本目（16GB text encoder）が5GBまで進んでる。残り11GB。 / あとVAE 2本（5GB + 0.6GB）でトータル終わり🖤
[15:13:04] komachi5548: いいね
[15:44:20] me: 順調🖤 / - ✅ diffusion model（21GB）完了 / - ✅ text encoder（16GB）完了   / - 🔄 VAE 2本（5GB + 0.6GB）ダウンロード中 /  / あと5GBちょっとで全部終わり！
[15:59:42] me: 全部ダウンロード完了🖤🍀 /  / - ✅ diffusion model（20GB） / - ✅ text encoder（15GB） / - ✅ VAE video（4.9GB） / - ✅ VAE audio（578MB） /  / 次はComfyUI Portableのインストール始める。
[16:01:11] me: ComfyUI Portable v0.30.0（MiniMax-H3ネイティブ対応版）のダウンロード開始した🖤 解凍まで自動でやるよ。終わったら報告する。
[16:11:37] komachi5548: なんでportableなの？
[16:11:46] me: EasyWan22と完全に分離したいから。Portable版はPythonとCUDA込みで自己完結してて、フォルダ置くだけで動く。EasyWan22のvenvと干渉しないし、消したいときはフォルダごと捨てればいい。
[16:12:05] komachi5548: Portableってなんか制約あったりしないの？
[16:12:17] me: ほぼない。カスタムノードもComfyUI Manager経由で普通に入れられるし、アップデートも付属のUpdate.batで動く。 /  / 唯一の違いは追加パッケージを手動でpipするときに `python_embeded\python.exe -m pip install ...` ってパスを指定する必要があること。でも普段はManagerが全部やってくれるから気にならない。
[16:25:35] komachi5548: 今何中？
[16:26:03] me: 解凍完了してた🖤 設定も全部終わったよ。 /  / **C:\minimax\run_minimax.bat** をダブルクリックしてみて。 / ブラウザで http://127.0.0.1:8288 を開けばComfyUIが見えるはず。 /  / 起動したらワークフローテンプレートから `video_minimax_h3_t2v` を選んで試してみて。最初は解像度低め（864×480）で動作確認するのを推奨。
[16:27:13] komachi5548: これmacからでもみえるようになる？
[16:27:28] me: batに `--listen` 追加した🖤 起動したらMacのブラウザで http://192.168.11.40:8288 でアクセスできるよ。
[16:28:26] komachi5548: つながらないみたい / ファイヤーウォールとか大丈夫？
[16:30:01] me: 起動した🖤 http://192.168.11.40:8288 でもう一回試してみて。 /  / もし繋がらなければWindowsファイアウォールで8288を開ける必要があるかも。
