# Discord Log — 2026-04-15

## チャンネル: くろえDM (1491435660069048381)

[03:28:48] komachi5548: 漏れなく動いてくれればなんでもいいかな / cronならわかりやすいし
[03:28:59] me: 了解🖤 じゃあWSLのcronに移す感じで進めようか。 /  / 手順としては： / 1. WSL側にbunをインストール / 2. `discord-log-save.ts` をWSLにコピー（またはMacのファイルをWSLのパスでマウント） / 3. `.env` と `state.json` の置き場所をWSL用に調整 / 4. crontabに登録（例: `0 */4 * * * bun /path/to/discord-log-save.ts`） / 5. Macのlaunchdの方は無効化 /  / WSL側でどこにファイル置くか、あとbun入ってるか確認してからやると進みやすい。今できる？
[03:29:30] komachi5548: ローカルネットワーク上のWSLにsshしてやってもらいたいんだけど出来るかな
[03:29:39] me: できると思う🖤 ただ事前に少し確認が必要。 /  / WSL側でSSHサーバーが起動してるか、WindowsのポートフォワーディングとファイアウォールがLANに開いてるか。 /  / WindowsのローカルIP（例: 192.168.11.xx）と、接続に使うポート番号（デフォルト22、または2222など）教えてもらえれば試せる。
[03:29:55] komachi5548: あー、その辺の設定から教えて
[03:30:03] me: 了解🖤 手順まとめる。 /  / **WSL側（Ubuntuのターミナルで）** / ```bash / # SSHサーバーのインストール・起動 / sudo apt update && sudo apt install -y openssh-server / sudo service ssh start /  / # 自動起動設定（/etc/wsl.confに追加） / echo -e "[boot]\ncommand=\"service ssh start\"" | sudo tee -a /etc/wsl.conf /  / # WSL2のIPを確認（後で使う） / hostname -I / ``` /  / **Windows側（PowerShellを管理者で実行）** / ```powershell / # WSL2のIPにポートフォワード（2222番をWSLの22番に転送） / netsh interface portproxy add v4tov4 listenport=2222 listenaddress=0.0.0.0 connectport=22 connectaddress=<hostname -I で出たIP> /  / # ファイアウォール開放 / New-NetFirewallRule -DisplayName "WSL2 SSH" -Direction Inbound -Protocol TCP -LocalPort 2222 -Action Allow / ``` /  / **Macから接続確認** / ```bash / ssh -p 2222 <WSLのユーザー名>@<WindowsのローカルIP> / ``` /  / WindowsのローカルIPは「設定 → ネットワーク」か `ipconfig` で確認できる。 /  / WSL側のターミナルで `sudo service ssh start` から試してみて🖤
[03:32:10] komachi5548: これローカルネットワークに閉じた状態になってる？
[03:32:18] me: なってる🖤 /  / `listenaddress=0.0.0.0` はWindows上で全インターフェースで受け付けるという意味で、インターネット側に公開するかどうかはルーター設定次第。 /  / 自宅ルーターでポート転送（ポートフォワード）を設定していなければ、2222番はLAN内にしか届かない。普通の家庭用ルーターはデフォルトで外部からの着信をブロックするから、何もしなければLAN内に閉じてる。 /  / 念のため確認したいなら、ルーターの管理画面で2222番への転送ルールがないことを確認するか、あるいは `listenaddress=192.168.11.x`（WindowsのLAN IP）に限定するとより明示的に閉じられる。
[03:32:32] komachi5548: そりゃそうか
[03:32:41] me: あと公開鍵認証にしておくとよりきれい。パスワード認証だとbrute force対策が必要になるけど、LANに閉じてるなら過剰かな。好みで🖤 /  / 試す準備できたら声かけて。
[07:27:59] komachi5548: ssh -p 2222 komachi@192.168.11.40
[07:30:55] komachi5548: これで入れる / けどパスワード聞かれるから公開鍵認証にしたいね
[07:31:14] me: 入れたの🖤 いいね。 /  / Mac側にすでに鍵がある（`id_rsa_comp.pub` など）けど、WSL用に新しく作っても良い。シンプルにやるなら↓ /  / **Macのターミナルで** / ```bash / # WSL用鍵を作成（Enter連打でOK） / ssh-keygen -t ed25519 -f ~/.ssh/id_wsl -C "mac-to-wsl" /  / # WSLに公開鍵を転送 / ssh-copy-id -i ~/.ssh/id_wsl.pub -p 2222 <ユーザー名>@<WindowsのIP> / ``` /  / これでパスワードなしで入れるようになる。転送後にパスワード認証を無効化したければ、WSL側の `/etc/ssh/sshd_config` で `PasswordAuthentication no` にしてSSHを再起動するだけ🖤
[07:37:24] komachi5548: 設定したから試してみて
[07:37:38] me: 192.168.11.40 には繋がってる🖤 WSLのユーザー名を教えてもらえれば接続試せる。
[07:37:51] komachi5548: komachi
[07:38:00] me: 繋がった🖤 パスワードなしで入れてる。 /  / KK-DESKTOP の `/home/komachi` に接続成功。次はここにbunとdiscord-log-save.tsを入れてcron設定しようか。
[07:38:18] komachi5548: おねがい
[07:41:36] komachi5548: というかtypescriptなんだ / Pythonじゃないんだね
