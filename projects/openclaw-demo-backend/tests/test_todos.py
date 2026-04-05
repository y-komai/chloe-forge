from fastapi.testclient import TestClient
from app.main import app, TODOS

client = TestClient(app)


def reset_state():
    TODOS.clear()
    TODOS.update(
        {
            1: {"id": 1, "title": "prepare demo", "done": False},
            2: {"id": 2, "title": "ship feature", "done": False},
        }
    )


def test_complete_todo_marks_done_true():
    reset_state()
    r = client.post("/todos/1/complete")
    assert r.status_code == 200
    body = r.json()
    # this test currently fails because app has an intentional bug
    assert body["done"] is True


def test_complete_missing_todo_returns_404():
    reset_state()
    r = client.post("/todos/999/complete")
    assert r.status_code == 404
