# Implementation Plan: Fullstack Timetracking App

## Übersicht

**Ziel:** Neuentwicklung einer einfachen Timetracking-App mit Pomodoro-Timer

**Tech-Stack:**
- **Frontend:** SvelteKit + TypeScript + TailwindCSS
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

## Step 2: Frontend Foundation (SvelteKit)

### 2.1 Projekt-Setup

**Commands:**
```bash
npm create svelte@latest frontend
# Choose: Skeleton project, TypeScript, ESLint, Prettier
cd frontend
npx svelte-add@latest tailwindcss
npm install
```

**Verzeichnisstruktur:**
```
frontend/
├── src/
│   ├── routes/
│   │   ├── +layout.svelte
│   │   ├── +page.svelte (TrackerPage)
│   │   ├── todos/+page.svelte
│   │   └── stats/+page.svelte
│   ├── lib/
│   │   ├── api.ts
│   │   ├── stores.ts
│   │   ├── utils.ts
│   │   └── components/
│   │       ├── Timer.svelte
│   │       ├── TodoSelector.svelte
│   │       ├── ProjectCard.svelte
│   │       └── ui/
│   │           ├── Button.svelte
│   │           ├── Card.svelte
│   │           ├── Input.svelte
│   │           └── Select.svelte
├── .env
└── svelte.config.js
```

**Environment (.env für Entwicklung):**
```
VITE_API_URL=http://localhost:8000
```

**Environment (Production):**
```
VITE_API_URL=/api
```

**Adapter-Konfiguration (svelte.config.js):**
```javascript
import adapter from '@sveltejs/adapter-static';
```

### 2.2 API-Service Layer

**lib/api.ts:**
```typescript
const BASE_URL = import.meta.env.VITE_API_URL;

// Generic fetch wrapper
async function api<T>(endpoint: string, options?: RequestInit): Promise<T>

// CRUD-Funktionen
export const projectsApi = { getAll, create, delete }
export const todosApi = { getAll, create, delete }
export const timeEntriesApi = { getAll, create }
export const settingsApi = { get, update }
```

**Error-Handling:**
- Bei Fehler: `console.error()` + `alert()` (MVP)
- Loading-States pro Operation

### 2.3 Svelte Stores (State Management)

**lib/stores.ts:**
```typescript
import { writable } from 'svelte/store';

export const projects = writable<Project[]>([]);
export const todos = writable<Todo[]>([]);
export const timeEntries = writable<TimeEntry[]>([]);
export const settings = writable<PomodoroSettings>({
  focus_duration: 25,
  break_duration: 5
});
export const isLoading = writable(false);
```

**Initialisierung in +layout.svelte:**
```typescript
onMount(async () => {
  const [proj, tod, entries, sett] = await Promise.all([
    projectsApi.getAll(),
    todosApi.getAll(),
    timeEntriesApi.getAll(),
    settingsApi.get()
  ]);
  projects.set(proj);
  todos.set(tod);
  timeEntries.set(entries);
  settings.set(sett);
});
```

### 2.4 Utilities & Constants

**lib/utils.ts:**
```typescript
// 15 Farben für Projects (identisch zu Design_prototype)
export const COLORS = [
  'slate', 'gray', 'zinc', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan',
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose'
];

// Zeit-Formatierung
export function formatDuration(seconds: number): string {
  // HH:MM:SS oder MM:SS
}

// Motivationssprüche
export const MOTIVATION_QUOTES = [
  "Focus on progress, not perfection.",
  "One pomodoro at a time.",
  "Deep work creates deep results.",
  // ... 10-15 Sprüche
];
```

---

## Step 3: Pages Implementation

### 3.1 Layout & Navigation

**routes/+layout.svelte:**
- Desktop: Fixed Sidebar (64px breit, wie Design_prototype/Sidebar.tsx)
- Mobile: Bottom Navigation Bar
- Navigation-Items: Timer, Todos, Stats
- Active-State mit Farbcodierung (Indigo)
- Logo/Brand: "FocusFlow"

### 3.2 TrackerPage (routes/+page.svelte)

**Features:**
1. **Timer-Component** (siehe 4.1)
2. **TodoSelector-Component** (siehe 4.2)
3. **Recent TimeEntries Liste** (letzte 10 Entries)
4. **Motivationsspruch** (zufällig bei Page-Load)

**Layout:**
```
┌─────────────────────────────────────┐
│ [Motivationsspruch]                 │
├─────────────────────────────────────┤
│         Timer (Circular)            │
│    ⏱️ 25:00 [Start] [Stop]          │
├─────────────────────────────────────┤
│ Select Task: [Dropdown]             │
├─────────────────────────────────────┤
│ Recent Activity:                    │
│ • Task A - 25min                    │
│ • Task B - 15min                    │
└─────────────────────────────────────┘
```

### 3.3 TodosPage (routes/todos/+page.svelte)

**Features:**
1. **Project-Grid** (responsive: 1/2/3 Columns)
2. **Create-Project-Form** (Name + Color-Picker)
3. **Filter-Toggle** ("Zeige erledigte Projects" - Checkbox)
4. **ProjectCard-Component** pro Project (siehe 4.3)

