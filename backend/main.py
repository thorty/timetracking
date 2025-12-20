"""
FastAPI main application with CRUD endpoints
"""
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

import models
import schemas
from database import engine, get_db, Base
from auth import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES

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


# ===== Auth Endpoints =====

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username already exists
    existing_user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = models.User.hash_password(user_data.password)
    new_user = models.User(
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    logger.info(f"New user registered: {user_data.username}")
    return new_user


@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login and get JWT token"""
    user = db.query(models.User).filter(models.User.username == user_data.username).first()
    if not user or not user.verify_password(user_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    logger.info(f"User logged in: {user.username}")
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    """Get current authenticated user"""
    return current_user


# ===== Projects Endpoints =====

@app.get("/api/projects", response_model=List[schemas.ProjectResponse])
def get_projects(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all projects for current user"""
    projects = db.query(models.Project).filter(models.Project.user_id == current_user.id).all()
    return projects


@app.post("/api/projects", response_model=schemas.ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: schemas.ProjectCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new project"""
    db_project = models.Project(
        user_id=current_user.id,
        name=project.name,
        color=project.color
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@app.patch("/api/projects/{project_id}", response_model=schemas.ProjectResponse)
def update_project_status(
    project_id: int,
    project_update: schemas.ProjectUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update project completion status"""
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if project_update.is_completed is not None:
        project.is_completed = 1 if project_update.is_completed else 0
    if project_update.name is not None:
        project.name = project_update.name
    if project_update.color is not None:
        project.color = project_update.color
        
    db.commit()
    db.refresh(project)
    return project


@app.delete("/api/projects/{project_id}")
def delete_project(
    project_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a project (cascade deletes todos and time entries)"""
    project = db.query(models.Project).filter(
        models.Project.id == project_id,
        models.Project.user_id == current_user.id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully"}


# ===== Todos Endpoints =====

@app.get("/api/todos", response_model=List[schemas.TodoResponse])
def get_todos(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all todos for current user's projects"""
    todos = db.query(models.Todo).join(models.Project).filter(
        models.Project.user_id == current_user.id
    ).all()
    return todos


@app.post("/api/todos", response_model=schemas.TodoResponse, status_code=status.HTTP_201_CREATED)
def create_todo(
    todo: schemas.TodoCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new todo"""
    # Verify project exists and belongs to user
    project = db.query(models.Project).filter(
        models.Project.id == todo.project_id,
        models.Project.user_id == current_user.id
    ).first()
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


@app.patch("/api/todos/{todo_id}", response_model=schemas.TodoResponse)
def update_todo_status(
    todo_id: int,
    todo_update: schemas.TodoUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update todo status (todo | in-progress | done)"""
    todo = db.query(models.Todo).join(models.Project).filter(
        models.Todo.id == todo_id,
        models.Project.user_id == current_user.id
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    if todo_update.status:
        # Validate status
        valid_statuses = ["todo", "in-progress", "done"]
        if todo_update.status not in valid_statuses:
            raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
        todo.status = todo_update.status
    
    if todo_update.title:
        todo.title = todo_update.title
    
    db.commit()
    db.refresh(todo)
    return todo


@app.delete("/api/todos/{todo_id}")
def delete_todo(
    todo_id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a todo"""
    todo = db.query(models.Todo).join(models.Project).filter(
        models.Todo.id == todo_id,
        models.Project.user_id == current_user.id
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    db.delete(todo)
    db.commit()
    return {"message": "Todo deleted successfully"}


# ===== TimeEntries Endpoints =====

@app.get("/api/timeentries", response_model=List[schemas.TimeEntryResponse])
def get_time_entries(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all time entries for current user"""
    entries = db.query(models.TimeEntry).filter(
        models.TimeEntry.user_id == current_user.id
    ).all()
    return entries


@app.post("/api/timeentries", response_model=schemas.TimeEntryResponse, status_code=status.HTTP_201_CREATED)
def create_time_entry(
    entry: schemas.TimeEntryCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new time entry"""
    # Verify todo exists and belongs to user
    todo = db.query(models.Todo).join(models.Project).filter(
        models.Todo.id == entry.todo_id,
        models.Project.user_id == current_user.id
    ).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    
    # Use provided project_id or get it from the todo
    project_id = entry.project_id if entry.project_id is not None else todo.project_id
    
    db_entry = models.TimeEntry(
        user_id=current_user.id,
        todo_id=entry.todo_id,
        project_id=project_id,
        duration=entry.duration
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry


# ===== Settings Endpoints =====

@app.get("/api/settings", response_model=schemas.PomodoroSettingsResponse)
def get_settings(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get pomodoro settings for current user (creates default if not exists)"""
    settings = db.query(models.PomodoroSettings).filter(
        models.PomodoroSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create default settings for user
        settings = models.PomodoroSettings(
            user_id=current_user.id,
            focus_duration=25,
            break_duration=5
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings


@app.put("/api/settings", response_model=schemas.PomodoroSettingsResponse)
def update_settings(
    settings_update: schemas.PomodoroSettingsUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update pomodoro settings for current user"""
    settings = db.query(models.PomodoroSettings).filter(
        models.PomodoroSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create if doesn't exist
        settings = models.PomodoroSettings(user_id=current_user.id)
        db.add(settings)
    
    if settings_update.focus_duration is not None:
        settings.focus_duration = settings_update.focus_duration
    if settings_update.break_duration is not None:
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
