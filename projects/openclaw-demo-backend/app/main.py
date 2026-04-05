from fastapi import FastAPI, HTTPException
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

app = FastAPI(title="OpenClaw Demo API")

# in-memory store
TODOS: dict[int, dict] = {
    1: {"id": 1, "title": "prepare demo", "done": False},
    2: {"id": 2, "title": "ship feature", "done": False},
}


class TodoCreate(BaseModel):
    title: str


@app.get("/", response_class=HTMLResponse)
def web_ui():
    return """
<!doctype html>
<html lang=\"ja\">
<head>
  <meta charset=\"UTF-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>OpenClaw Demo Todo</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background:#0b1020; color:#e6eaff; margin:0; }
    .wrap { max-width: 860px; margin: 40px auto; padding: 0 16px; }
    .card { background:#141b34; border:1px solid #273056; border-radius:14px; padding:20px; box-shadow:0 8px 30px rgba(0,0,0,.2); }
    h1 { margin:0 0 8px; font-size:26px; }
    .muted{ color:#a7b1d6; margin-bottom:18px; }
    .row { display:flex; gap:10px; margin-bottom:14px; }
    input { flex:1; padding:10px 12px; border-radius:10px; border:1px solid #364175; background:#0f1530; color:#e6eaff; }
    button { border:0; border-radius:10px; padding:10px 14px; cursor:pointer; font-weight:600; }
    .primary { background:#7c9bff; color:#0b1020; }
    .secondary { background:#2a335f; color:#e6eaff; }
    ul { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
    li { background:#0f1530; border:1px solid #273056; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center; gap:10px; }
    .done { text-decoration: line-through; color:#8ea0d9; }
    .pill { font-size:12px; padding:3px 8px; border-radius:999px; }
    .pill.ok { background:#1b4d35; color:#8cf2b4; }
    .pill.ng { background:#4f2a2a; color:#ffadad; }
  </style>
</head>
<body>
  <div class=\"wrap\">
    <div class=\"card\">
      <h1>OpenClaw Demo Todo API</h1>
      <div class=\"muted\">FastAPI + minimal web UI（勉強会デモ用）</div>
      <div class=\"row\">
        <input id=\"title\" placeholder=\"新しいTODO（例: write release note）\" />
        <button class=\"primary\" onclick=\"createTodo()\">追加</button>
      </div>
      <ul id=\"list\"></ul>
    </div>
  </div>

<script>
async function fetchTodos() {
  const r = await fetch('/todos');
  const data = await r.json();
  const list = document.getElementById('list');
  list.innerHTML = '';
  for (const t of data.items) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <div class=\"${t.done ? 'done' : ''}\">#${t.id} ${t.title}</div>
        <div class=\"pill ${t.done ? 'ok' : 'ng'}\">${t.done ? 'done' : 'open'}</div>
      </div>
      <div>
        <button class=\"secondary\" onclick=\"completeTodo(${t.id})\">完了にする</button>
      </div>
    `;
    list.appendChild(li);
  }
}

async function createTodo() {
  const title = document.getElementById('title').value.trim();
  if (!title) return;
  await fetch('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  document.getElementById('title').value = '';
  fetchTodos();
}

async function completeTodo(id) {
  await fetch(`/todos/${id}/complete`, { method: 'POST' });
  fetchTodos();
}

fetchTodos();
</script>
</body>
</html>
"""


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/todos")
def list_todos(done: bool | None = None):
    # intentionally simple filter to keep demo readable
    items = list(TODOS.values())
    if done is not None:
        items = [t for t in items if t["done"] == done]
    return {"items": items, "count": len(items)}


@app.post("/todos")
def create_todo(payload: TodoCreate):
    new_id = max(TODOS.keys(), default=0) + 1
    todo = {"id": new_id, "title": payload.title, "done": False}
    TODOS[new_id] = todo
    return todo


@app.post("/todos/{todo_id}/complete")
def complete_todo(todo_id: int):
    todo = TODOS.get(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="todo not found")

    # --- intentionally buggy behavior for demo ---
    # should set True, but currently sets False.
    todo["done"] = False
    return todo