**ProjectCard-Content:**
- Project-Name mit Color-Badge
- "Erledigt"-Checkbox (togglet `is_completed`)
- Delete-Button für Project (endgültiges Löschen)
- Todo-Liste:
  - Active Todos (status: todo, in-progress)
  - Completed Todos (status: done)
- Inline-Add-Todo-Form
- Todo-Actions: Status-Toggle (todo → in-progress → done), Delete

**Filter-Logik:**
- Default: Nur aktive Projects anzeigen (`is_completed=false`)
- Mit Toggle: Alle Projects anzeigen

**Edit-Logic:**
- Project/Todo-Edit: Delete + Re-Add Pattern
- Inline-Form zeigt bei Edit aktuellen Wert

### 3.4 StatsPage (routes/stats/+page.svelte)

**Daten-Quelle:**
- Lädt `timeEntries` aus Store
- Frontend aggregiert alle Stats

**Widgets:**

1. **Stat-Cards (4 Stück):**
   - Total Time (Summe aller durations)
   - Average Session Duration
   - Active Projects Count
   - Most Productive Day (Weekday-Aggregation)

2. **Pie-Chart: Time by Project**
   - Gruppierung: `timeEntries` nach `project_id`
   - Summe pro Project
   - Farb-Codierung nach Project-Color

3. **Bar-Chart: Last 7 Days**
   - Gruppierung nach Datum (timestamp)
   - Summe pro Tag

**Charting:**
- Option 1: Eigene SVG-Implementation
- Option 2: Library wie `layerchart` oder `svelte-chartjs`

---

## Step 4: Core Components

### 4.1 Timer.svelte

**State (Component-Local):**
```typescript
let phase: 'focus' | 'break' = 'focus';
let timeLeft: number = 0; // Sekunden
let isRunning: boolean = false;
let isPaused: boolean = false;
let selectedTodoId: number | null = null;
let sessionStart: number = 0; // Timestamp
let accumulatedTime: number = 0; // Für Pause/Resume
```

**Timer-Logik:**
```typescript
// Start
function startTimer() {
  sessionStart = Date.now();
  accumulatedTime = 0;
  isRunning = true;
  // setInterval: reduziert timeLeft jede Sekunde
}

// Pause
function pauseTimer() {
  isPaused = true;
  accumulatedTime += Date.now() - sessionStart;
}

// Resume
function resumeTimer() {
  sessionStart = Date.now();
  isPaused = false;
}

// Stop
async function stopTimer() {
  const totalDuration = accumulatedTime + (Date.now() - sessionStart);
  const durationMinutes = totalDuration / 1000 / 60;
  
  // Validierung: ≥5 Minuten?
  if (durationMinutes >= 5) {
    await timeEntriesApi.create({
      todo_id: selectedTodoId,
      duration: Math.floor(totalDuration / 1000)
    });
    // Reload timeEntries store
  } else {
    alert('Session zu kurz (min. 5 Minuten)');
  }
  
  resetTimer();
}
```

**UI:**
- Circular Progress Ring (SVG, wie Design_prototype/Timer.tsx)
- Phase-Label (Focus/Break) mit Farbcodierung
- Time-Display (MM:SS)
- Buttons: Start/Pause, Stop, Reset, Switch Phase
- Disabled wenn kein Todo selektiert

**Notification:**
```typescript
function onTimerEnd() {
  if (Notification.permission === 'granted') {
    new Notification('Pomodoro beendet!', {
      body: phase === 'focus' ? 'Zeit für eine Pause' : 'Zurück zur Arbeit'
    });
  }
  // Auto-Switch zu nächster Phase
}
```

### 4.2 TodoSelector.svelte

**Props:**
```typescript
export let selectedTodoId: number | null;
export let onSelect: (id: number) => void;
export let disabled: boolean = false;
```

**UI:**
- Grouped Select nach Projects
- Optionen: "Projekt A → Task 1, Task 2"
- Empty-State wenn keine Todos
- Disabled während Timer läuft

### 4.3 ProjectCard.svelte

**Props:**
```typescript
export let project: Project;
export let todos: Todo[]; // gefiltert nach project_id
```

**Features:**
- Project-Header: Name + Color-Badge + Delete-Button
- Todo-Liste (2 Sektionen):
  - Active (status ≠ done)
  - Completed (status = done)
- Todo-Item:
  - Checkbox für Status-Toggle (todo → in-progress → done → todo)
  - Titel
  - Delete-Button
- Add-Todo-Form (inline, toggle-bar)

**Styling:**
- Card-Component (ui/Card.svelte)
- Color-Badge: `bg-${project.color}-500`
- Responsive Grid-Layout

---

## Step 5: UI-Components Library

### Design-Vorgaben (aus Design_prototype)

**Farbpalette:**
- Primary: Indigo (600, 500, 400)
- Neutral: Slate (900, 700, 500, 300, 200, 100)
- Success: Emerald
- Danger: Red

