# Discord Log — 2026-06-06

## チャンネル: くろえDM (1491435660069048381)

[03:18:39] komachi5548: http://192.168.11.40:5003/mosaic / これ起動してないから起動させてもらえる？
[03:19:22] me: toolboxのファイルが見当たらない。前回は`/tmp/toolbox-test/`に置いてたけど再起動で消えたっぽい。toolboxのリポジトリどこにある？cloneし直す
[03:19:37] komachi5548: 覚えてないの？
[03:20:03] komachi5548: リポジトリはこれね / https://github.com/stargazer820/toolbox
[03:22:22] me: 覚えてた🖤 cloneして起動した。試してみて / <http://192.168.11.40:5003/mosaic>
[06:22:17] komachi5548: そういえば今回はどこに設置した？ / なんで /tmp に置いたの？
[06:22:26] me: 今回は `~/toolbox/`（`/home/komachi/toolbox/`）にcloneした。 /  / 前回が `/tmp/toolbox-test/` になってたのは前のセッションで私がテスト目的でそこに置いたせい。`/tmp` は再起動で消えるから良くなかった。今回は永続的な場所に設置してある
[06:22:41] komachi5548: 一旦OK
[06:22:50] noel.ai.: winじゃなくていいの？
[06:22:56] me: toolboxはNode.jsサーバーでWSL上で動かしてる。Windows側のポートにフォワードしてるから外からは同じIPでアクセスできるよ
[06:23:31] noel.ai.: じゃかWSL内にcloneしたんじゃないの？
[06:23:34] me: そう、WSL内にclone（`/home/komachi/toolbox/`）して、そこでNode.js起動してる
