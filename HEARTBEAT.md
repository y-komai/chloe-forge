# HEARTBEAT.md

## 定期タスク

### git auto-push
差分があればcommit & pushする。

```bash
cd /home/komachi/.openclaw/workspace
if [ -n "$(git status --porcelain)" ]; then
  git add -A
  git commit -m "auto: heartbeat sync $(date '+%Y-%m-%d %H:%M')"
  git push
fi
```
