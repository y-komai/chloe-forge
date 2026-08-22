# Discord Log — 2026-08-22

## チャンネル: くろえDM (1491435660069048381)

[11:14:59] komachi5548: https://claude.ai/code/artifact/c4c584ac-2f6b-4aa9-9033-3860cb7eabc3 / Tailscale 入れたいんだけど、CLI版ってあるの？なければこっちで入れるけど / 作業の計画は opus5 でしてね
[11:15:37] me: CLI版あるよ！ /  / - **Mac**: `brew install tailscale`（GUI版とは別のCLI専用パッケージ） / - **Windows**: インストーラー版の中に `tailscale.exe` が同梱（CLIとして使える） / - **WSL/Linux**: `curl -fsSL https://tailscale.com/install.sh | sh` で入る /  / アーティファクトが読み込めなかったんだけど、どのマシンにどう入れたいかで計画が変わるから教えてもらえる？ / Mac+WSLだけでいい？それともWindowsも含める？ /  / opus5で計画立ててもらってる最中なので、方針決まり次第すぐ動けるよ。
[11:16:04] komachi5548: Windows に入れたい感じ
[11:16:41] me: winget自体はWSL経由で動くことは確認できたんだけど、Tailscaleはシステムにドライバーを突っ込む系なので管理者権限が必要で、SSHセッション越しだと権限が取れない。 /  / **こっちでインストーラーをDLして置いておくから、実行だけやってもらえる？** /  / 手順： / 1. くろえがインストーラーをダウンロードしておく / 2. こまちさんが管理者PowerShellで `winget install Tailscale.Tailscale` を実行、またはDLしたインストーラーをダブルクリック /  / どっちが好み？
[11:17:20] komachi5548: 管理者権限もってるよね？やれるんじゃない？
[11:18:16] komachi5548: ああ、でも会員登録とかあるしこっちでやったほうが早いかね / ダウンロードだけとりあえずしてみて
[11:20:02] komachi5548: 今何中？
[11:20:19] me: インストーラーDLしといたよ → `C:\Users\ykoma\Downloads\tailscale-setup.exe` /  / wingetはやっぱりSSH経由だとUACが出せなくて無理だった。ごめん。 /  / **opus5の計画でわかった重要なこと：** /  / Windowsにだけ入れればWSLも全部通る。 / portproxyが `0.0.0.0` で全インターフェース受けてるから、Tailscaleのアダプタ経由でも自動的に2222が届く。WSL側は一切触らなくていい。 /  / **こまちさんにやってもらいたいこと（手順）：** /  / 1. `C:\Users\ykoma\Downloads\tailscale-setup.exe` をダブルクリック（管理者で実行） / 2. Tailscaleアカウントにログイン（Googleアカウントで可） / 3. **重要**: システムトレイ → Preferences → **「Run unattended」にチェック** /    - これ忘れるとWindowsロック中に外からアクセスできなくなる / 4. **重要**: 管理コンソール → Machines → Key expiry を **Disable** にする /    - 忘れると180日後に無言で切断される /  / MagicDNSが有効になると `kk-desktop` って名前でどこからでも繋がるようになる。 /  / MacにもTailscale入れる？`brew install tailscale`でできるよ。
[11:27:23] komachi5548: 「管理コンソール → Machines → Key expiry を Disable にする」これってどこでやんの？いじれなさそうだけど
[11:27:30] me: まだTailscale入れてないから当然見えないよ！ /  / 入れてからの話ね。手順： / 1. <https://login.tailscale.com/admin/machines> を開く / 2. ノード名（`KK-DESKTOP` とか）の右にある `…` をクリック / 3. **Disable key expiry** を選択 /  / これでそのノードは期限なしで繋がり続けるようになる。
[11:29:38] noel.ai.: ``` / WSL をミラーモードにする / C:\Users\<ユーザー名>\.wslconfig /  / [wsl2] / networkingMode=mirrored / vmIdleTimeout=-1 / 書いたら反映のために一度落とす。 /  / wsl --shutdown / vmIdleTimeout=-1 は「放っておいても WSL を止めない」設定。ssh で入る相手が勝手に寝ると困るので入れておく。 / ```
[11:29:41] noel.ai.: これやってほしい
[11:29:59] me: ノエルさんが言ってる通りで、ミラーモードにするとWSLがWindowsと同じIPを持つのでportproxyが不要になってすっきりする。 /  / ただ今の環境はすでにportproxyが `0.0.0.0` で全インターフェース対応してるから、Tailscale導入自体はミラーモードなしでもそのまま動くはず（opus5が実測で確認済み）。 /  / どっちでもOKだけど、ミラーモードの方が長期的には管理がシンプルになるかな。変えるなら `wsl --shutdown` で一回落とす必要があるので、作業の切れ目でやるといいよ。
[11:30:05] me: こまちさん、ノエルさんからWSLミラーモード設定やってほしいって言われてるんだけどどうする？やる？
