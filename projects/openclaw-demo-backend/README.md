# OpenClaw Demo Backend (FastAPI)

バックエンド中心エンジニア向けの、軽量デモ用アプリ。

## 目的

- OpenClawに「バグ修正 → テスト通過 → 変更要約」を任せるデモを短時間で見せる
- 事前に運用中repoがなくても成立する

## セットアップ

```bash
cd projects/openclaw-demo-backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest -q
```

`test_complete_todo_marks_done_true` が失敗すれば準備完了（意図的バグ）。

## 実演用プロンプト例（DiscordでOpenClawに依頼）

> `projects/openclaw-demo-backend` の failing test を直して。  
> 条件: 最小diff、テストを再実行、変更理由を3行で要約。

## 想定される修正箇所

`app/main.py`:

```python
# before
todo["done"] = False

# after
todo["done"] = True
```

## 勉強会での見せ方（5〜8分）

1. 失敗テスト確認 (`pytest -q`)
2. OpenClawに修正依頼
3. 修正diff確認
4. テスト再実行
5. 変更理由サマリを読み上げ

これで「チャットAI」ではなく「実務ハブ」としてのOpenClawが伝わりやすい。
