"""
Unit tests for the Timetracking API
Run with: pytest test_main.py -v
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from main import app
import models

# Test database (in-memory SQLite)
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def test_db():
    """Create a fresh database for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(test_db):
    """Test client fixture"""
    return TestClient(app)


# ===== Health Check Tests =====

def test_root_endpoint(client):
    """Test root health check"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Timetracking API is running"}


# ===== Project Tests =====

def test_create_project(client):
    """Test creating a new project"""
    response = client.post(
        "/api/projects",
        json={"name": "Test Project", "color": "blue"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Project"
    assert data["color"] == "blue"
    assert data["is_completed"] == False
    assert "id" in data
    assert "created_at" in data


def test_get_projects_empty(client):
    """Test getting projects when none exist"""
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert response.json() == []


def test_get_projects(client):
    """Test getting all projects"""
    # Create two projects
    client.post("/api/projects", json={"name": "Project 1", "color": "red"})
    client.post("/api/projects", json={"name": "Project 2", "color": "green"})
    
    response = client.get("/api/projects")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["name"] == "Project 1"
    assert data[1]["name"] == "Project 2"


def test_update_project_status(client):
    """Test marking project as completed"""
    # Create project
    create_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = create_response.json()["id"]
    
    # Mark as completed
    response = client.patch(f"/api/projects/{project_id}", json={"is_completed": True})
    assert response.status_code == 200
    assert response.json()["is_completed"] == True
    
    # Mark as active again
    response = client.patch(f"/api/projects/{project_id}", json={"is_completed": False})
    assert response.status_code == 200
    assert response.json()["is_completed"] == False


def test_update_nonexistent_project(client):
    """Test updating a project that doesn't exist"""
    response = client.patch("/api/projects/999", json={"is_completed": True})
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_delete_project(client):
    """Test deleting a project"""
    # Create project
    create_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = create_response.json()["id"]
    
    # Delete
    response = client.delete(f"/api/projects/{project_id}")
    assert response.status_code == 200
    
    # Verify deleted
    response = client.get("/api/projects")
    assert len(response.json()) == 0


def test_delete_nonexistent_project(client):
    """Test deleting a project that doesn't exist"""
    response = client.delete("/api/projects/999")
    assert response.status_code == 404


# ===== Todo Tests =====

