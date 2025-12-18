"""
SQLAlchemy models for the timetracking application
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Project(Base):
    """Project model - represents a work project"""
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    color = Column(String, nullable=False)
    is_completed = Column(Integer, default=0)  # SQLite: 0=False, 1=True
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    todos = relationship("Todo", back_populates="project", cascade="all, delete-orphan")
    time_entries = relationship("TimeEntry", back_populates="project", cascade="all, delete-orphan")


class Todo(Base):
    """Todo model - represents a task within a project"""
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    status = Column(String, default="todo")  # todo | in-progress | done
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="todos")
    time_entries = relationship("TimeEntry", back_populates="todo", cascade="all, delete-orphan")


class TimeEntry(Base):
    """TimeEntry model - tracks time spent on a todo"""
    __tablename__ = "time_entries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    todo_id = Column(Integer, ForeignKey("todos.id", ondelete="CASCADE"), nullable=False)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    duration = Column(Integer, nullable=False)  # Duration in seconds
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    todo = relationship("Todo", back_populates="time_entries")
    project = relationship("Project", back_populates="time_entries")


class PomodoroSettings(Base):
    """PomodoroSettings model - singleton table for timer configuration"""
    __tablename__ = "pomodoro_settings"

    id = Column(Integer, primary_key=True)  # Always 1
    focus_duration = Column(Integer, default=25)  # Minutes
    break_duration = Column(Integer, default=5)   # Minutes
