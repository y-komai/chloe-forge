# Discord Log — 2026-08-05

## チャンネル: くろえDM (1491435660069048381)

[13:24:56] komachi5548: ねえ、MiniMaxH3ってやつがリリースされたんだけどリサーチしてwinで使えるようにセットアップしてもらえる？ / サブエージェントで opus5 とかを使っていいよ / 手順わかったら実行の前に教えて / まずはモデルのダウンロードから
[13:26:57] komachi5548: opusは最新5だよ、調べて使ってね
[13:28:11] me: リサーチ結果（実行前の確認）： /  / **MiniMax-H3とは** / テキスト→動画・画像→動画を生成するオープンウェイトの動画生成モデル（LLMではない）。33Bパラメータ、4〜15秒の動画を最大2K・ステレオ音声付きで生成できる。 /  / **RTX 5070 Ti（16GB）での構成** / ComfyUI + pruned INT8量子化版が本命。Comfy-Org公式量子化が用意されてる。 /  / **ダウンロード必要ファイルと配置先（約42GB）** / - `minimax_h3_fl2va_pruned_int8_convrot.safetensors`（約21GB）→ diffusion_models/ / - `qwen3vl_32b_minimax_h3_nvfp4_awq.safetensors`（約16GB）→ text_encoders/ / - `minimax_h3_video_vae_fp16.safetensors`（約5GB）→ vae/ / - `minimax_h3_audio_vae_fp32.safetensors`（約600MB）→ vae/ /  / **セットアップ手順（骨子）** / 1. ComfyUI（v0.30.0以降）が入ってること確認 / 2. PyTorch nightly（CUDA 12.8・Blackwell対応）に更新 / 3. 上記4ファイルをダウンロードして各フォルダに配置 / 4. ComfyUIのTemplateからMiniMax H3 T2Vワークフローをロード / 5. 最初は864×480・5秒・20stepsで動作確認 /  / **気になる点** / - 約42GBのダウンロードが必要（WSL2側に置く想定、ディスク容量要確認） / - WindowsネイティブのComfyUIが既にある？それともWSL2上に新規構築？ / - 動画生成なので速度はかなり遅い（RTX 5090で10秒クリップ約175秒） /  / どっちで進める？