def test_create_todo(client):
    """Test creating a new todo"""
    # Create project first
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    
    # Create todo
    response = client.post(
        "/api/todos",
        json={"project_id": project_id, "title": "Test Todo"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Todo"
    assert data["project_id"] == project_id
    assert data["status"] == "todo"
    assert "id" in data


def test_create_todo_invalid_project(client):
    """Test creating todo with non-existent project"""
    response = client.post(
        "/api/todos",
        json={"project_id": 999, "title": "Test Todo"}
    )
    assert response.status_code == 404
    assert "project not found" in response.json()["detail"].lower()


def test_get_todos(client):
    """Test getting all todos"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    
    client.post("/api/todos", json={"project_id": project_id, "title": "Todo 1"})
    client.post("/api/todos", json={"project_id": project_id, "title": "Todo 2"})
    
    response = client.get("/api/todos")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_update_todo_status(client):
    """Test updating todo status through all states"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    
    # todo -> in-progress
    response = client.patch(f"/api/todos/{todo_id}", json={"status": "in-progress"})
    assert response.status_code == 200
    assert response.json()["status"] == "in-progress"
    
    # in-progress -> done
    response = client.patch(f"/api/todos/{todo_id}", json={"status": "done"})
    assert response.status_code == 200
    assert response.json()["status"] == "done"
    
    # done -> todo
    response = client.patch(f"/api/todos/{todo_id}", json={"status": "todo"})
    assert response.status_code == 200
    assert response.json()["status"] == "todo"


def test_update_todo_invalid_status(client):
    """Test updating todo with invalid status"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    
    response = client.patch(f"/api/todos/{todo_id}", json={"status": "invalid"})
    assert response.status_code == 400
    assert "invalid status" in response.json()["detail"].lower()


def test_delete_todo(client):
    """Test deleting a todo"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    
    # Delete
    response = client.delete(f"/api/todos/{todo_id}")
    assert response.status_code == 200
    
    # Verify
    response = client.get("/api/todos")
    assert len(response.json()) == 0


def test_cascade_delete_project_todos(client):
    """Test that deleting project also deletes todos"""
    # Create project with todos
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    client.post("/api/todos", json={"project_id": project_id, "title": "Todo 1"})
    client.post("/api/todos", json={"project_id": project_id, "title": "Todo 2"})
    
    # Delete project
    client.delete(f"/api/projects/{project_id}")
    
    # Verify todos are gone
    response = client.get("/api/todos")
    assert len(response.json()) == 0


# ===== TimeEntry Tests =====

def test_create_time_entry(client):
    """Test creating a time entry"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    
    # Create time entry
    response = client.post(
        "/api/timeentries",
        json={"todo_id": todo_id, "duration": 1500}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["todo_id"] == todo_id
    assert data["project_id"] == project_id  # Backend calculates this
    assert data["duration"] == 1500
    assert "timestamp" in data


def test_create_time_entry_invalid_todo(client):
    """Test creating time entry with non-existent todo"""
    response = client.post(
        "/api/timeentries",
        json={"todo_id": 999, "duration": 1500}
    )
    assert response.status_code == 404
    assert "todo not found" in response.json()["detail"].lower()


def test_get_time_entries(client):
    """Test getting all time entries"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    
    # Create entries
    client.post("/api/timeentries", json={"todo_id": todo_id, "duration": 1500})
    client.post("/api/timeentries", json={"todo_id": todo_id, "duration": 900})
    
    response = client.get("/api/timeentries")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_cascade_delete_project_time_entries(client):
    """Test that deleting project cascades to time entries"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    client.post("/api/timeentries", json={"todo_id": todo_id, "duration": 1500})
    
    # Delete project
    client.delete(f"/api/projects/{project_id}")
    
    # Verify time entries are gone
    response = client.get("/api/timeentries")
    assert len(response.json()) == 0


def test_cascade_delete_todo_time_entries(client):
    """Test that deleting todo cascades to time entries"""
    # Setup
    project_response = client.post("/api/projects", json={"name": "Test", "color": "blue"})
    project_id = project_response.json()["id"]
    todo_response = client.post("/api/todos", json={"project_id": project_id, "title": "Test"})
    todo_id = todo_response.json()["id"]
    client.post("/api/timeentries", json={"todo_id": todo_id, "duration": 1500})
    
    # Delete todo
    client.delete(f"/api/todos/{todo_id}")
    
    # Verify time entries are gone
    response = client.get("/api/timeentries")
    assert len(response.json()) == 0


# ===== Settings Tests =====

def test_get_settings_creates_default(client):
    """Test that getting settings creates defaults if not exists"""
    response = client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert data["focus_duration"] == 25
    assert data["break_duration"] == 5
    assert data["id"] == 1


def test_update_settings(client):
    """Test updating pomodoro settings"""
    response = client.put(
        "/api/settings",
        json={"focus_duration": 30, "break_duration": 10}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["focus_duration"] == 30
    assert data["break_duration"] == 10


def test_update_settings_creates_if_not_exists(client):
    """Test that updating settings creates them if they don't exist"""
    response = client.put(
        "/api/settings",
        json={"focus_duration": 45, "break_duration": 15}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["focus_duration"] == 45
    assert data["break_duration"] == 15


def test_settings_are_singleton(client):
    """Test that only one settings record exists"""
    # Create/update settings multiple times
    client.put("/api/settings", json={"focus_duration": 20, "break_duration": 5})
    client.put("/api/settings", json={"focus_duration": 25, "break_duration": 5})
    client.put("/api/settings", json={"focus_duration": 30, "break_duration": 10})
    
    # Get settings
    response = client.get("/api/settings")
    data = response.json()
    assert data["id"] == 1  # Always ID 1
    assert data["focus_duration"] == 30  # Last update


# ===== Integration Tests =====

def test_full_workflow(client):
    """Test complete workflow: create project, todo, track time"""
    # 1. Create project
    project_response = client.post(
        "/api/projects",
        json={"name": "Website Redesign", "color": "indigo"}
    )
    project_id = project_response.json()["id"]
    
    # 2. Create todos
    todo1_response = client.post(
        "/api/todos",
        json={"project_id": project_id, "title": "Design mockups"}
    )
    todo1_id = todo1_response.json()["id"]
    
    todo2_response = client.post(
        "/api/todos",
        json={"project_id": project_id, "title": "Implement header"}
    )
    todo2_id = todo2_response.json()["id"]
    
    # 3. Track time
    client.post("/api/timeentries", json={"todo_id": todo1_id, "duration": 1500})
    client.post("/api/timeentries", json={"todo_id": todo1_id, "duration": 900})
    client.post("/api/timeentries", json={"todo_id": todo2_id, "duration": 2400})
    
    # 4. Update todo status
    client.patch(f"/api/todos/{todo1_id}", json={"status": "done"})
    
    # 5. Verify data
    projects = client.get("/api/projects").json()
    todos = client.get("/api/todos").json()
    entries = client.get("/api/timeentries").json()
    
    assert len(projects) == 1
    assert len(todos) == 2
    assert len(entries) == 3
    assert todos[0]["status"] == "done"
    
    # 6. Mark project as completed
    client.patch(f"/api/projects/{project_id}", json={"is_completed": True})
    project = client.get("/api/projects").json()[0]
    assert project["is_completed"] == True
