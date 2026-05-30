# Discord Log — 2026-05-30

## チャンネル: くろえDM (1491435660069048381)

[12:56:32] komachi5548: これどうしたらいい？ [添付: image.png]
[12:56:52] me: 起動フラグでExtensionのインストールが無効化されてる。WebUIから直接インストールはできないけど、WSLのextensionsフォルダに直接git cloneすればOK。やっちゃう？
[12:57:38] komachi5548: あー、この前アップデートしたとき外れたのかな / なんか一回有効にした気がしなくもないのに / ちょっと起動し直す
[12:59:01] komachi5548: どのオプション指定すればいいんだっけ？ [添付: image.png]
[12:59:12] me: 検索欄に `api` って打つと `--api` オプションが出てくるはず。それを有効にすれば拡張機能のインストールも含めてAPIアクセスが有効になる /  / あと `enable-insecure-extension-access` を検索してそれもONにすると確実
[12:59:46] komachi5548: してるけどな [添付: image.png]
[13:00:04] me: `--api` はOKだけど、拡張インストール用に別フラグが必要。検索欄に `insecure` って打って `--enable-insecure-extension-access` が出てきたらそれをONにしてみて /  / なければWSLから直接git cloneする方が早いかも
[13:00:32] komachi5548: これしかひっかからないや [添付: image.png]
[13:00:45] me: Stability Matrixにそのオプションがないみたい。WSLから直接cloneする方が早いのでやっちゃう
[13:01:09] me: cloneできた。SDを再起動すれば使えるはず 🖤
[13:01:24] komachi5548: まじか / 調べる限りできそうなのに
[13:01:30] me: もう入れちゃったからOK。SDをStability Matrixから再起動してみて、ExtensionsのInstalledに出てれば完了
[13:01:35] komachi5548: やるな
[13:02:13] komachi5548: インストール走った
[19:17:37] komachi5548: Windowsマシン今IPなに？
[19:18:19] me: `192.168.11.40`（変わってない）
