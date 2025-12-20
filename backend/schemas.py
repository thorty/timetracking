"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, validator
from datetime import datetime
from typing import Optional


# ===== User Schemas =====

class UserCreate(BaseModel):
    """Schema for user registration"""
    username: str
    password: str
    
    @validator('username')
    def username_min_length(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters')
        return v
    
    @validator('password')
    def password_min_length(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters')
        return v


class UserLogin(BaseModel):
    """Schema for user login"""
    username: str
    password: str


class UserResponse(BaseModel):
    """Schema for user response (without password)"""
    id: int
    username: str
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    """Schema for JWT token response"""
    access_token: str
    token_type: str


class TokenData(BaseModel):
    """Schema for decoded token data"""
    username: Optional[str] = None


# ===== Project Schemas =====

class ProjectBase(BaseModel):
    """Base project schema"""
    name: str
    color: str


class ProjectCreate(ProjectBase):
    """Schema for creating a project"""
    pass


class ProjectUpdate(BaseModel):
    """Schema for updating a project"""
    name: Optional[str] = None
    color: Optional[str] = None
    is_completed: Optional[bool] = None


class ProjectResponse(ProjectBase):
    """Schema for project response"""
    id: int
    is_completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# ===== Todo Schemas =====

class TodoBase(BaseModel):
    """Base todo schema"""
    title: str
    project_id: int


class TodoCreate(TodoBase):
    """Schema for creating a todo"""
    pass


class TodoUpdate(BaseModel):
    """Schema for updating a todo"""
    title: Optional[str] = None
    status: Optional[str] = None


class TodoResponse(TodoBase):
    """Schema for todo response"""
    id: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True


# ===== TimeEntry Schemas =====

class TimeEntryCreate(BaseModel):
    """Schema for creating a time entry"""
    todo_id: int
    project_id: Optional[int] = None
    duration: int  # seconds


class TimeEntryResponse(BaseModel):
    """Schema for time entry response"""
    id: int
    todo_id: int
    project_id: int
    duration: int
    timestamp: datetime
    
    class Config:
        from_attributes = True


# ===== PomodoroSettings Schemas =====

class PomodoroSettingsUpdate(BaseModel):
    """Schema for updating pomodoro settings"""
    focus_duration: Optional[int] = None
    break_duration: Optional[int] = None


class PomodoroSettingsResponse(BaseModel):
    """Schema for pomodoro settings response"""
    id: int
    focus_duration: int
    break_duration: int
    
    class Config:
        from_attributes = True
