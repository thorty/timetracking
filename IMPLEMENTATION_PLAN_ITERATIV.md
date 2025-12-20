# Timetracking App - Iterativer Implementierungsplan

## Tech Stack

**Backend:** FastAPI + SQLite + SQLAlchemy  
**Frontend:** React 18 + Vite + TypeScript + **CSS Modules**  
**Icons:** lucide-react  
**Animations:** framer-motion  
**Routing:** React Router v6

---

## Prinzip: Iterative Feature-Entwicklung

Jede Phase implementiert ein **komplettes Feature** (Backend + Frontend) und ist **einzeln testbar**.

✅ **Phase abgeschlossen** = Feature funktioniert im Browser  
✅ Kein "Backend fertig, dann Frontend" - sondern Feature für Feature  
✅ Nach jeder Phase: App läuft und ist testbar

---

## Phase 0: Projekt-Setup ✅ (bereits fertig)

**Status:** Backend läuft bereits auf Port 8000

**Verifikation:**
```bash
curl http://localhost:8000/api/projects
# Should return: []
```

---

## Phase 1: Frontend-Setup + Base Components

**Ziel:** Leere React-App läuft mit Routing, Layout und UI-Komponenten

### 1.1 Neues Frontend erstellen

```bash
# Altes Frontend löschen
rm -rf frontend

# Neues React-Projekt mit Vite
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
npm install react-router-dom lucide-react
```

### 1.2 Ordnerstruktur erstellen

```
frontend/src/
├── main.tsx
├── App.tsx
├── App.module.css
├── index.css
├── pages/
├── components/
│   ├── Layout.tsx
│   ├── Layout.module.css
│   └── ui/
│       ├── Button.tsx
│       ├── Button.module.css
│       ├── Card.tsx
│       ├── Card.module.css
│       ├── Input.tsx
│       ├── Input.module.css
│       ├── Select.tsx
│       └── Select.module.css
├── context/
├── lib/
└── types/
```

### 1.3 Environment Variable (.env)

**frontend/.env:**
```
VITE_API_URL=http://localhost:8000/api
```

### 1.4 Entry Point (src/main.tsx)

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 1.5 Global CSS (src/index.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8fafc;
  color: #0f172a;
  line-height: 1.5;
}

button {
  font-family: inherit;
  cursor: pointer;
}

input, select, textarea {
  font-family: inherit;
}
```

### 1.6 Button Component

**components/ui/Button.tsx:**
```typescript
import { forwardRef, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    const classes = `${styles.btn} ${styles[variant]} ${styles[size]} ${className || ''}`;
    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
```

**components/ui/Button.module.css:**
```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
}

.btn:focus-visible {
  outline: 2px solid #94a3b8;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.primary {
  background: #0f172a;
  color: white;
}

.primary:hover:not(:disabled) {
  background: #1e293b;
}

.secondary {
  background: #f1f5f9;
  color: #0f172a;
}

.secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.outline {
  border: 1px solid #e2e8f0;
  background: transparent;
  color: #0f172a;
}

.outline:hover:not(:disabled) {
  background: #f8fafc;
}

.ghost {
  background: transparent;
  color: #64748b;
}

.ghost:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
}

.destructive {
  background: #ef4444;
  color: white;
}

.destructive:hover:not(:disabled) {
  background: #dc2626;
}

.sm {
  height: 2rem;
  padding: 0 0.75rem;
  font-size: 0.75rem;
}

.md {
  height: 2.5rem;
  padding: 0 1rem;
}

.lg {
  height: 3rem;
  padding: 0 2rem;
  font-size: 1.125rem;
}

.icon {
  height: 2.5rem;
  width: 2.5rem;
  padding: 0.5rem;
}
```

### 1.7 Card Component

**components/ui/Card.tsx:**
```typescript
import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return <div className={`${styles.card} ${className || ''}`}>{children}</div>;
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={`${styles.header} ${className || ''}`}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h3 className={`${styles.title} ${className || ''}`}>{children}</h3>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`${styles.content} ${className || ''}`}>{children}</div>;
}
```

**components/ui/Card.module.css:**
```css
.card {
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.header {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  padding: 1.5rem;
}

.title {
  font-weight: 600;
  line-height: 1;
}

.content {
  padding: 1.5rem;
  padding-top: 0;
}
```

### 1.8 Input Component

**components/ui/Input.tsx:**
```typescript
import { forwardRef, InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`${styles.input} ${error ? styles.error : ''} ${className || ''}`}
          {...props}
        />
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
```

**components/ui/Input.module.css:**
```css
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.input {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0 0.75rem;
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #94a3b8;
  border-color: transparent;
}

.input:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.input::placeholder {
  color: #94a3b8;
}

.input.error {
  border-color: #ef4444;
}

.input.error:focus {
  box-shadow: 0 0 0 2px #ef4444;
}

.errorText {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
}
```

### 1.9 Select Component

**components/ui/Select.tsx:**
```typescript
import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.selectWrapper}>
          <select
            id={selectId}
            ref={ref}
            className={`${styles.select} ${error ? styles.error : ''} ${className || ''}`}
            {...props}
          >
            {children}
          </select>
          <div className={styles.chevron}>
            <svg className={styles.chevronIcon} viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
```

**components/ui/Select.module.css:**
```css
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.selectWrapper {
  position: relative;
}

