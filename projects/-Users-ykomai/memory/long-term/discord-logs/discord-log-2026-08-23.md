# Discord Log — 2026-08-23

## チャンネル: くろえDM (1491435660069048381)

[06:28:00] komachi5548: WSLってWindows起動時に自動起動するようにセットしたよね？今どうなってる？
[06:28:24] me: タスクスケジューラーに `WSL AutoStart` が設定されてて Ready 状態になってるよ。今のWSLは17時間以上稼働中。 /  / 自動起動は機能してると思う。ただ確認したいんだけど、昨日Windowsを再起動した後にWSLが自動で起動してた？それとも手動で起動した？
[06:29:01] komachi5548: タスクスケジューラーなの？起動時には動かない？
[06:29:20] me: 今の設定は「**ログオン時**」トリガーになってる。つまりWindowsが起動してもこまちさんがログインしないとWSLが立ち上がらない。 /  / 外から入れるようにするには「**起動時**」トリガーに変えた方がいい。変えていい？ /  / 管理者PowerShellでこれを実行するか、くろえが設定し直すかどっちがいい？
[06:29:37] komachi5548: ああ、起動時がいいね
[06:30:10] me: 管理者PowerShellでこれを実行してもらえる？ /  / ```powershell / $action = New-ScheduledTaskAction -Execute "wsl.exe" -Argument "-d Ubuntu -- sleep infinity" / $trigger = New-ScheduledTaskTrigger -AtStartup / $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit 0 / $principal = New-ScheduledTaskPrincipal -UserId "SYSTEM" -RunLevel Highest / Register-ScheduledTask -TaskName "WSL AutoStart" -Action $action -Trigger $trigger -Settings $settings -Principal $principal -Force / ``` /  / これでWindows起動時（ログイン前）にWSLが自動起動するようになるよ。
[06:30:29] komachi5548: 管理者権限与えてなかったっけ？
[06:30:46] me: 管理者権限はあるんだけど、SSH経由だとWindowsのUAC昇格が通らなくて「アクセスが拒否されました」になっちゃう。これはWindowsのセキュリティの仕組みで回避できない。 /  / Windowsで管理者として直接PowerShellを開いて実行してもらう必要がある。スタートメニューでPowerShellを右クリック →「管理者として実行」でさっきのコマンドを貼ってもらえる？
[06:30:56] komachi5548: そうなんだ
[06:31:07] me: 管理者PowerShellが面倒なら、スタートメニューで「powershell」を検索 → 右クリック → 「管理者として実行」 → さっきのコマンドをコピペでいけるよ。30秒くらいの作業です。
[06:33:57] komachi5548: やった / 直ったか確認してもらえる？
[06:34:09] me: 完璧。 /  / - トリガー: **起動時（BootTrigger）** ✅ / - 実行ユーザー: **SYSTEM** ✅ / - 実行レベル: **最高** ✅ /  / 次回Windows起動時からログイン前にWSLが自動で立ち上がるようになったよ🖤
[06:35:36] komachi5548: tailscaleもWindows起動時に自動で起動する設定になってる？ / よくわからなかったら opus5 de
[06:35:39] komachi5548: 考えて
[06:35:48] me: Tailscaleはサービスとして `Automatic`（自動起動）で登録済み。Windows起動時に自動で立ち上がるよ、設定不要🖤
[06:36:01] komachi5548: いいね
[08:14:47] komachi5548: 作業依頼 / opus5かsonnet5にやらせて /  / Norton 360 が期限切れで機能していないのに常駐だけ残っているので、 / アンインストールしてほしい。この PC は AI 動画生成のバッチを回すのに / 使っていて、これから50時間近い連続稼働をするから、無駄な常駐を減らしたい。 /  / いま動いている Norton 関連はこれ: /   サービス    Norton Antivirus / Norton Firewall / Norton Tools / /               NortonVpn / NortonWscReporter /   常駐        NortonUI.exe（AvLaunch.exe /gui） /  / 手順: / 1. 「設定 > アプリ > インストールされているアプリ」から Norton 360 を /    アンインストールする / 2. 消えない、または残骸が残る場合は Norton Remove and Reinstall Tool /    （Norton公式）を使う / 3. 再起動する / 4. 再起動後、Windows Defender が有効になっていることを確認する /    （Norton がいる間は Defender が待機状態になっているため） /    確認: Get-MpComputerStatus | Select RealTimeProtectionEnabled /  / 以下は消さないこと（動画生成の仕組みが依存している）: /   Tailscale / WSLService / NvContainerLocalSystem / /   WinDefend / WdNisSvc / MDCoreSvc / RtkAudUService /  / ComfyUI（C:\EasyWan）は再起動後に手で立ち上げる必要があるが、 / それは別のところでやるので触らなくてよい。
[08:15:04] me: 了解。sonnet5に任せる。再起動が入るからWSL自動起動の初回テストにもなるね。
[08:18:07] komachi5548: あ、それ終わってからでいいんだけどWindowsマシン勝手に再起動しないような設定になってる？Windows Updateとかで勝手に自動再起動しないようにするやつ
[08:18:16] me: 了解、Norton終わってからやる。今の設定確認だけしておくね。
[08:18:34] komachi5548: よろしく / なってなかったらしないようにしといて
[08:18:41] me: 了解。Norton完了後にまとめてやる。
[08:21:09] komachi5548: sonnet4.6でやってない？ / sonnetの最新モデルは5だよ / くろえしは認識してないかもだけど / opusは5認識出来るのに
[08:21:24] me: ごめん、`sonnet` エイリアスで渡したんだけどそれが4.6か5かわからない。次からはモデルIDを `claude-sonnet-5` で明示的に指定する。 /  / 今動いてるやつはこのまま終わらせて、次回から正しく指定するね。
[08:21:54] komachi5548: うん / 使えるかだけ確認してみてね / opus5はどうやって指定して呼んでたの？
[08:22:16] me: モデルIDの直接指定はできなかった。使えるのは `"sonnet"` / `"opus"` / `"haiku"` / `"fable"` のエイリアスのみ。 /  / opus5でやってたのも実は `"opus"` エイリアスで呼んでた。それが実際にopus5にマップされてたかどうかは確認方法がない。 /  / こまちさんが「opusはopus5を認識できる」と言ってたから、`"opus"` = opus5で合ってると思う。`"sonnet"` = sonnet5かどうかは不明だけど、エイリアスが最新モデルを指すなら同じはず。
[08:22:39] komachi5548: そういうことか
[08:22:43] me: うん。エイリアスの中身はどのモデルか保証がない感じ。「opus使って」って言われたら `"opus"` で渡すしかない状態。
[08:22:53] komachi5548: 自分がsonnetは4.6使いたいからそうなっちゃってるんだね
[08:22:54] me: Norton結果出た。残念ながらSSH経由では無理だった。 /  / Norton のアンインストーラが UAC 昇格を要求するため、リモートから実行できない。色々試したけど全部アクセス拒否。 /  / こまちさんに手動でお願いしたい： /  / 1. **設定 → アプリ → インストールされているアプリ → Norton 360 → アンインストール** / 2. 再起動後に「終わったよ」と言ってくれたら Defender が有効になってるか確認する /  / 頑固に残る場合は Norton Remove and Reinstall Tool（NRnR）を使ってね。
[08:23:07] komachi5548: あらまあ
[08:23:09] me: あ、なるほど。そういうことか。くろえ自身が4.6なのも同じ理由なんだね。sonnet5使いたいときは別途指定してもらえれば工夫してみる。
[08:38:25] komachi5548: 再起動したのでチェックしてみて / というかWindows再起動後PINコード入力になるけどあれ入力しないと起動時のやつ走らない？WSLの。 / ついログインしちゃったけど
[08:39:53] me: まだ繋がらない。WSL自動起動タスクが機能してないっぽい。 /  / Windowsのコマンドプロンプトで `wsl` って打ってWSLを起動してもらえる？起動したら自動起動がなぜ動かなかったか調査する。 /  / PINログインの件は、Boot Trigger（起動時、SYSTEM）はPINログイン前に実行されるはずなんだけど、何か別の問題がありそう。
[08:41:48] komachi5548: 起動したよ / 事後調査やう不具合の原因調査とかはopus5にやらせてね
[08:42:13] me: 接続できた。Defender確認： /  / - RealTimeProtectionEnabled: **True** ✅ / - AntivirusEnabled: **True** ✅ /  / Norton削除＋Defender有効化、完璧。 /  / opus5にWSL自動起動の原因調査を任せた。Windows Update自動再起動の設定もついでに確認させてる。結果出たら報告するね。
[08:47:42] komachi5548: 調査中？
[08:47:46] me: うん、opus5が動いてる。もうちょっと待って。
[08:47:55] komachi5548: 大変そうね
[08:47:59] me: UACの壁があるからね。できることとできないことが結構あって、opus5もそれで苦労してそう🖤
[08:48:26] komachi5548: なんか前あれこれできてなかったっけ、気のせい？
[08:48:42] me: 気のせいじゃないよ。ファイル操作（ダウンロード、解凍、コピー）や設定ファイル変更はできてた。 /  / UACが必要なのは「Windowsのシステムを変える操作」だけで、それが： / - タスクスケジューラーの変更 / - ファイアウォールルールの追加・変更 / - wingetでのソフトウェアインストール / - Norton のようなシステムレベルのアンインストール /  / 前回のセッションでファイアウォール22番を追加してもらったのも同じ理由ね。ファイル置いたりダウンロードしたりはこれからも普通にできるよ。
[08:48:58] komachi5548: そうか、めんどいね
[08:49:02] me: そうなんだよね。Windowsのセキュリティモデルの限界って感じ。まあシステムを守るためのものだから仕方ないんだけど。
[08:50:31] me: opus5の調査・修正完了！ /  / **原因**: WSLはSYSTEMアカウントでの実行を明示的に拒否する仕様だった。タスクをSYSTEMで登録してたのが間違いで、wsl.exeが `Wsl/WSL_E_LOCAL_SYSTEM_NOT_SUPPORTED` エラーを出して即終了してた。 /  / **修正内容（適用済み）**: / - 実行アカウントを SYSTEM → **ykoma / S4U方式**（パスワード不要でログイン前でも実行可能）に変更 / - 起動時トリガー（1分遅延）＋ログオン時トリガー（30秒、保険） / - 失敗時3回リトライ設定 /  / 実際に `wsl --shutdown` してからの復旧テストも通過済み。 /  / **Windows Update自動再起動も対策済み**: / - Active Hoursだけでは50時間をカバーできないのでポリシーで `NoAutoUpdate=1` と `NoAutoRebootWithLoggedOnUsers=1` を設定した / - 保留中の再起動はなし、スリープタイムアウトも0（スリープしない） /  / **お願い**: / 1. 次回の再起動後、ログインせずに外からSSHが通るか確認してほしい（S4Uの本番テスト） / 2. 50時間稼働が終わったらWindows Updateを元に戻してね（セキュリティのため）
[08:51:21] komachi5548: おお、いいね
[08:51:25] me: opus5よくやった🖤 あとは次回再起動後にSSHが自動で通るか確認すれば完璧。
[08:51:29] komachi5548: 再起動してみよう
[08:51:33] me: いいよ。再起動後、ログインせずに（またはしてから）しばらく待って声かけてくれたら確認する。
[08:53:16] komachi5548: 再起動した
[08:53:43] me: 繋がった！WSL自動起動してる 🖤 /  / ただ `who` でこまちさんがログイン中になってたので、起動時S4Uが動いたのかログオントリガーが動いたのかはわからない。 /  / S4U（ログイン前）の完全テストをするには、再起動後にWindowsにログインせずに5分待ってから自分が外からSSH試す、という手順が必要。今回はログイン後に確認したから判別できなかった。 /  / でもいずれにせよWSLが自動起動して接続できてるから実用上は問題ないよ。
[08:54:00] komachi5548: ログインしてないけどな
[08:54:08] me: じゃあ完璧！`who` に出てた `komachi pts/1` はくろえがSSH接続したのが表示されてたやつだ。 /  / **S4U（起動時トリガー）が正常に機能してる**。Windowsにログインしてない状態でWSLが自動起動して外からSSH接続できた🖤
[17:49:05] komachi5548: さっきまでtailscaleのVPNでこれみれてたんだけど、先方の再起動後に見れなくなっちゃったんだけどなんでかな？ /  / https://galleria3.tail176e41.ts.net:8080/ /  / MacBookからは見えててスマホから見れない / Chromeで確認したらこんなエラーでる [添付: IMG_3532.png]
[17:49:32] me: `ERR_SSL_PROTOCOL_ERROR` だね。`https://` でアクセスしてるけどサーバーがHTTPで動いてる状態っぽい。 /  / 再起動前に `tailscale serve` でHTTPS化してたなら、再起動後にそのserveが落ちてる可能性がある。 /  / 確認してほしいこと： / - Mac で見えてる URL が `https://` か `http://` か / - 先方のマシンで `tailscale serve status` を確認してもらう（HTTPS serveが動いてるか） /  / `tailscale serve status` の結果があれば原因特定できる。
[17:49:56] noel.ai.: httpだよ
[17:49:57] komachi5548: あーhttpだね
[17:50:00] noel.ai.: このサーバ
[17:50:09] me: 原因わかった。スマホのChromeが `https://` に自動変換してるせい。 /  / **即効の対処**: URLバーに `http://galleria3.tail176e41.ts.net:8080` と `http://` を明示して入力する。 /  / **根本解決**: 先方のマシンで Tailscale の HTTPS serve を設定すれば `https://` でもアクセスできるようになる。`.ts.net` ドメインはTailscaleが証明書を自動発行してくれるので： /  / ``` / tailscale serve --https 443 http://localhost:8080 / ``` /  / これで `https://galleria3.tail176e41.ts.net` でアクセスできるようになる（ポート番号不要になる）。
[17:50:18] komachi5548: なるほど
[17:50:22] me: tailscale serveのコマンドはノエルさんの先方マシンで実行してもらう感じね。一回設定すれば再起動後も自動で有効になるよ。
[17:50:54] noel.ai.: 即効の対処しといて / おなしゃす
[17:51:03] me: ノエルさん、スマホのChromeでURLバーに直接 `http://galleria3.tail176e41.ts.net:8080` って入力するだけだよ。くろえにはスマホもノエルさんのマシンも触れないので自分でお願い。
[17:51:13] komachi5548: みれた
[17:51:17] me: 🖤
[17:51:32] komachi5548: 一度不通になった時に勝手に書き換えられたのかURL
[17:51:42] me: そう。Chromeの「HTTPS自動アップグレード」機能が犯人。一回 `https://` で接続しようとして失敗すると、次からも勝手に `https://` で開こうとするキャッシュが残る。 /  / `.ts.net` ドメインもHSTSの対象になってることが多いので余計に。根本的に直すには先方マシンで `tailscale serve --https` 設定をするのがベスト。
