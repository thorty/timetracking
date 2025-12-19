# Implementation Plan: Fullstack Timetracking App

## Übersicht

**Ziel:** Neuentwicklung einer einfachen Timetracking-App mit Pomodoro-Timer

**Tech-Stack:**
- **Frontend:** React + Vite + TypeScript + TailwindCSS + React Router
- **Backend:** Python FastAPI + SQLite + SQLAlchemy
- **Deployment:** Docker Single-Container (FastAPI + SQLite)
- **Entwicklung:** Backend und Frontend separat, Docker am Schluss

**Architektur-Prinzipien:**
- Frontend: UI-Layer mit Timer-Logik und Stats-Aggregation
- Backend: Daten-API (CRUD + Rohdaten-Speicherung)
- Single-User, keine Authentication
- Nur lokale Nutzung
- So simpel wie möglich

---

## Step 1: Backend Foundation (FastAPI + SQLite)

### 1.1 Projekt-Setup

**Verzeichnisstruktur:**
```
backend/
├── main.py
├── models.py
├── database.py
├── requirements.txt
├── .env
└── static/          # Frontend-Build (nur in Production)
    └── (SvelteKit-Build wird hier kopiert)
```

**Dependencies (requirements.txt):**
```
fastapi
uvicorn[standard]
sqlalchemy
python-dotenv
```

**Zu implementieren:**
- `database.py`: SQLAlchemy-Setup mit SQLite-Connection
- `.env`: Database-Path-Konfiguration
- `main.py`: FastAPI-App mit CORS-Middleware

### 1.2 Datenmodelle

**Models (models.py):**

1. **Project**
   - `id` (Integer, Primary Key, Auto-Increment)
   - `name` (String, not null)
   - `color` (String, not null)
   - `is_completed` (Boolean, default=False)
   - `created_at` (DateTime, default=now)

2. **Todo**
   - `id` (Integer, Primary Key, Auto-Increment)
   - `project_id` (ForeignKey → Project)
   - `title` (String, not null)
   - `status` (String: "todo" | "in-progress" | "done")
   - `created_at` (DateTime, default=now)
   - Relationship: `project` (Many-to-One)

3. **TimeEntry**
   - `id` (Integer, Primary Key, Auto-Increment)
   - `todo_id` (ForeignKey → Todo)
   - `project_id` (ForeignKey → Project) *(denormalisiert für Stats)*
   - `duration` (Integer, Sekunden)
   - `timestamp` (DateTime, default=now)
   - Relationships: `todo`, `project`

4. **PomodoroSettings** (Singleton-Table)
   - `id` (Integer, Primary Key, immer 1)
   - `focus_duration` (Integer, Minuten, default=25)
   - `break_duration` (Integer, Minuten, default=5)

**Hinweise:**
- Cascade-Delete: Project → Todos → TimeEntries
- Backend generiert alle IDs (Auto-Increment)
- Keine Validierung von Color-Strings (Frontend entscheidet)

### 1.3 API-Endpoints

#### Projects
- `GET /api/projects` - Liste aller Projects (mit Relations zu Todos)
- `POST /api/projects` - Neues Project erstellen (`{name, color}`)
- `PATCH /api/projects/{id}` - Project-Status umschalten (`{is_completed: true/false}`)
- `DELETE /api/projects/{id}` - Project endgültig löschen (Cascade)

#### Todos
- `GET /api/todos` - Liste aller Todos (mit Project-Relation)
- `POST /api/todos` - Neues Todo erstellen (`{project_id, title}`)
- `PATCH /api/todos/{id}` - Todo-Status ändern (`{status: "todo" | "in-progress" | "done"}`)
- `DELETE /api/todos/{id}` - Todo endgültig löschen

#### TimeEntries
- `GET /api/timeentries` - Alle TimeEntries mit Project/Todo-Relations
- `POST /api/timeentries` - Neuer Entry (`{todo_id, duration}`)
  - Backend berechnet `project_id` aus `todo_id`
  - Backend setzt `timestamp` automatisch

#### Settings
- `GET /api/settings` - Aktuelle Pomodoro-Settings
- `PUT /api/settings` - Settings updaten (`{focus_duration, break_duration}`)
  - Wenn kein Setting existiert, wird Default erstellt

**CORS-Konfiguration:**
```python
allow_origins=["http://localhost:5173"]  # Nur für Entwicklung
```

**StaticFiles-Mount (für Production):**
```python
from fastapi.staticfiles import StaticFiles

# Am Ende nach allen API-Routes:
app.mount("/", StaticFiles(directory="static", html=True), name="static")
```

**Response-Format:**
```json
{
  "id": 1,
  "name": "Project Alpha",
  "color": "blue",
  "created_at": "2025-12-18T10:30:00",
  "todos": [...]
}
```

---