.select {
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background: white;
  padding: 0 0.75rem;
  padding-right: 2.5rem;
  font-size: 0.875rem;
  appearance: none;
}

.select:focus {
  outline: none;
  box-shadow: 0 0 0 2px #94a3b8;
  border-color: transparent;
}

.select:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.select.error {
  border-color: #ef4444;
}

.chevron {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 0.75rem;
  pointer-events: none;
  color: #64748b;
}

.chevronIcon {
  width: 1rem;
  height: 1rem;
}

.errorText {
  font-size: 0.75rem;
  color: #ef4444;
  font-weight: 500;
}
```

### 1.10 App.tsx + Layout (Phase 1 Version)

**App.tsx:**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<div className={styles.placeholder}>Tracker Page</div>} />
          <Route path="/todos" element={<div className={styles.placeholder}>Todos Page</div>} />
          <Route path="/stats" element={<div className={styles.placeholder}>Stats Page</div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
```

**App.module.css:**
```css
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50vh;
  font-size: 2rem;
  color: #94a3b8;
}
```

**components/Layout.tsx:**
```typescript
import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, CheckSquare, BarChart3 } from 'lucide-react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Clock size={24} />
          <span>Timetracker</span>
        </div>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Clock size={20} />
            <span>Tracker</span>
          </NavLink>
          <NavLink 
            to="/todos" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <CheckSquare size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink 
            to="/stats" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <Clock size={24} />
          <span>Tracker</span>
        </NavLink>
        <NavLink 
          to="/todos" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <CheckSquare size={24} />
          <span>Projects</span>
        </NavLink>
        <NavLink 
          to="/stats" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <BarChart3 size={24} />
          <span>Stats</span>
        </NavLink>
      </nav>
    </div>
  );
}
```

**components/Layout.module.css:**
```css
.layout {
  display: flex;
  min-height: 100vh;
}

/* Desktop Sidebar */
.sidebar {
  width: 16rem;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 2rem;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.navLink {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: #64748b;
  text-decoration: none;
  transition: all 0.2s;
}

.navLink:hover {
  background: #f8fafc;
  color: #0f172a;
}

.navLink.active {
  background: #6366f1;
  color: white;
}

/* Main Content */
.main {
  flex: 1;
  padding: 2rem;
  padding-bottom: 5rem; /* Space for mobile nav */
}

/* Mobile Bottom Navigation */
.mobileNav {
  display: none;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main {
    padding: 1rem;
  }

  .mobileNav {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    background: white;
    border-top: 1px solid #e2e8f0;
    padding: 0.5rem;
    z-index: 50;
  }

  .mobileLink {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem;
    color: #64748b;
    text-decoration: none;
    font-size: 0.75rem;
  }

  .mobileLink.active {
    color: #6366f1;
  }
}
```

### 1.11 Vite Config