**Spacing:** Tailwind-Standard (4px-Units)
**Border-Radius:** `rounded-lg`, `rounded-xl`
**Shadows:** `shadow-sm`, `shadow-md`

### 5.1 Button.svelte

**Variants:**
- `default` (Indigo)
- `outline` (Border + Transparent)
- `ghost` (No Border)
- `destructive` (Red)
- `secondary` (Slate)

**Sizes:** `sm`, `md`, `lg`, `icon`

**Props:**
```typescript
export let variant: 'default' | 'outline' | 'ghost' | 'destructive' | 'secondary' = 'default';
export let size: 'sm' | 'md' | 'lg' | 'icon' = 'md';
export let disabled: boolean = false;
```

### 5.2 Card.svelte

**Slots:**
- `header` (optional)
- `default` (content)

**CSS:**
```svelte
<div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
  {#if $$slots.header}
    <div class="mb-4">
      <slot name="header" />
    </div>
  {/if}
  <slot />
</div>
```

### 5.3 Input.svelte

**Props:**
```typescript
export let type: string = 'text';
export let value: string = '';
export let placeholder: string = '';
export let label: string = '';
```

**Features:**
- Label + Input
- Error-State (border-red)
- Focus-Ring (Indigo)

### 5.4 Select.svelte

**Native Select mit Custom-Styling:**
```svelte
<select class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500">
  <slot />
</select>
```

---

## Step 6: Docker Deployment

**Architektur:** FastAPI serviert Frontend-Build + API (kein nginx nötig!)

### 6.1 Multi-Stage Dockerfile

```dockerfile
# Stage 1: Frontend-Build
FROM node:20 AS frontend-builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Production
FROM python:3.11-slim
WORKDIR /app

# Python-Dependencies installieren
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend-Code kopieren
COPY backend/ .

# Frontend-Build in static/ kopieren
COPY --from=frontend-builder /app/build ./static

# SQLite-Daten-Verzeichnis
RUN mkdir -p /data

# Port exponieren
EXPOSE 8000

# FastAPI starten
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 6.2 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      args:
        VITE_API_URL: /api
    ports:
      - "8000:8000"
    volumes:
      - sqlite-data:/data
    environment:
      - DATABASE_URL=sqlite:///data/timetracking.db

volumes:
  sqlite-data:
```

**Hinweise:**
- Ein Service, ein Port (8000)
- FastAPI serviert Frontend unter `/` und API unter `/api`
- SQLite-Volume für Persistenz
- Kein nginx, kein zusätzlicher Webserver

---

## Development Workflow

### Phase 1: Backend-Entwicklung
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Test mit curl/Postman:**
- Alle Endpoints testen
- Datenbank-File prüfen

### Phase 2: Frontend-Entwicklung
```bash
cd frontend
npm install
npm run dev
```

**Browser:** `http://localhost:5173`

### Phase 3: Integration-Testing
- Backend auf Port 8000
- Frontend auf Port 5173
- `.env` mit `VITE_API_URL=http://localhost:8000`

### Phase 4: Docker-Build
```bash
docker compose build
docker compose up
```

**Browser:** `http://localhost:8000`

**Hinweis:** Im Docker-Container serviert FastAPI Frontend und API auf Port 8000

---

## Checkliste: Features

### Must-Have (MVP)
- [ ] Projects: Create, Delete, List
- [ ] Todos: Create, Delete, List, Status-Toggle
- [ ] Timer: Focus/Break-Phasen mit Countdown
- [ ] Timer: Start/Pause/Stop mit ≥5min-Validation
- [ ] TimeEntries: Automatisches Speichern bei Timer-Stop
- [ ] Settings: Pomodoro-Duration konfigurierbar
- [ ] Stats: Total Time, Avg Session, Time by Project, Last 7 Days
- [ ] Responsive Design (Mobile + Desktop)
- [ ] Motivationssprüche auf TrackerPage
- [ ] Browser-Notifications bei Timer-Ende

### Nice-to-Have (Post-MVP)
- [ ] Edit-Funktionen (statt Delete+Re-Add)
- [ ] Todo estimated_time mit Progress-Bar
- [ ] Export TimeEntries (CSV)
- [ ] Dark Mode
- [ ] Keyboard Shortcuts
- [ ] Toast-Notification-System
- [ ] Drag & Drop für Todo-Reordering

---

## Nächste Schritte

1. **Backend implementieren** (Step 1)
   - Models definieren
   - Endpoints implementieren
   - CORS konfigurieren

2. **Frontend aufsetzen** (Step 2)
   - SvelteKit-Projekt erstellen
   - API-Service implementieren
   - Stores einrichten

3. **UI-Components** (Step 5)
   - Button, Card, Input, Select
   - ProjectCard, Timer, TodoSelector

4. **Pages** (Step 3)
   - TrackerPage mit Timer
   - TodosPage mit Project-Management
   - StatsPage mit Charts

5. **Docker** (Step 6)
   - Combined Dockerfile
   - docker-compose.yml
   - Testing

---

**Hinweis:** Dieser Plan ist iterativ umsetzbar. Jeder Step kann einzeln entwickelt und getestet werden, bevor der nächste beginnt.
