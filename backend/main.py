"""
FastAPI main application with CRUD endpoints
"""
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from pydantic import BaseModel

import models
from database import engine, get_db, Base

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Timetracking API")

# CORS with environment variable
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"CORS origins configured: {origins}")


# ===== Pydantic Schemas =====

class ProjectCreate(BaseModel):
    name: str
    color: str


class ProjectUpdate(BaseModel):
    is_completed: bool


class ProjectResponse(BaseModel):
    id: int
    name: str
    color: str
    is_completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class TodoCreate(BaseModel):
    project_id: int
    title: str


class TodoUpdate(BaseModel):
    status: str  # todo | in-progress | done


class TodoResponse(BaseModel):
    id: int
    project_id: int
    title: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class TimeEntryCreate(BaseModel):
    todo_id: int
    duration: int  # seconds


class TimeEntryResponse(BaseModel):
    id: int
    todo_id: int
    project_id: int
    duration: int
    timestamp: datetime

    class Config:
        from_attributes = True


class PomodoroSettingsUpdate(BaseModel):
    focus_duration: int
    break_duration: int


class PomodoroSettingsResponse(BaseModel):
    id: int
    focus_duration: int
    break_duration: int

    class Config:
        from_attributes = True


# ===== Projects Endpoints =====

@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(db: Session = Depends(get_db)):
    """Get all projects"""
    projects = db.query(models.Project).all()
    return projects


@app.post("/api/projects", response_model=ProjectResponse)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    """Create a new project"""
    db_project = models.Project(
        name=project.name,
        color=project.color
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@app.patch("/api/projects/{project_id}", response_model=ProjectResponse)
def update_project_status(project_id: int, project_update: ProjectUpdate, db: Session = Depends(get_db)):
    """Update project completion status"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.is_completed = 1 if project_update.is_completed else 0
    db.commit()
    db.refresh(project)
    return project


@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    """Delete a project (cascade deletes todos and time entries)"""
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


# ===== Todos Endpoints =====

@app.get("/api/todos", response_model=List[TodoResponse])
def get_todos(db: Session = Depends(get_db)):
    """Get all todos"""
    todos = db.query(models.Todo).all()
    return todos


@app.post("/api/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    """Create a new todo"""
    # Verify project exists
    project = db.query(models.Project).filter(models.Project.id == todo.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db_todo = models.Todo(
        project_id=todo.project_id,
        title=todo.title,
        status="todo"
    )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.patch("/api/todos/{todo_id}", response_model=TodoResponse)
def update_todo_status(todo_id: int, todo_update: TodoUpdate, db: Session = Depends(get_db)):
    """Update todo status (todo | in-progress | done)"""
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Validate status
    valid_statuses = ["todo", "in-progress", "done"]
    if todo_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    todo.status = todo_update.status
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """Delete a todo"""
    todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}


# ===== TimeEntries Endpoints =====

@app.get("/api/timeentries", response_model=List[TimeEntryResponse])
def get_time_entries(db: Session = Depends(get_db)):
    """Get all time entries"""
    entries = db.query(models.TimeEntry).all()
    return entries


@app.post("/api/timeentries", response_model=TimeEntryResponse)
def create_time_entry(entry: TimeEntryCreate, db: Session = Depends(get_db)):
    """Create a new time entry"""
    # Verify todo exists and get project_id
    todo = db.query(models.Todo).filter(models.Todo.id == entry.todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db_entry = models.TimeEntry(
        todo_id=entry.todo_id,
        project_id=todo.project_id,  # Backend calculates this
        duration=entry.duration
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


# ===== Settings Endpoints =====

@app.get("/api/settings", response_model=PomodoroSettingsResponse)
def get_settings(db: Session = Depends(get_db)):
    """Get pomodoro settings (creates default if not exists)"""
    settings = db.query(models.PomodoroSettings).filter(models.PomodoroSettings.id == 1).first()
    
    if not settings:
        # Create default settings
        settings = models.PomodoroSettings(
            id=1,
            focus_duration=25,
            break_duration=5
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings


@app.put("/api/settings", response_model=PomodoroSettingsResponse)
def update_settings(settings_update: PomodoroSettingsUpdate, db: Session = Depends(get_db)):
    """Update pomodoro settings"""
    settings = db.query(models.PomodoroSettings).filter(models.PomodoroSettings.id == 1).first()
    
    if not settings:
        # Create if doesn't exist
        settings = models.PomodoroSettings(id=1)
        db.add(settings)
    
    settings.focus_duration = settings_update.focus_duration
    settings.break_duration = settings_update.break_duration
    
    db.commit()
    db.refresh(settings)
    return settings


# ===== Health Check =====

@app.get("/")
def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "Timetracking API is running"}


# Note: StaticFiles mount will be added later for production
# app.mount("/", StaticFiles(directory="static", html=True), name="static")