**vite.config.ts:**
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
});
```

**Wichtig:** TypeScript muss den `@`-Alias kennen. Ergänze in **tsconfig.json**:

```json
{
  "compilerOptions": {
    // ... existing config
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 1.12 Test Phase 1

```bash
cd frontend
npm run dev
```

**Browser:** http://localhost:5173

✅ **Erwartung:**
- Layout mit Sidebar sichtbar
- Navigation zwischen Tracker/Projects/Stats funktioniert
- Placeholder-Texte werden angezeigt
- Mobile: Bottom Navigation sichtbar

---

## Phase 2: Projects Feature (Backend + Frontend)

**Ziel:** Projekte erstellen, anzeigen, löschen

**Wichtig:** Phase 1 muss abgeschlossen sein (Layout funktioniert, Placeholder sichtbar)

### 2.1 TypeScript Types

**types/index.ts:**
```typescript
export interface Project {
  id: number;
  name: string;
  color: string;
  is_completed: boolean;
  created_at: string;
}

export interface Todo {
  id: number;
  project_id: number;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  created_at: string;
}

export interface TimeEntry {
  id: number;
  todo_id: number;
  project_id: number;
  duration: number;
  timestamp: string;
}

export interface PomodoroSettings {
  id?: number;
  focus_duration: number;
  break_duration: number;
}
```

### 2.2 API Service

**lib/api.ts:**
```typescript
import type { Project, Todo, TimeEntry, PomodoroSettings } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
}

export const api = {
  projects: {
    getAll: () => fetchApi<Project[]>('/projects'),
    create: (data: { name: string; color: string }) => 
      fetchApi<Project>('/projects', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    delete: (id: number) => 
      fetchApi<void>(`/projects/${id}`, { method: 'DELETE' }),
  },
  todos: {
    getAll: () => fetchApi<Todo[]>('/todos'),
    create: (data: { title: string; project_id: number; status: string }) =>
      fetchApi<Todo>('/todos', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
    update: (id: number, data: Partial<Omit<Todo, 'id' | 'created_at'>>) =>
      fetchApi<Todo>(`/todos/${id}`, { 
        method: 'PATCH', 
        body: JSON.stringify(data) 
      }),
    delete: (id: number) =>
      fetchApi<void>(`/todos/${id}`, { method: 'DELETE' }),
  },
  timeEntries: {
    getAll: () => fetchApi<TimeEntry[]>('/time-entries'),
    create: (data: { todo_id: number; duration: number }) =>
      fetchApi<TimeEntry>('/time-entries', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
  },
  pomodoroSettings: {
    get: () => fetchApi<PomodoroSettings>('/settings/pomodoro'),
    update: (data: PomodoroSettings) =>
      fetchApi<PomodoroSettings>('/settings/pomodoro', { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }),
  },
};
```

### 2.3 Utils

**lib/utils.ts:**
```typescript
export const COLORS = [
  { name: 'slate', hex: '#64748b' },
  { name: 'red', hex: '#ef4444' },
  { name: 'orange', hex: '#f97316' },
  { name: 'amber', hex: '#f59e0b' },
  { name: 'yellow', hex: '#eab308' },
  { name: 'lime', hex: '#84cc16' },
  { name: 'green', hex: '#22c55e' },
  { name: 'emerald', hex: '#10b981' },
  { name: 'teal', hex: '#14b8a6' },
  { name: 'cyan', hex: '#06b6d4' },
  { name: 'sky', hex: '#0ea5e9' },
  { name: 'blue', hex: '#3b82f6' },
  { name: 'indigo', hex: '#6366f1' },
  { name: 'violet', hex: '#8b5cf6' },
  { name: 'purple', hex: '#a855f7' },
  { name: 'fuchsia', hex: '#d946ef' },
  { name: 'pink', hex: '#ec4899' },
  { name: 'rose', hex: '#f43f5e' },
];

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatMinutes(minutes: number): string {
  return `${minutes} min`;
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}
```

### 2.4 React Context

**context/StoreContext.tsx:**
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/lib/api';
import type { Project, Todo, TimeEntry, PomodoroSettings } from '@/types';

interface StoreContextType {
  projects: Project[];
  todos: Todo[];
  timeEntries: TimeEntry[];
  pomodoroSettings: PomodoroSettings;
  refreshProjects: () => Promise<void>;
  refreshTodos: () => Promise<void>;
  refreshTimeEntries: () => Promise<void>;
  refreshPomodoroSettings: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>({
    focus_duration: 25,
    break_duration: 5,
  });

  const refreshProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const refreshTodos = async () => {
    try {
      const data = await api.todos.getAll();
      setTodos(data);
    } catch (error) {
      console.error('Failed to fetch todos:', error);
    }
  };

  const refreshTimeEntries = async () => {
    try {
      const data = await api.timeEntries.getAll();
      setTimeEntries(data);
    } catch (error) {
      console.error('Failed to fetch time entries:', error);
    }
  };

  const refreshPomodoroSettings = async () => {
    try {
      const data = await api.pomodoroSettings.get();
      setPomodoroSettings(data);
    } catch (error) {
      console.error('Failed to fetch pomodoro settings:', error);
    }
  };

  useEffect(() => {
    refreshProjects();
    refreshTodos();
    refreshTimeEntries();
    refreshPomodoroSettings();
  }, []);

  return (
    <StoreContext.Provider
      value={{
        projects,
        todos,
        timeEntries,
        pomodoroSettings,
        refreshProjects,
        refreshTodos,
        refreshTimeEntries,
        refreshPomodoroSettings,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
```

### 2.5 App.tsx Update (Phase 2 Version)

**WICHTIG:** Ersetze die Phase 1 Version von App.tsx mit dieser:

**App.tsx (VOLLSTÄNDIG - ersetzt alte Version):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import TodosPage from './pages/TodosPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<div className={styles.placeholder}>Tracker Page</div>} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/stats" element={<div className={styles.placeholder}>Stats Page</div>} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
```

### 2.6 TodosPage

**pages/TodosPage.tsx:**
```typescript
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { COLORS } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import ProjectCard from '@/components/ProjectCard';
import styles from './TodosPage.module.css';

export default function TodosPage() {
  const { projects, refreshProjects } = useStore();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState('indigo');

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      await api.projects.create({
        name: newProjectName,
        color: selectedColor,
      });
      await refreshProjects();
      setNewProjectName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create project:', error);
      alert('Failed to create project');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Projects & Tasks</h1>
          <p className={styles.subtitle}>Organize your work into projects</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Plus size={20} />
          New Project
        </Button>
      </div>

      {/* Create Project Form */}
      {showCreateForm && (
        <Card className={styles.createForm}>
          <form onSubmit={handleCreateProject}>
            <Input
              autoFocus
              label="Project Name"
              placeholder="e.g. Personal, Work, Study..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            
            <div className={styles.colorPicker}>
              <label className={styles.colorLabel}>Color</label>
              <div className={styles.colorGrid}>
                {COLORS.map((color) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`${styles.colorButton} ${
                      selectedColor === color.name ? styles.selected : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color.name)}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className={styles.formActions}>
              <Button type="submit">Create Project</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className={styles.empty}>
          <p>No projects yet. Create your first project to get started!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
```

**pages/TodosPage.module.css:**
```css
.page {
  max-width: 80rem;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #64748b;
}

.createForm {
  margin-bottom: 2rem;
  padding: 1.5rem;
}

.createForm form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.colorPicker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.colorLabel {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.colorGrid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(2.5rem, 1fr));
  gap: 0.5rem;
}

.colorButton {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.colorButton:hover {
  transform: scale(1.1);
}

.colorButton.selected {
  border-color: #0f172a;
  box-shadow: 0 0 0 3px rgba(15, 23, 42, 0.1);
}

.formActions {
  display: flex;
  gap: 0.75rem;
}

.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #94a3b8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### 2.7 ProjectCard Component

**components/ProjectCard.tsx:**
```typescript
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { COLORS } from '@/lib/utils';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import type { Project } from '@/types';
import Button from './ui/Button';
import Input from './ui/Input';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const { todos, refreshTodos, refreshProjects } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const projectTodos = todos.filter(t => t.project_id === project.id);
  const activeTodos = projectTodos.filter(t => t.status !== 'done');
  const completedTodos = projectTodos.filter(t => t.status === 'done');

  const colorHex = COLORS.find(c => c.name === project.color)?.hex || '#6366f1';

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      await api.todos.create({
        title: newTodoTitle,
        project_id: project.id,
        status: 'todo',
      });
      await refreshTodos();
      setNewTodoTitle('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to create todo:', error);
    }
  };

  const handleToggleTodo = async (todoId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'done' ? 'todo' : 'done';
    try {
      await api.todos.update(todoId, { status: nextStatus });
      await refreshTodos();
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.todos.delete(todoId);
      await refreshTodos();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm(`Delete project "${project.name}" and all its tasks?`)) return;
    try {
      await api.projects.delete(project.id);
      await refreshProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  return (
    <div className={styles.card}>
      {/* Color Stripe */}
      <div className={styles.colorStripe} style={{ backgroundColor: colorHex }} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{project.name}</h3>
          <span className={styles.badge}>{activeTodos.length} active</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={styles.deleteBtn}
          onClick={handleDeleteProject}
          title="Delete Project"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {/* Todo List */}
      <div className={styles.content}>
        <div className={styles.todoList}>
          {projectTodos.length === 0 && (
            <p className={styles.empty}>No tasks yet</p>
          )}

          {/* Active Todos */}
          {activeTodos.map(todo => (
            <div key={todo.id} className={styles.todoItem}>
              <button
                onClick={() => handleToggleTodo(todo.id, todo.status)}
                className={styles.checkbox}
              >
                <Circle size={20} />
              </button>
              <span className={styles.todoText}>{todo.title}</span>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className={styles.todoDelete}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div className={styles.completedSection}>
              <p className={styles.sectionTitle}>Completed</p>
              {completedTodos.map(todo => (
                <div key={todo.id} className={`${styles.todoItem} ${styles.completed}`}>
                  <button
                    onClick={() => handleToggleTodo(todo.id, todo.status)}
                    className={styles.checkbox}
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <span className={styles.todoText}>{todo.title}</span>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className={styles.todoDelete}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Todo Form */}
        {isAdding ? (
          <form onSubmit={handleAddTodo} className={styles.addForm}>
            <Input
              autoFocus
              placeholder="Task title..."
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className={styles.addInput}
            />
            <div className={styles.addActions}>
              <Button type="submit" size="sm">Add</Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAdding(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="secondary"
            className={styles.addButton}
            onClick={() => setIsAdding(true)}
          >
            <Plus size={16} />
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
}
```

**components/ProjectCard.module.css:**
```css
.card {
  display: flex;
  flex-direction: column;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.colorStripe {
  height: 0.5rem;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  padding-bottom: 0.75rem;
}

.headerContent {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.badge {
  font-size: 0.75rem;
  color: #94a3b8;
  background: #f1f5f9;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
}

.deleteBtn {
  color: #94a3b8;
}

.deleteBtn:hover {
  color: #ef4444;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  padding-top: 0.75rem;
  flex: 1;
}

.todoList {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 6rem;
}

.empty {
  text-align: center;
  padding: 2rem 1rem;
  color: #cbd5e1;
  font-style: italic;
  font-size: 0.875rem;
}

.todoItem {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  transition: background 0.2s;
}

.todoItem:hover {
  background: #f8fafc;
}

.checkbox {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0;
  display: flex;
  transition: color 0.2s;
}

.checkbox:hover {
  color: #6366f1;
}

.todoItem.completed .checkbox {
  color: #94a3b8;
}

.todoText {
  flex: 1;
  font-size: 0.875rem;
  color: #334155;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.todoItem.completed .todoText {
  color: #94a3b8;
  text-decoration: line-through;
}

.todoDelete {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #cbd5e1;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
}

.todoItem:hover .todoDelete {
  opacity: 1;
}

.todoDelete:hover {
  color: #ef4444;
}

.completedSection {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid #f1f5f9;
}

.sectionTitle {
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.addForm {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.addInput {
  height: 2rem !important;
}

.addActions {
  display: flex;
  gap: 0.5rem;
}

.addButton {
  width: 100%;
  justify-content: flex-start;
  color: #64748b;
}

.addButton:hover {
  color: #0f172a;
}
```

### 2.8 Test Phase 2

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Browser:** http://localhost:5173/todos

✅ **Test-Checklist:**
1. Klick "New Project" → Form öffnet sich
2. Name eingeben, Farbe wählen → "Create Project"
3. Projekt erscheint in Grid mit Farbstreifen
4. "Add Task" klicken → Task erstellen
5. Task anklicken → Status wird "done" (durchgestrichen)
6. Task nochmal anklicken → Status wird "todo" (wieder normal)
7. Delete-Button → Task wird gelöscht
8. Projekt-Delete → Projekt + alle Tasks werden gelöscht

**API-Requests in DevTools prüfen:**
- `GET /api/projects` → Liste
- `POST /api/projects` → Neues Projekt
- `POST /api/todos` → Neuer Task
- `PATCH /api/todos/:id` → Status toggle
- `DELETE /api/todos/:id` → Task löschen
- `DELETE /api/projects/:id` → Projekt löschen

---

## Phase 3: Timer Feature (Frontend)

**Ziel:** Pomodoro-Timer implementieren mit Todo-Auswahl und automatischer TimeEntry-Erstellung

**Wichtig:** Phase 2 muss abgeschlossen sein (Projects + Tasks funktionieren)

**Was wird gemacht:**

1. **framer-motion installieren** (jetzt erst, da in Phase 3 benötigt für Animationen)
2. **Timer Component** erstellen mit:
   - Kreisförmiger Progress-Indikator (SVG Circle)
   - Start/Pause/Stop Buttons
   - Focus/Break Modes (25 Min / 5 Min)
   - useEffect für Countdown-Timer
   - framer-motion für smooth Animationen
3. **TodoSelector Component** erstellen:
   - Dropdown mit allen aktiven Tasks
   - Gruppiert nach Projekt (mit Farbdot)
   - "No task selected" State
4. **TrackerPage** implementieren:
   - Timer + TodoSelector zusammenführen
   - TimeEntry beim Timer-Stop automatisch erstellen
   - Quote-Display (optional motivational quote)
5. **App.tsx Update:** TrackerPage auf `/` Route einbinden

**Flow:**
1. User navigiert zu Tracker (/)
2. Wählt Task aus TodoSelector
3. Startet Timer → Countdown beginnt
4. Timer läuft ab oder User stoppt → TimeEntry wird erstellt mit:
   - `todo_id` (ausgewählter Task)
   - `project_id` (vom Task)
   - `duration` (verstrichene Sekunden)
   - `timestamp` (aktueller Zeitpunkt)
5. StoreContext refreshTimeEntries() → Daten aktuell

**Dependencies:**
- framer-motion: Für smooth Timer-Animationen (Circle Progress)
- Bestehendes: useStore (Todos + PomodoroSettings), api.timeEntries.create()

**Code-Struktur:**
- `components/Timer.tsx` + `Timer.module.css` (Core Timer Logic)
- `components/TodoSelector.tsx` + `TodoSelector.module.css` (Task Dropdown)
- `pages/TrackerPage.tsx` + `TrackerPage.module.css` (Zusammenführung)
- `App.tsx` Update (Route `/` → TrackerPage statt Placeholder)

---

### 3.1 Dependencies Installation

**Jetzt framer-motion installieren** (wurde in Phase 1 übersprungen):

```bash
cd frontend
npm install framer-motion
```

### 3.2 Timer Component

**components/Timer.tsx:**
```typescript
import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import styles from './Timer.module.css';

type TimerMode = 'focus' | 'break';

interface TimerProps {
  focusDuration: number; // in Minuten
  breakDuration: number; // in Minuten
  onComplete: (elapsedSeconds: number) => void;
}

export default function Timer({ focusDuration, breakDuration, onComplete }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(focusDuration * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const currentDuration = mode === 'focus' ? focusDuration : breakDuration;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // Timer completed
          if (mode === 'focus') {
            onComplete(elapsedSeconds + 1);
            setElapsedSeconds(0);
          }
          return 0;
        }
        setElapsedSeconds((e) => e + 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, elapsedSeconds, onComplete]);

  // Mode change effect
  useEffect(() => {
    const duration = mode === 'focus' ? focusDuration : breakDuration;
    setTotalSeconds(duration * 60);
    setSecondsLeft(duration * 60);
    setElapsedSeconds(0);
    setIsRunning(false);
  }, [mode, focusDuration, breakDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleStop = () => {
    if (mode === 'focus' && elapsedSeconds > 0) {
      onComplete(elapsedSeconds);
    }
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 120; // radius 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.timer}>
      {/* Mode Toggle */}
      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeBtn} ${mode === 'focus' ? styles.active : ''}`}
          onClick={() => setMode('focus')}
          disabled={isRunning}
        >
          Focus ({focusDuration} min)
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'break' ? styles.active : ''}`}
          onClick={() => setMode('break')}
          disabled={isRunning}
        >
          Break ({breakDuration} min)
        </button>
      </div>

      {/* Timer Circle */}
      <div className={styles.circle}>
        <svg className={styles.svg} viewBox="0 0 250 250">
          {/* Background circle */}
          <circle
            cx="125"
            cy="125"
            r="120"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="125"
            cy="125"
            r="120"
            fill="none"
            stroke={mode === 'focus' ? '#6366f1' : '#10b981'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 125 125)"
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3 }}
          />
        </svg>
        <div className={styles.timeDisplay}>
          <span className={styles.time}>{formatTime(secondsLeft)}</span>
          <span className={styles.label}>{mode === 'focus' ? 'Focus' : 'Break'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {!isRunning ? (
          <Button size="lg" onClick={handleStart}>
            <Play size={24} />
            Start
          </Button>
        ) : (
          <>
            <Button size="lg" variant="secondary" onClick={handlePause}>
              <Pause size={24} />
              Pause
            </Button>
            <Button size="lg" variant="destructive" onClick={handleStop}>
              <Square size={24} />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

**components/Timer.module.css:**
```css
.timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.modeToggle {
  display: flex;
  gap: 0.5rem;
  background: #f1f5f9;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.modeBtn {
  padding: 0.75rem 1.5rem;
  border: none;
  background: transparent;
  color: #64748b;
  font-weight: 500;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modeBtn:hover:not(:disabled) {
  background: white;
  color: #0f172a;
}

.modeBtn.active {
  background: white;
  color: #0f172a;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modeBtn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.circle {
  position: relative;
  width: 250px;
  height: 250px;
}

.svg {
  width: 100%;
  height: 100%;
}

.timeDisplay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.label {
  display: block;
  font-size: 1rem;
  color: #64748b;
  margin-top: 0.5rem;
}

.controls {
  display: flex;
  gap: 1rem;
}
```

### 3.3 TodoSelector Component

**components/TodoSelector.tsx:**
```typescript
import { useStore } from '@/context/StoreContext';
import { COLORS } from '@/lib/utils';
import Select from './ui/Select';
import styles from './TodoSelector.module.css';

interface TodoSelectorProps {
  selectedTodoId: number | null;
  onChange: (todoId: number | null) => void;
}

export default function TodoSelector({ selectedTodoId, onChange }: TodoSelectorProps) {
  const { projects, todos } = useStore();

  const activeTodos = todos.filter(t => t.status !== 'done');
  
  return (
    <div className={styles.selector}>
      <label className={styles.label}>Select a task to track</label>
      <Select
        value={selectedTodoId?.toString() || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      >
        <option value="">No task selected</option>
        {projects.map(project => {
          const projectTodos = activeTodos.filter(t => t.project_id === project.id);
          if (projectTodos.length === 0) return null;

          const colorHex = COLORS.find(c => c.name === project.color)?.hex || '#6366f1';

          return (
            <optgroup key={project.id} label={project.name}>
              {projectTodos.map(todo => (
                <option key={todo.id} value={todo.id}>
                  {todo.title}
                </option>
              ))}
            </optgroup>
          );
        })}
      </Select>
      
      {activeTodos.length === 0 && (
        <p className={styles.empty}>
          No active tasks. Create a project and add tasks first.
        </p>
      )}
    </div>
  );
}
```

**components/TodoSelector.module.css:**
```css
.selector {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 24rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
}

.empty {
  font-size: 0.875rem;
  color: #94a3b8;
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.375rem;
}
```

### 3.4 TrackerPage

**pages/TrackerPage.tsx:**
```typescript
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import Timer from '@/components/Timer';
import TodoSelector from '@/components/TodoSelector';
import Card from '@/components/ui/Card';
import styles from './TrackerPage.module.css';

export default function TrackerPage() {
  const { pomodoroSettings, refreshTimeEntries, todos } = useStore();
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleTimerComplete = async (elapsedSeconds: number) => {
    if (!selectedTodoId) {
      alert('Please select a task to track time for!');
      return;
    }

    const selectedTodo = todos.find(t => t.id === selectedTodoId);
    if (!selectedTodo) return;

    try {
      await api.timeEntries.create({
        todo_id: selectedTodoId,
        duration: elapsedSeconds,
      });
      await refreshTimeEntries();
      console.log(`✅ Time entry created: ${elapsedSeconds}s for task #${selectedTodoId}`);
    } catch (error) {
      console.error('Failed to create time entry:', error);
      alert('Failed to save time entry');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Focus Timer</h1>
        <p className={styles.subtitle}>Track your work with the Pomodoro Technique</p>
      </div>

      <Card className={styles.card}>
        <div className={styles.content}>
          <TodoSelector
            selectedTodoId={selectedTodoId}
            onChange={setSelectedTodoId}
          />
          
          <Timer
            focusDuration={pomodoroSettings.focus_duration}
            breakDuration={pomodoroSettings.break_duration}
            onComplete={handleTimerComplete}
          />
        </div>
      </Card>

      {selectedTodoId && (
        <div className={styles.info}>
          <p>Timer will track time for: <strong>{todos.find(t => t.id === selectedTodoId)?.title}</strong></p>
        </div>
      )}
    </div>
  );
}
```

**pages/TrackerPage.module.css:**
```css
.page {
  max-width: 60rem;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: #64748b;
}

.card {
  padding: 2rem;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.info {
  text-align: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
  color: #64748b;
}

.info strong {
  color: #0f172a;
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }
}
```

### 3.5 App.tsx Update (Phase 3 Version)

**App.tsx (VOLLSTÄNDIG - ersetzt Phase 2 Version):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import TrackerPage from './pages/TrackerPage';
import TodosPage from './pages/TodosPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/stats" element={<div className={styles.placeholder}>Stats Page</div>} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
```

### 3.6 Test Phase 3

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Browser:** http://localhost:5173 (Tracker ist jetzt Startseite)

✅ **Test-Checklist:**
1. Seite lädt → Timer + TodoSelector sichtbar
2. TodoSelector öffnen → Projekte + Tasks gruppiert
3. Task auswählen → Info-Text erscheint unten
4. Timer starten → Countdown beginnt, Circle animiert
5. Timer pausieren → Countdown stoppt
6. Timer weiterlaufen lassen → Nach Ablauf: TimeEntry erstellt
7. Timer stoppen → Bei laufendem Timer: TimeEntry für verstrichene Zeit erstellt
8. Focus/Break Mode wechseln → Unterschiedliche Dauer (25/5 min)

**DevTools Console prüfen:**
- `✅ Time entry created: XXs for task #Y` nach Timer-Stop
- Keine Errors

**API-Requests in DevTools prüfen:**
- `POST /api/time-entries` mit `{ todo_id, duration }`
- Response enthält neue TimeEntry mit project_id

**Code-Konsistenz Check:**
- ✅ Nutzt bestehenden StoreContext (pomodoroSettings, todos, refreshTimeEntries)
- ✅ Nutzt bestehende UI Components (Button, Select, Card)
- ✅ Nutzt bestehenden API Service (api.timeEntries.create)
- ✅ CSS Modules Pattern konsistent (`.module.css` für alle Components)
- ✅ TypeScript Types aus `@/types` importiert
- ✅ Farben-System aus `COLORS` Array (lib/utils.ts)

---

## Phase 4: TimeEntries List Feature (Frontend)

**Ziel:** Liste der erfassten TimeEntries anzeigen mit Gruppierung nach Datum

**Wichtig:** Phase 3 muss abgeschlossen sein (Timer funktioniert, TimeEntries werden erstellt)

**Was wird gemacht:**

1. **TimeEntryList Component** erstellen mit:
   - Gruppierung nach Datum (heute, gestern, ältere Einträge)
   - Anzeige pro Entry: Projekt-Farbe Badge, Task-Name, Dauer, Uhrzeit
   - Datum-Header mit Summe der Dauer pro Tag
   - Empty State wenn keine Einträge vorhanden
   - Responsive Design (Card-Layout)
   
2. **formatDuration Helper** erweitern:
   - Sekunden → Minuten/Stunden Formatierung (z.B. "25 min", "1h 30min")
   - Summen-Berechnung für Tages-Totals
   
3. **TrackerPage Update:**
   - TimeEntryList unterhalb des Timers integrieren
   - Automatisches Refresh nach Timer-Stop
   - "Recent Activity" Section Header

**Flow:**
1. User stoppt Timer → TimeEntry wird erstellt
2. refreshTimeEntries() wird aufgerufen
3. TimeEntryList zeigt neue Entry sofort an
4. Entries gruppiert nach Datum mit Tages-Summe
5. Projekt-Farbe als Badge links von Task-Name

**Dependencies:**
- Bestehendes: useStore (timeEntries, projects, todos), formatTime, formatDate aus lib/utils
- Neu: formatDuration Funktion für bessere Dauer-Anzeige

**Code-Struktur:**
- `components/TimeEntryList.tsx` + `TimeEntryList.module.css` (Entry List Component)
- `pages/TrackerPage.tsx` Update (Integration unterhalb Timer)
- `lib/utils.ts` Update (formatDuration verbessern falls nötig)

---

### 4.1 TimeEntryList Component

**components/TimeEntryList.tsx:**
```typescript
import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { COLORS } from '@/lib/utils';
import { formatDate, formatTime, formatDuration } from '@/lib/utils';
import { Clock } from 'lucide-react';
import styles from './TimeEntryList.module.css';

export default function TimeEntryList() {
  const { timeEntries, projects, todos } = useStore();

  // Group entries by date
  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof timeEntries> = {};
    
    timeEntries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .forEach(entry => {
        const date = formatDate(entry.timestamp);
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(entry);
      });
    
    return groups;
  }, [timeEntries]);

  // Calculate total duration per day
  const getTotalDuration = (entries: typeof timeEntries) => {
    return entries.reduce((sum, entry) => sum + entry.duration, 0);
  };

  if (timeEntries.length === 0) {
    return (
      <div className={styles.empty}>
        <Clock size={48} />
        <p>No time entries yet</p>
        <span>Start the timer to track your first task!</span>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <h2 className={styles.title}>Recent Activity</h2>
      
      {Object.entries(groupedEntries).map(([date, entries]) => (
        <div key={date} className={styles.dateGroup}>
          <div className={styles.dateHeader}>
            <span className={styles.date}>{date}</span>
            <span className={styles.total}>
              {formatDuration(getTotalDuration(entries))}
            </span>
          </div>
          
          <div className={styles.entries}>
            {entries.map(entry => {
              const project = projects.find(p => p.id === entry.project_id);
              const todo = todos.find(t => t.id === entry.todo_id);
              const colorHex = COLORS.find(c => c.name === project?.color)?.hex || '#6366f1';
              
              return (
                <div key={entry.id} className={styles.entry}>
                  <div
                    className={styles.colorBadge}
                    style={{ backgroundColor: colorHex }}
                  />
                  <div className={styles.content}>
                    <div className={styles.task}>
                      <span className={styles.projectName}>{project?.name}</span>
                      <span className={styles.separator}>•</span>
                      <span className={styles.todoTitle}>{todo?.title}</span>
                    </div>
                    <div className={styles.meta}>
                      <Clock size={14} />
                      <span>{formatTime(entry.timestamp)}</span>
                    </div>
                  </div>
                  <div className={styles.duration}>
                    {formatDuration(entry.duration)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
```

**components/TimeEntryList.module.css:**
```css
.list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #94a3b8;
  text-align: center;
  gap: 1rem;
}

.empty p {
  font-size: 1.125rem;
  font-weight: 600;
  color: #64748b;
}

.empty span {
  font-size: 0.875rem;
}

.dateGroup {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dateHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
}

.entries {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.entry {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.entry:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-color: #cbd5e1;
}

.colorBadge {
  width: 0.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.task {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.projectName {
  font-size: 0.875rem;
  font-weight: 600;
  color: #334155;
}

.separator {
  color: #cbd5e1;
}

.todoTitle {
  font-size: 0.875rem;
  color: #64748b;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #94a3b8;
}

.duration {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  flex-shrink: 0;
}

@media (max-width: 640px) {
  .entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .colorBadge {
    width: 100%;
    height: 0.25rem;
  }

  .duration {
    align-self: flex-end;
  }
}
```

### 4.2 lib/utils.ts Update (formatDuration verbessern)

**lib/utils.ts Update:**

Ersetze die bestehende `formatDuration` Funktion mit dieser verbesserten Version:

```typescript
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  if (hours > 0) {
    if (minutes > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${hours}h`;
  }
  
  if (minutes > 0) {
    return `${minutes}min`;
  }
  
  return `${seconds}s`;
}
```

### 4.3 TrackerPage Update

**pages/TrackerPage.tsx (VOLLSTÄNDIG - ersetzt Phase 3 Version):**
```typescript
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import Timer from '@/components/Timer';
import TodoSelector from '@/components/TodoSelector';
import TimeEntryList from '@/components/TimeEntryList';
import Card from '@/components/ui/Card';
import styles from './TrackerPage.module.css';

export default function TrackerPage() {
  const { pomodoroSettings, refreshTimeEntries, todos } = useStore();
  const [selectedTodoId, setSelectedTodoId] = useState<number | null>(null);

  const handleTimerComplete = async (elapsedSeconds: number) => {
    if (!selectedTodoId) {
      alert('Please select a task to track time for!');
      return;
    }

    const selectedTodo = todos.find(t => t.id === selectedTodoId);
    if (!selectedTodo) return;

    try {
      await api.timeEntries.create({
        todo_id: selectedTodoId,
        duration: elapsedSeconds,
      });
      await refreshTimeEntries();
      console.log(`✅ Time entry created: ${elapsedSeconds}s for task #${selectedTodoId}`);
    } catch (error) {
      console.error('Failed to create time entry:', error);
      alert('Failed to save time entry');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Focus Timer</h1>
        <p className={styles.subtitle}>Track your work with the Pomodoro Technique</p>
      </div>

      <Card className={styles.card}>
        <div className={styles.content}>
          <TodoSelector
            selectedTodoId={selectedTodoId}
            onChange={setSelectedTodoId}
          />
          
          <Timer
            focusDuration={pomodoroSettings.focus_duration}
            breakDuration={pomodoroSettings.break_duration}
            onComplete={handleTimerComplete}
          />
        </div>
      </Card>

      {selectedTodoId && (
        <div className={styles.info}>
          <p>Timer will track time for: <strong>{todos.find(t => t.id === selectedTodoId)?.title}</strong></p>
        </div>
      )}

      {/* TimeEntries List */}
      <div className={styles.entriesSection}>
        <TimeEntryList />
      </div>
    </div>
  );
}
```

**pages/TrackerPage.module.css Update:**

Ergänze am Ende der Datei:

```css
.entriesSection {
  margin-top: 3rem;
}
```

### 4.4 Test Phase 4

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Browser:** http://localhost:5173

✅ **Test-Checklist:**
1. Seite lädt → Timer oben, darunter "No time entries yet" Message
2. Task auswählen + Timer starten
3. Timer für ein paar Sekunden laufen lassen
4. Timer stoppen → TimeEntry erscheint sofort in Liste
5. Entry zeigt: Projekt-Farbe Badge (links), Projekt-Name • Task-Name, Uhrzeit, Dauer (rechts)
6. Datum-Header zeigt aktuelles Datum + Tages-Summe
7. Mehrere Entries erstellen → Gruppierung nach Datum funktioniert
8. Verschiedene Projekte tracken → Farben unterschiedlich
9. Mobile (DevTools Responsive) → Entries stapeln sich vertikal, Farb-Badge oben horizontal

**DevTools Console prüfen:**
- `✅ Time entry created: XXs for task #Y` nach jedem Stop
- Keine Errors

**API-Requests in DevTools prüfen:**
- `POST /api/timeentries` nach Timer-Stop
- `GET /api/timeentries` beim Laden der Seite
- Response enthält alle Entries mit project_id, todo_id, duration, timestamp

**Code-Konsistenz Check:**
- ✅ Nutzt useStore (timeEntries, projects, todos)
- ✅ Nutzt formatDate, formatTime, formatDuration aus lib/utils
- ✅ Nutzt COLORS Array für Projekt-Farben
- ✅ CSS Modules Pattern (.module.css)
- ✅ Responsive Design mit @media queries
- ✅ Empty State mit Icon (lucide-react Clock)
- ✅ useMemo für Performance (groupedEntries Berechnung)

**Visuelle Validierung:**
- Entries haben Hover-Effekt (Shadow + Border-Color)
- Farb-Badges zeigen korrekte Projekt-Farbe
- Datum-Header mit grauer Trennlinie
- Tages-Summe in Indigo-Farbe (#6366f1)
- Responsive: Mobile Stack-Layout funktioniert

---

## Phase 5: Statistics Page (Frontend)

**Nächster Schritt:** Stats-Seite mit Charts und Auswertungen
- Gesamtzeit pro Projekt (Pie Chart)
- Zeitverlauf pro Tag (Bar Chart)
- Top Tasks nach Dauer
- Streak-Anzeige (Tage in Folge getrackt)

---
