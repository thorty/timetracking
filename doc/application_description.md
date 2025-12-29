# Timetracking App

## Introduction

A simple, lightweight web app for daily work.

## Features

- Organize projects and their tasks (CRUD operations).
- Pomodoro timeboxing to focus on work.
- Pomodoro time slots are configurable (default: 25 minutes focus work / 5 minutes break).
- Track time spent on tasks and projects.
- Dashboard for presenting statistics.
- Clear and simple responsive design.
- Displays minimalistic motivational phrases on the time tracking page.

## Design

This is a 3-page app:
1. Task selection and Pomodoro timeboxing.
2. Project and task orchestration.
3. Dashboard for statistics (e.g., time spent on projects, completed tasks, etc.).

Design prototype is located in the folder: `./Design_prototype`

## Technical Stack

- **Backend:**
    - Persistent storage: SQLite
    - Python FastAPI
- **Frontend:**
    - React

The full-stack app runs in a single Docker container.
