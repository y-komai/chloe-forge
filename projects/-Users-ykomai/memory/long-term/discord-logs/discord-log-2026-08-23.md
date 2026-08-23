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
