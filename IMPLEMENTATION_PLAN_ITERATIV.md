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

**Ziel:** Statistiken und Auswertungen visualisieren mit Charts und Metriken

**Wichtig:** Phase 4 muss abgeschlossen sein (TimeEntries werden angezeigt)

**Was wird gemacht:**

1. **recharts Library installieren** (React Charts Library mit TypeScript Support)
   - Pie Charts für Projekt-Verteilung
   - Bar Charts für Zeitverlauf
   
2. **StatsPage Component** erstellen mit:
   - Grid-Layout mit mehreren Statistik-Karten
   - Heute-Statistik: Total Zeit heute + Anzahl Sessions
   - Gesamtzeit pro Projekt: Pie Chart mit Farben
   - Zeitverlauf letzte 7 Tage: Bar Chart
   - Top 5 Tasks nach Gesamtdauer: Liste mit Balken
   - Streak Counter: Tage in Folge getrackt
   
3. **Daten-Processing Funktionen**:
   - Gruppierung von TimeEntries nach Projekt
   - Gruppierung nach Tag für Chart
   - Berechnung von Streaks
   - Top Tasks Ranking

4. **StatCard Component** für konsistentes Layout:
   - Wiederverwendbare Card mit Titel + Content
   - Verschiedene Größen (1x1, 2x1 Grid)

**Flow:**
1. User navigiert zu `/stats`
2. StatsPage lädt timeEntries, projects, todos aus Store
3. useMemo berechnet Statistiken (Performance)
4. Charts rendern mit recharts
5. Automatisches Update wenn neue TimeEntries erstellt werden

**Dependencies:**
- recharts: ^2.10.0 (Charts Library)
- Bestehendes: useStore (timeEntries, projects, todos), formatDuration, COLORS

**Code-Struktur:**
- `pages/StatsPage.tsx` + `StatsPage.module.css` (Main Stats Page)
- `components/StatCard.tsx` + `StatCard.module.css` (Reusable Card)
- `lib/utils.ts` Update (Helper: getStartOfDay, getDaysArray für Charts)
- `App.tsx` Update (Route `/stats` → StatsPage statt Placeholder)

---

### 5.1 Dependencies Installation

```bash
cd frontend
npm install recharts
```

### 5.2 Utils Update (Date Helpers)

**lib/utils.ts - Ergänzen am Ende:**

```typescript
export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getDaysArray(days: number): Date[] {
  const result: Date[] = [];
  const today = getStartOfDay(new Date());
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    result.push(date);
  }
  
  return result;
}

export function getDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getShortDate(date: Date): string {
  return new Date(date).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit'
  });
}
```

### 5.3 StatCard Component

**components/StatCard.tsx:**
```typescript
import { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function StatCard({ title, children, className }: StatCardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
```

**components/StatCard.module.css:**
```css
.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.title {
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin: 0;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

### 5.4 StatsPage Component

**pages/StatsPage.tsx:**
```typescript
import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { COLORS } from '@/lib/utils';
import { formatDuration, getDaysArray, getDateString, getShortDate, getStartOfDay } from '@/lib/utils';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Target, Flame, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './StatsPage.module.css';

export default function StatsPage() {
  const { timeEntries, projects, todos } = useStore();

  // Heute Statistik
  const todayStats = useMemo(() => {
    const today = getStartOfDay(new Date());
    const todayEntries = timeEntries.filter(entry => {
      const entryDate = getStartOfDay(new Date(entry.timestamp));
      return entryDate.getTime() === today.getTime();
    });

    return {
      totalDuration: todayEntries.reduce((sum, entry) => sum + entry.duration, 0),
      sessionCount: todayEntries.length,
    };
  }, [timeEntries]);

  // Gesamtzeit pro Projekt (Pie Chart Data)
  const projectData = useMemo(() => {
    const projectMap: Record<number, number> = {};

    timeEntries.forEach(entry => {
      projectMap[entry.project_id] = (projectMap[entry.project_id] || 0) + entry.duration;
    });

    return Object.entries(projectMap).map(([projectId, duration]) => {
      const project = projects.find(p => p.id === Number(projectId));
      const colorHex = COLORS.find(c => c.name === project?.color)?.hex || '#6366f1';
      
      return {
        name: project?.name || 'Unknown',
        value: duration,
        color: colorHex,
      };
    }).sort((a, b) => b.value - a.value);
  }, [timeEntries, projects]);

  // Zeitverlauf letzte 7 Tage (Bar Chart Data)
  const weekData = useMemo(() => {
    const days = getDaysArray(7);
    const dayMap: Record<string, number> = {};

    timeEntries.forEach(entry => {
      const entryDate = getDateString(new Date(entry.timestamp));
      dayMap[entryDate] = (dayMap[entryDate] || 0) + entry.duration;
    });

    return days.map(date => ({
      date: getShortDate(date),
      duration: dayMap[getDateString(date)] || 0,
    }));
  }, [timeEntries]);

  // Top 5 Tasks nach Dauer
  const topTasks = useMemo(() => {
    const taskMap: Record<number, number> = {};

    timeEntries.forEach(entry => {
      taskMap[entry.todo_id] = (taskMap[entry.todo_id] || 0) + entry.duration;
    });

    return Object.entries(taskMap)
      .map(([todoId, duration]) => {
        const todo = todos.find(t => t.id === Number(todoId));
        const project = projects.find(p => p.id === todo?.project_id);
        const colorHex = COLORS.find(c => c.name === project?.color)?.hex || '#6366f1';

        return {
          id: Number(todoId),
          title: todo?.title || 'Unknown',
          projectName: project?.name || '',
          duration,
          color: colorHex,
        };
      })
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5);
  }, [timeEntries, todos, projects]);

  // Streak Berechnung (Tage in Folge getrackt)
  const streak = useMemo(() => {
    if (timeEntries.length === 0) return 0;

    const uniqueDates = Array.from(
      new Set(
        timeEntries.map(entry => getDateString(new Date(entry.timestamp)))
      )
    ).sort().reverse();

    let currentStreak = 0;
    const today = getDateString(new Date());
    const yesterday = getDateString(new Date(Date.now() - 86400000));

    // Check if today or yesterday has entries
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      return 0;
    }

    let expectedDate = new Date();
    if (uniqueDates[0] === yesterday) {
      expectedDate = new Date(Date.now() - 86400000);
    }

    for (const dateStr of uniqueDates) {
      if (dateStr === getDateString(expectedDate)) {
        currentStreak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return currentStreak;
  }, [timeEntries]);

  const maxTaskDuration = topTasks.length > 0 ? topTasks[0].duration : 1;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Statistics</h1>
        <p className={styles.subtitle}>Your productivity insights</p>
      </div>

      {timeEntries.length === 0 ? (
        <div className={styles.empty}>
          <Clock size={48} />
          <p>No data yet</p>
          <span>Start tracking time to see your statistics!</span>
        </div>
      ) : (
        <div className={styles.grid}>
          {/* Heute Stats */}
          <StatCard title="Today" className={styles.todayCard}>
            <div className={styles.todayStats}>
              <div className={styles.statBox}>
                <Clock size={24} className={styles.icon} />
                <div>
                  <div className={styles.statValue}>{formatDuration(todayStats.totalDuration)}</div>
                  <div className={styles.statLabel}>Total Time</div>
                </div>
              </div>
              <div className={styles.statBox}>
                <Target size={24} className={styles.icon} />
                <div>
                  <div className={styles.statValue}>{todayStats.sessionCount}</div>
                  <div className={styles.statLabel}>Sessions</div>
                </div>
              </div>
            </div>
          </StatCard>

          {/* Streak */}
          <StatCard title="Streak" className={styles.streakCard}>
            <div className={styles.streak}>
              <Flame size={48} className={styles.flameIcon} />
              <div className={styles.streakValue}>{streak}</div>
              <div className={styles.streakLabel}>Day{streak !== 1 ? 's' : ''} in a row</div>
            </div>
          </StatCard>

          {/* Projekt-Verteilung (Pie Chart) */}
          <StatCard title="Time by Project" className={styles.chartCard}>
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatDuration(value)}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>No project data</div>
            )}
            <div className={styles.legend}>
              {projectData.map((item, index) => (
                <div key={index} className={styles.legendItem}>
                  <div className={styles.legendColor} style={{ backgroundColor: item.color }} />
                  <span className={styles.legendName}>{item.name}</span>
                  <span className={styles.legendValue}>{formatDuration(item.value)}</span>
                </div>
              ))}
            </div>
          </StatCard>

          {/* Zeitverlauf 7 Tage (Bar Chart) */}
          <StatCard title="Last 7 Days" className={styles.chartCard}>
            {weekData.some(d => d.duration > 0) ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weekData}>
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `${Math.floor(value / 60)}m`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatDuration(value)}
                    contentStyle={{
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '0.5rem',
                    }}
                  />
                  <Bar dataKey="duration" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noData}>No activity in the last 7 days</div>
            )}
          </StatCard>

          {/* Top Tasks */}
          <StatCard title="Top Tasks" className={styles.topTasksCard}>
            {topTasks.length > 0 ? (
              <div className={styles.topTasks}>
                {topTasks.map((task, index) => (
                  <div key={task.id} className={styles.taskRow}>
                    <div className={styles.taskRank}>{index + 1}</div>
                    <div className={styles.taskInfo}>
                      <div className={styles.taskTitle}>{task.title}</div>
                      <div className={styles.taskProject}>
                        <div
                          className={styles.taskColor}
                          style={{ backgroundColor: task.color }}
                        />
                        {task.projectName}
                      </div>
                    </div>
                    <div className={styles.taskDuration}>
                      {formatDuration(task.duration)}
                    </div>
                    <div className={styles.taskBar}>
                      <div
                        className={styles.taskBarFill}
                        style={{
                          width: `${(task.duration / maxTaskDuration) * 100}%`,
                          backgroundColor: task.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noData}>No tasks tracked yet</div>
            )}
          </StatCard>

          {/* Gesamtstatistik */}
          <StatCard title="All Time" className={styles.totalCard}>
            <div className={styles.totalStats}>
              <div className={styles.totalItem}>
                <TrendingUp size={20} className={styles.totalIcon} />
                <div>
                  <div className={styles.totalValue}>
                    {formatDuration(timeEntries.reduce((sum, e) => sum + e.duration, 0))}
                  </div>
                  <div className={styles.totalLabel}>Total Tracked</div>
                </div>
              </div>
              <div className={styles.totalItem}>
                <Target size={20} className={styles.totalIcon} />
                <div>
                  <div className={styles.totalValue}>{timeEntries.length}</div>
                  <div className={styles.totalLabel}>Total Sessions</div>
                </div>
              </div>
            </div>
          </StatCard>
        </div>
      )}
    </div>
  );
}
```

**pages/StatsPage.module.css:**
```css
.page {
  max-width: 80rem;
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

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.todayCard {
  grid-column: span 2;
}

.streakCard {
  grid-column: span 2;
}

.chartCard {
  grid-column: span 2;
}

.topTasksCard {
  grid-column: span 2;
}

.totalCard {
  grid-column: span 4;
}

/* Today Stats */
.todayStats {
  display: flex;
  gap: 2rem;
}

.statBox {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.icon {
  color: #6366f1;
  flex-shrink: 0;
}

.statValue {
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.statLabel {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Streak */
.streak {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0;
}

.flameIcon {
  color: #f97316;
}

.streakValue {
  font-size: 3rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.streakLabel {
  font-size: 0.875rem;
  color: #64748b;
}

/* Charts */
.legend {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.legendItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.legendColor {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.125rem;
  flex-shrink: 0;
}

.legendName {
  flex: 1;
  color: #334155;
}

.legendValue {
  color: #64748b;
  font-weight: 500;
}

.noData {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  color: #94a3b8;
  font-size: 0.875rem;
}

/* Top Tasks */
.topTasks {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.taskRow {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.75rem;
  align-items: center;
}

.taskRank {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border-radius: 0.375rem;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;
}

.taskInfo {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.taskTitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.taskProject {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
}

.taskColor {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  flex-shrink: 0;
}

.taskDuration {
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  white-space: nowrap;
}

.taskBar {
  grid-column: 2 / -1;
  height: 0.25rem;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
}

.taskBarFill {
  height: 100%;
  transition: width 0.3s ease;
}

/* Total Stats */
.totalStats {
  display: flex;
  gap: 3rem;
  justify-content: center;
}

.totalItem {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.totalIcon {
  color: #6366f1;
}

.totalValue {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.totalLabel {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 0.25rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .todayCard,
  .streakCard,
  .chartCard,
  .topTasksCard,
  .totalCard {
    grid-column: span 2;
  }

  .totalStats {
    gap: 2rem;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .todayCard,
  .streakCard,
  .chartCard,
  .topTasksCard,
  .totalCard {
    grid-column: span 1;
  }

  .todayStats {
    flex-direction: column;
    gap: 1.5rem;
  }

  .totalStats {
    flex-direction: column;
    gap: 1.5rem;
  }
}
```

### 5.5 App.tsx Update

**App.tsx (VOLLSTÄNDIG - ersetzt Phase 4 Version):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import TrackerPage from './pages/TrackerPage';
import TodosPage from './pages/TodosPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
```

### 5.6 Test Phase 5

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Browser:** http://localhost:5173/stats

✅ **Test-Checklist:**

**Initial State (keine Daten):**
1. Navigate zu `/stats` → "No data yet" Message erscheint
2. Tracke ein paar Tasks → Gehe zurück zu `/stats`

**Mit Daten:**
3. **Today Card:** Zeigt heutige Gesamtzeit + Anzahl Sessions
4. **Streak Card:** Zeigt Flame-Icon + Anzahl Tage in Folge
5. **Time by Project (Pie Chart):**
   - Donut Chart mit Projekt-Farben
   - Hover zeigt Projekt-Name + Dauer
   - Legend unterhalb mit allen Projekten
6. **Last 7 Days (Bar Chart):**
   - Balken für jeden Tag (letzten 7 Tage)
   - Y-Achse zeigt Minuten
   - Hover zeigt exakte Dauer
7. **Top Tasks:**
   - Liste mit Rank (#1-5)
   - Task-Name + Projekt mit Farb-Dot
   - Dauer rechts
   - Progress-Balken in Projekt-Farbe
8. **All Time Card:** Gesamtzeit + Total Sessions über alle Daten

**Interaktivität:**
9. Hover über Charts → Tooltips erscheinen
10. Responsive (DevTools): Grid stapelt sich auf Mobile (1 Spalte)
11. Mehrere Projekte tracken → Pie Chart zeigt verschiedene Farben
12. Über mehrere Tage tracken → Bar Chart zeigt Verlauf
13. Einen Tag Pause → Streak resettet auf 0

**DevTools Console prüfen:**
- Keine Errors
- Keine Warnings von recharts

**Code-Konsistenz Check:**
- ✅ Nutzt useStore (timeEntries, projects, todos)
- ✅ Nutzt formatDuration, COLORS, neue Date-Helpers
- ✅ CSS Modules Pattern
- ✅ useMemo für Performance (alle Berechnungen optimiert)
- ✅ Responsive Design (@media queries)
- ✅ Empty State mit Icon
- ✅ recharts mit Tooltip + Custom Styles
- ✅ lucide-react Icons (TrendingUp, Target, Flame, Clock)

**Visuelle Validierung:**
- Cards haben Shadow + Border
- Icons in Indigo-Farbe (#6366f1)
- Flame-Icon in Orange (#f97316)
- Charts verwenden Projekt-Farben
- Top Tasks haben nummerierten Rank
- Progress Bars animieren smooth
- Grid Layout responsive (4 → 2 → 1 Spalten)

**Performance Check:**
- Große TimeEntry-Mengen (100+) → Page lädt smooth (useMemo!)
- Charts rendern ohne Lag
- Hover auf Charts responsive

---

## Phase 6: Settings & Pomodoro Configuration

**Ziel:** Pomodoro-Timer Einstellungen bearbeitbar machen und UI-Verbesserungen

**Wichtig:** Phase 5 muss abgeschlossen sein (Statistics funktionieren)

**Was wird gemacht:**

1. **PomodoroSettings Component** erstellen mit:
   - Formular für Focus Duration (Minuten)
   - Formular für Break Duration (Minuten)
   - Speichern-Button mit API-Update
   - Validierung (Min: 1, Max: 60 Minuten)
   - Aktuelle Einstellungen anzeigen
   
2. **SettingsPage Component** mit:
   - Header "Settings"
   - PomodoroSettings Section
   - Weitere Settings (Export)
   - Erfolgs-Feedback nach Speichern

3. **Backend Fix:** Sicherstellen dass /api/settings funktioniert
   - Default Settings werden beim ersten GET erstellt
   - PUT /api/settings aktualisiert Werte

4. **Navigation Update:**
   - Settings-Link in Sidebar/Mobile Nav hinzufügen
   - Settings-Icon (lucide-react)

5. **UI Polish:**
   - Loading States für API Calls
   - Success/Error Messages (Toast/Alert)
   - Smooth Transitions

**Flow:**
1. User navigiert zu `/settings`
2. SettingsPage lädt pomodoroSettings aus Store
3. Form zeigt aktuelle Werte an
4. User ändert Focus/Break Duration
5. Klick "Save Settings" → PUT /api/settings
6. refreshPomodoroSettings() aktualisiert Store
7. Success Message erscheint
8. Timer auf Homepage nutzt neue Werte

**Dependencies:**
- Bestehendes: useStore (pomodoroSettings, refreshPomodoroSettings), api.pomodoroSettings.update()
- Backend: /api/settings Endpoint (bereits vorhanden)

**Code-Struktur:**
- `components/PomodoroSettings.tsx` + `PomodoroSettings.module.css` (Settings Form Component)
- `pages/SettingsPage.tsx` + `SettingsPage.module.css` (Settings Page)
- `components/Layout.tsx` Update (Settings Navigation Link)
- `App.tsx` Update (Route `/settings`)

---

### 6.1 Backend Check & Fix

**Backend sollte bereits funktionieren, aber prüfen:**

Das Backend hat bereits die Endpoints in `backend/main.py`:
- `GET /api/settings` - Gibt Pomodoro Settings zurück (erstellt Default wenn nicht vorhanden)
- `PUT /api/settings` - Aktualisiert Settings

Falls Probleme: Backend ist bereits korrekt implementiert mit Default-Werten:
```python
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
```

**Kein Backend-Code nötig** - Endpoints funktionieren bereits!

### 6.2 PomodoroSettings Component

**components/PomodoroSettings.tsx:**
```typescript
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { api } from '@/lib/api';
import { Clock, Check } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import styles from './PomodoroSettings.module.css';

export default function PomodoroSettings() {
  const { pomodoroSettings, refreshPomodoroSettings } = useStore();
  const [focusDuration, setFocusDuration] = useState(pomodoroSettings.focus_duration);
  const [breakDuration, setBreakDuration] = useState(pomodoroSettings.break_duration);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (focusDuration < 1 || focusDuration > 60) {
      alert('Focus duration must be between 1 and 60 minutes');
      return;
    }
    if (breakDuration < 1 || breakDuration > 60) {
      alert('Break duration must be between 1 and 60 minutes');
      return;
    }

    setIsSaving(true);
    try {
      await api.pomodoroSettings.update({
        focus_duration: focusDuration,
        break_duration: breakDuration,
      });
      await refreshPomodoroSettings();
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
      console.log('✅ Pomodoro settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setFocusDuration(25);
    setBreakDuration(5);
  };

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <Clock size={24} className={styles.icon} />
        <div>
          <h3 className={styles.title}>Pomodoro Timer</h3>
          <p className={styles.subtitle}>Configure your focus and break durations</p>
        </div>
      </div>

      <form onSubmit={handleSave} className={styles.form}>
        <div className={styles.inputs}>
          <Input
            type="number"
            label="Focus Duration (minutes)"
            value={focusDuration}
            onChange={(e) => setFocusDuration(Number(e.target.value))}
            min={1}
            max={60}
            required
          />
          
          <Input
            type="number"
            label="Break Duration (minutes)"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            min={1}
            max={60}
            required
          />
        </div>

        <div className={styles.actions}>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset to Default
          </Button>
        </div>

        {showSuccess && (
          <div className={styles.success}>
            <Check size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </form>
    </Card>
  );
}
```

**components/PomodoroSettings.module.css:**
```css
.card {
  max-width: 40rem;
}

.header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.icon {
  color: #6366f1;
  flex-shrink: 0;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-top: 1.5rem;
}

.inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.success {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 0.5rem;
  color: #166534;
  font-size: 0.875rem;
  font-weight: 500;
}

@media (max-width: 640px) {
  .inputs {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-direction: column;
  }
}
```

### 6.3 SettingsPage

**pages/SettingsPage.tsx:**
```typescript
import PomodoroSettings from '@/components/PomodoroSettings';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your app preferences</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <PomodoroSettings />
        </section>

        {/* Future sections can be added here:
        <section className={styles.section}>
          <ThemeSettings />
        </section>
        <section className={styles.section}>
          <ExportSettings />
        </section>
        */}
      </div>
    </div>
  );
}
```

**pages/SettingsPage.module.css:**
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

.content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section {
  width: 100%;
  display: flex;
  justify-content: center;
}
```

### 6.4 Layout Navigation Update

**components/Layout.tsx - Settings Link hinzufügen:**

Ergänze in beiden Navigationen (Desktop + Mobile) den Settings-Link:

```typescript
import { Clock, CheckSquare, BarChart3, Settings } from 'lucide-react';

// In der Desktop Nav (nach /stats):
<NavLink 
  to="/settings" 
  className={({ isActive }) => 
    `${styles.navLink} ${isActive ? styles.active : ''}`
  }
>
  <Settings size={20} />
  <span>Settings</span>
</NavLink>

// In der Mobile Nav (nach /stats):
<NavLink 
  to="/settings" 
  className={({ isActive }) => 
    `${styles.mobileLink} ${isActive ? styles.active : ''}`
  }
>
  <Settings size={24} />
  <span>Settings</span>
</NavLink>
```

### 6.5 App.tsx Update

**App.tsx (VOLLSTÄNDIG - ersetzt Phase 5 Version):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import TrackerPage from './pages/TrackerPage';
import TodosPage from './pages/TodosPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<TrackerPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/stats" element={<StatsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
```

### 6.6 Test Phase 6

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Browser:** http://localhost:5173/settings

✅ **Test-Checklist:**

**Initial State:**
1. Navigate zu `/settings` → Settings Page lädt
2. PomodoroSettings Card zeigt aktuelle Werte (25 min / 5 min)
3. Form-Felder sind editierbar

**Settings ändern:**
4. Ändere Focus Duration auf 30
5. Ändere Break Duration auf 10
6. Klick "Save Settings" → Button zeigt "Saving..."
7. Success Message erscheint: "Settings saved successfully!"
8. Message verschwindet nach 3 Sekunden

**Validierung:**
9. Setze Focus auf 0 → Alert: "Focus duration must be between 1 and 60 minutes"
10. Setze Break auf 100 → Alert: "Break duration must be between 1 and 60 minutes"
11. Setze gültige Werte → Speichern funktioniert

**Integration Check:**
12. Gehe zu `/` (Tracker)
13. Timer zeigt neue Durations in Mode-Toggle (z.B. "Focus (30 min)")
14. Starte Timer → Countdown beginnt mit neuer Duration

**Reset Funktion:**
15. Zurück zu `/settings`
16. Klick "Reset to Default" → Werte werden 25/5
17. Speichern → Neue Werte werden übernommen

**Navigation:**
18. Sidebar zeigt "Settings" Link mit Settings-Icon
19. Mobile Nav zeigt Settings
20. Active State funktioniert (Settings highlighted wenn auf /settings)

**DevTools Console prüfen:**
- `✅ Pomodoro settings updated` nach Speichern
- Keine Errors

**API-Requests in DevTools prüfen:**
- `GET /api/settings` beim Laden der Seite (oder 404 → Backend erstellt Default)
- `PUT /api/settings` nach "Save Settings" mit `{ focus_duration, break_duration }`
- Response enthält aktualisierte Settings

**Code-Konsistenz Check:**
- ✅ Nutzt useStore (pomodoroSettings, refreshPomodoroSettings)
- ✅ Nutzt bestehende UI Components (Input, Button, Card)
- ✅ Nutzt api.pomodoroSettings.update()
- ✅ CSS Modules Pattern
- ✅ lucide-react Icons (Clock, Check, Settings)
- ✅ Validierung vor API Call
- ✅ Loading State während Save
- ✅ Success Feedback nach Save
- ✅ Responsive Design

**Visuelle Validierung:**
- Card hat Icon + Title + Subtitle
- Form Grid: 2 Spalten auf Desktop, 1 auf Mobile
- Buttons nebeneinander (Desktop), gestapelt (Mobile)
- Success Message grün mit Check-Icon
- Settings-Link in Navigation sichtbar

**Backend Check:**
- Backend erstellt automatisch Default Settings (25/5) wenn nicht vorhanden
- PUT /api/settings aktualisiert DB korrekt
- GET /api/settings liefert aktualisierte Werte

---

## Phase 7: Final Polish & Production Readiness

**Ziel:** App production-ready machen mit Error Handling, Loading States, Accessibility und Backend-Verbesserungen

**Wichtig:** Phase 6 muss abgeschlossen sein (Settings funktionieren)

**Was wird gemacht:**

1. **Error Boundaries** (Frontend):
   - React Error Boundary Component für unerwartete Fehler
   - Fallback-UI statt weißer Seite
   - Error-Logging (Console + Optional: Sentry)
   
2. **Loading States** (Frontend):
   - Zentrale Loading Component (Spinner)
   - Skeleton Screens für Listen (Projects, TimeEntries, Todos)
   - Loading-States in allen API-Calls konsistent
   - Progress Indicator für Timer-Saves
   
3. **Toast Notification System** (Frontend):
   - Zentrale Toast-Component für Erfolgs-/Fehlermeldungen
   - Toast Context + Provider
   - Auto-Dismiss nach 3-5 Sekunden
   - Success/Error/Info Varianten
   
4. **Accessibility (A11y)** (Frontend):
   - ARIA Labels für Screen Reader
   - Keyboard Navigation (Tab-Order, Enter/Space)
   - Focus Management (Modals, Dialogs)
   - Contrast-Check (WCAG AA Standard)
   
5. **Backend Improvements**:
   - Strukturiertes Logging (Python logging module)
   - Besseres Error Handling (Try-Catch, HTTP Exceptions)
   - Environment Variables (.env für DB-Pfad, CORS, Port)
   - CORS für Production-Domain konfigurieren

**Flow:**
1. Fehler passiert → Error Boundary fängt ab → Fallback-UI
2. API Call → Loading Spinner → Daten geladen → Content
3. Aktion erfolgreich → Toast erscheint → Auto-Dismiss
4. Docker: `docker-compose up` → Backend + Frontend starten

**Dependencies:**
- Frontend: Keine neuen (evt. `react-hot-toast` für Toasts)
- Backend: `python-dotenv` für Environment Variables
- Docker: `docker`, `docker-compose`

**Flow:**
1. Fehler passiert → Error Boundary fängt ab → Fallback-UI
2. API Call → Loading Spinner → Daten geladen → Content
3. Aktion erfolgreich → Toast erscheint → Auto-Dismiss
4. User navigiert mit Keyboard → Tab-Order funktioniert
5. Screen Reader → ARIA Labels werden vorgelesen

**Dependencies:**
- Frontend: Keine neuen Dependencies nötig
- Backend: `python-dotenv` für Environment Variables

**Code-Struktur:**
- `frontend/src/components/ErrorBoundary.tsx` + `.module.css` (Error Boundary)
- `frontend/src/components/Loading.tsx` + `.module.css` (Spinner Component)
- `frontend/src/components/Skeleton.tsx` + `.module.css` (Skeleton Screens)
- `frontend/src/components/Toast.tsx` + `.module.css` (Toast Component)
- `frontend/src/context/ToastContext.tsx` (Toast Context + Provider)
- `frontend/src/hooks/useToast.ts` (Toast Hook)
- `backend/.env` + `backend/.env.example` (Environment Config)
- `backend/main.py` Update (Logging, CORS, Error Handling)
- `backend/requirements.txt` Update (python-dotenv)

---

### 7.1 Error Boundary (Frontend)

**components/ErrorBoundary.tsx:**
```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './ui/Button';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    // Optional: Send to error tracking service (Sentry, LogRocket, etc.)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/'; // Navigate to home
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className={styles.container}>
          <div className={styles.content}>
            <AlertTriangle size={48} className={styles.icon} />
            <h1 className={styles.title}>Oops! Something went wrong</h1>
            <p className={styles.message}>
              We're sorry for the inconvenience. The error has been logged.
            </p>
            {this.state.error && (
              <details className={styles.details}>
                <summary>Error Details</summary>
                <pre>{this.state.error.toString()}</pre>
              </details>
            )}
            <div className={styles.actions}>
              <Button onClick={this.handleReset}>Go to Home</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**components/ErrorBoundary.module.css:**
```css
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f8fafc;
}

.content {
  max-width: 32rem;
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.icon {
  color: #ef4444;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem 0;
}

.message {
  color: #64748b;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.details {
  text-align: left;
  background: #f1f5f9;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.details summary {
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.details pre {
  color: #ef4444;
  overflow-x: auto;
  margin: 0.5rem 0 0 0;
}

.actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

@media (max-width: 640px) {
  .actions {
    flex-direction: column;
  }
}
```

**App.tsx Update (Wrap mit ErrorBoundary):**
```typescript
import ErrorBoundary from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Router>
          {/* existing routes */}
        </Router>
      </StoreProvider>
    </ErrorBoundary>
  );
}
```

---

### 7.2 Loading States (Frontend)

**components/Loading.tsx:**
```typescript
import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function Loading({ size = 'md', text }: LoadingProps) {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {text && <p className={styles.text}>{text}</p>}
    </div>
  );
}
```

**components/Loading.module.css:**
```css
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
}

.spinner {
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner.sm {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.spinner.md {
  width: 2.5rem;
  height: 2.5rem;
  border-width: 3px;
}

.spinner.lg {
  width: 4rem;
  height: 4rem;
  border-width: 4px;
}

.text {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
```

**Skeleton Component für Listen:**
```typescript
// components/Skeleton.tsx
import styles from './Skeleton.module.css';

export default function Skeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.avatar} />
          <div className={styles.content}>
            <div className={styles.line} style={{ width: '60%' }} />
            <div className={styles.line} style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

**components/Skeleton.module.css:**
```css
.container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e2e8f0;
}

.avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.375rem;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.line {
  height: 1rem;
  border-radius: 0.25rem;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

**TrackerPage Update (Loading State Beispiel):**
```typescript
import { useEffect, useState } from 'react';
import Loading from '@/components/Loading';
import Skeleton from '@/components/Skeleton';

export default function TrackerPage() {
  const [isLoading, setIsLoading] = useState(true);
  const { projects, timeEntries, todos, refreshAll } = useStore();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await refreshAll();
      setIsLoading(false);
    };
    loadData();
  }, [refreshAll]);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <Loading text="Loading..." />
      </div>
    );
  }

  // existing render
}
```

---

### 7.3 Toast Notification System (Frontend)

**context/ToastContext.tsx:**
```typescript
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: Toast = { id, message, type };
    
    setToasts((prev) => [...prev, toast]);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
```

**components/Toast.tsx:**
```typescript
import { useToast } from '@/context/ToastContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';
import styles from './Toast.module.css';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <XCircle size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div key={toast.id} className={`${styles.toast} ${styles[toast.type]}`}>
          <div className={styles.icon}>{getIcon(toast.type)}</div>
          <p className={styles.message}>{toast.message}</p>
          <button
            className={styles.close}
            onClick={() => removeToast(toast.id)}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
```

**components/Toast.module.css:**
```css
.container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);
  pointer-events: auto;
  min-width: 18rem;
  animation: slideIn 0.3s ease-out;
}

.toast.success {
  border-left: 4px solid #10b981;
}

.toast.success .icon {
  color: #10b981;
}

.toast.error {
  border-left: 4px solid #ef4444;
}

.toast.error .icon {
  color: #ef4444;
}

.toast.info {
  border-left: 4px solid #6366f1;
}

.toast.info .icon {
  color: #6366f1;
}

.icon {
  flex-shrink: 0;
}

.message {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  color: #0f172a;
  font-weight: 500;
}

.close {
  flex-shrink: 0;
  padding: 0.25rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.close:hover {
  color: #0f172a;
  background: #f1f5f9;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .container {
    left: 1rem;
    right: 1rem;
  }

  .toast {
    min-width: auto;
  }
}
```

**App.tsx Update (Add Toast):**
```typescript
import { ToastProvider } from '@/context/ToastContext';
import Toast from '@/components/Toast';

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <StoreProvider>
          <Router>
            {/* routes */}
          </Router>
          <Toast />
        </StoreProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

**Usage Beispiel (PomodoroSettings):**
```typescript
import { useToast } from '@/context/ToastContext';

function PomodoroSettings() {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await api.pomodoroSettings.update({ focus_duration, break_duration });
      await refreshPomodoroSettings();
      showToast('Settings saved successfully!', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
    }
  };
}
```

---

### 7.4 Accessibility (A11y) Improvements

**Keyboard Navigation in Timer:**
```typescript
// Timer.tsx Update
<button
  onClick={handleStart}
  aria-label={isRunning ? 'Pause timer' : 'Start timer'}
  tabIndex={0}
>
  {isRunning ? <Pause /> : <Play />}
</button>

<button
  onClick={handleReset}
  aria-label="Reset timer"
  tabIndex={0}
  disabled={!isRunning && time === duration}
>
  <Square />
</button>
```

**Focus Management in Modals/Forms:**
```typescript
// Input Component Update
export default function Input({ label, ...props }: InputProps) {
  const id = useId(); // React 18

  return (
    <div className={styles.group}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        className={styles.input}
        aria-required={props.required}
        aria-invalid={props['aria-invalid']}
        {...props}
      />
    </div>
  );
}
```

**Screen Reader Announcements:**
```typescript
// Add visually-hidden class for screen readers
// index.css Update
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**ARIA Live Regions für Timer:**
```typescript
// Timer.tsx Update
<div aria-live="polite" aria-atomic="true" className="sr-only">
  Timer: {formatTime(time)}
</div>
```

---

### 7.5 Backend Improvements

**backend/.env.example:**
```env
# Database
DATABASE_URL=sqlite:///./timetracking.db

# Server
HOST=0.0.0.0
PORT=8000

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174,https://yourdomain.com

# Logging
LOG_LEVEL=INFO
```

**backend/.env:**
```env
DATABASE_URL=sqlite:///./timetracking.db
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
LOG_LEVEL=DEBUG
```

**backend/main.py Update (Environment Variables + Logging):**
```python
import os
import logging
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

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

# Error Handling Example
@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    try:
        logger.info("Fetching all projects")
        projects = db.query(models.Project).all()
        return projects
    except Exception as e:
        logger.error(f"Error fetching projects: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./timetracking.db")
```

**requirements.txt Update:**
```txt
fastapi==0.104.1
uvicorn==0.24.0
sqlalchemy==2.0.23
pydantic==2.5.0
python-dotenv==1.0.0
```

---

### 7.6 Test Phase 7

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Test 1: Error Boundary**
1. Navigiere zu einer Seite
2. Öffne DevTools Console
3. Simuliere Fehler: In Browser Console eingeben: `throw new Error('Test error')`
4. Error Boundary Fallback sollte erscheinen
5. "Go to Home" Button funktioniert
6. Seite neu laden → App funktioniert normal

**Test 2: Loading States**
1. Navigiere zu `/` (Tracker)
2. Refresh → Loading Spinner erscheint kurz
3. Navigiere zu `/stats` → Loading während Datenverarbeitung
4. Network Throttling (DevTools): "Slow 3G" → Loading States länger sichtbar

**Test 3: Toast Notifications**
1. Navigiere zu `/settings`
2. Ändere Werte und speichere
3. Grüner Success-Toast erscheint oben rechts
4. Toast verschwindet nach 3 Sekunden
5. Ungültige Werte → Error Toast
6. Mehrere Aktionen → Toasts stapeln sich

**Test 4: Accessibility**
1. Keyboard Navigation:
   - Tab durch alle interaktiven Elemente
   - Enter/Space aktiviert Buttons
   - Timer mit Keyboard steuerbar
2. Screen Reader (VoiceOver macOS / NVDA Windows):
   - Labels werden vorgelesen
   - Button-Zweck erkennbar
   - Live Regions für Timer
3. Contrast Check (DevTools Lighthouse):
   - Accessibility Score > 90

**Test 5: Backend Logging**
1. Backend Terminal zeigt strukturierte Logs:
   ```
   2025-12-20 10:00:00 - main - INFO - Fetching all projects
   2025-12-20 10:00:01 - main - INFO - Project created: Website Redesign
   ```
2. Fehler werden geloggt mit Traceback
3. Environment Variables funktionieren (`.env` wird gelesen)

**Validierung:**
- ✅ Error Boundary fängt Fehler ab, Fallback-UI funktioniert
- ✅ Loading States in allen Pages (Tracker, Stats, Todos, Settings)
- ✅ Toast System funktioniert (Success, Error, Auto-Dismiss)
- ✅ Keyboard Navigation vollständig
- ✅ ARIA Labels vorhanden
- ✅ Backend Logging strukturiert
- ✅ Environment Variables funktionieren

**Performance Check:**
- Lighthouse Audit (DevTools):
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 80

**Code-Konsistenz Check:**
- ✅ Error Boundary als Class Component (React Pattern)
- ✅ Loading/Skeleton mit CSS Animations
- ✅ Toast Context + Provider Pattern
- ✅ useToast Hook für einfache Nutzung
- ✅ Backend mit python-dotenv + logging
- ✅ ARIA Labels + Keyboard Navigation

---

## Phase 8: Docker & Deployment

**Ziel:** Docker Setup und Production Deployment auf Cloud-Platformen

**Wichtig:** Phase 7 muss abgeschlossen sein (Error Handling, Loading States, Logging funktionieren)

**Was wird gemacht:**

1. **Docker Setup**:
   - `Dockerfile` für Backend (Python + FastAPI)
   - `Dockerfile` für Frontend (Node Build + Nginx)
   - `docker-compose.yml` für lokales Multi-Container Setup
   - `.dockerignore` Files
   
2. **Production Build**:
   - Frontend Build Scripts optimieren
   - Environment Templates (.env.example)
   - Production Config für Nginx
   
3. **Deployment Guide**:
   - Railway/Render für Backend
   - Vercel für Frontend
   - Environment Variables Setup
   - CORS Configuration
   
4. **Documentation**:
   - DEPLOYMENT.md mit Step-by-Step Anleitung
   - README.md Update
   - Docker-Anleitung

**Flow:**
1. Docker: `docker-compose up --build` → Backend + Frontend starten lokal
2. Production: Frontend auf Vercel deployen
3. Production: Backend auf Railway/Render deployen
4. CORS: Backend Environment Variables mit Frontend-URL konfigurieren
5. Testing: Production URLs testen

**Dependencies:**
- Docker + docker-compose installiert
- Vercel Account (kostenlos)
- Railway/Render Account (kostenlos)

**Code-Struktur:**
- `backend/Dockerfile` (Backend Container)
- `backend/.dockerignore` (Docker Ignore)
- `frontend/Dockerfile` (Frontend Container mit Nginx)
- `frontend/.dockerignore` (Docker Ignore)
- `frontend/nginx.conf` (Nginx Config)
- `docker-compose.yml` (Orchestration im Root)
- `DEPLOYMENT.md` (Deployment Guide)
- `README.md` Update (Docker + Deployment Infos)

---

### 8.1 Docker Setup

**backend/Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create database directory
RUN mkdir -p /app/data

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**backend/.dockerignore:**
```
__pycache__
*.pyc
*.pyo
*.pyd
.Python
venv/
*.db
.env
.git
```

---

### 8.2 Frontend Docker Setup

**frontend/Dockerfile:**
```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**frontend/nginx.conf:**
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

**frontend/.dockerignore:**
```
node_modules
dist
.git
.env
*.log
```

---

### 8.3 docker-compose.yml

**docker-compose.yml (Root):**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: timetracking-backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:///./data/timetracking.db
      - CORS_ORIGINS=http://localhost:3000,http://localhost:5173
      - LOG_LEVEL=INFO
    volumes:
      - backend-data:/app/data
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: timetracking-frontend
    ports:
      - "3000:80"
    environment:
      - VITE_API_URL=http://localhost:8000/api
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend-data:
```

---

### 8.4 Deployment Guide

**DEPLOYMENT.md:**
```markdown
# Deployment Guide

## Prerequisites
- Git repository
- Vercel account (Frontend)
- Railway/Render account (Backend)
- Docker (optional, for local testing)

## Local Docker Deployment

### 1. Build and Run with Docker Compose
\`\`\`bash
# From root directory
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
\`\`\`

### 2. Stop Containers
\`\`\`bash
docker-compose down

# Remove volumes (resets database)
docker-compose down -v
\`\`\`

## Production Deployment

### Backend (Railway/Render)

#### Option 1: Railway
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway auto-detects Dockerfile
5. Set environment variables:
   - `DATABASE_URL`: Railway provides Postgres URL (or use SQLite)
   - `CORS_ORIGINS`: Your frontend URL (e.g., `https://yourapp.vercel.app`)
   - `LOG_LEVEL`: `INFO`
6. Deploy → Get your backend URL (e.g., `https://yourapp.up.railway.app`)

#### Option 2: Render
1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Environment Variables (same as above)
6. Create Web Service → Get URL

### Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com)
2. New Project → Import from Git
3. Select your repository
4. Settings:
   - Root Directory: `frontend`
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Environment Variables:
   - `VITE_API_URL`: Your backend URL + `/api` (e.g., `https://yourapp.up.railway.app/api`)
6. Deploy

### Post-Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/api/projects
   ```

2. **Test Frontend:**
   - Visit your Vercel URL
   - Check DevTools Network tab
   - Verify API calls to backend work

3. **Update CORS:**
   - Add Vercel URL to backend `CORS_ORIGINS`
   - Redeploy backend

## Environment Variables Summary

### Backend (.env)
\`\`\`env
DATABASE_URL=sqlite:///./data/timetracking.db
CORS_ORIGINS=https://yourapp.vercel.app
LOG_LEVEL=INFO
HOST=0.0.0.0
PORT=8000
\`\`\`

### Frontend (.env)
\`\`\`env
VITE_API_URL=https://yourapp.railway.app/api
\`\`\`

## Monitoring

- **Railway:** Built-in logs and metrics
- **Render:** Logs in dashboard
- **Vercel:** Analytics and logs in dashboard

## Troubleshooting

### CORS Errors
- Check `CORS_ORIGINS` in backend includes frontend URL
- Verify frontend `VITE_API_URL` points to backend

### Database Issues
- Railway: Use Postgres instead of SQLite for production
- Render: Add persistent disk for SQLite

### Build Failures
- Check Node version (use 20.x)
- Check Python version (use 3.11)
- Verify `package.json` and `requirements.txt`
\`\`\`

**README.md Update:**
```markdown
# Timetracking App

Pomodoro-based time tracking application with project and todo management.

## Features
- ⏱️ Pomodoro Timer with Focus/Break modes
- 📊 Statistics & Charts (Daily, Weekly, All-Time)
- 📁 Project Management with color coding
- ✅ Todo Management with project assignment
- ⚙️ Customizable Pomodoro Settings
- 📱 Responsive Design (Mobile & Desktop)

## Tech Stack
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** FastAPI + SQLAlchemy + SQLite
- **Charts:** Recharts
- **Icons:** Lucide React
- **Styling:** CSS Modules

## Local Development

### Prerequisites
- Node.js 20+
- Python 3.11+

### Setup

1. Clone repository:
\`\`\`bash
git clone <your-repo-url>
cd TimetrackingApp
\`\`\`

2. Backend:
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

3. Frontend:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

4. Open: http://localhost:5173

## Docker

\`\`\`bash
docker-compose up --build
\`\`\`

Access:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide.

## License
MIT
\`\`\`

---

### 8.6 Test Phase 8

```bash
# Docker Containers müssen laufen
```

**Test 1: Docker Build**
1. `docker-compose up --build` ausführen
2. Backend Container startet erfolgreich
3. Frontend Container startet erfolgreich
4. Keine Build-Errors

**Test 2: Docker Runtime**
1. Frontend auf http://localhost:3000 erreichbar
2. Backend auf http://localhost:8000 erreichbar
3. API Docs: http://localhost:8000/docs funktioniert
4. App vollständig funktionsfähig in Docker
5. Daten persistieren (Volume funktioniert)
6. `docker-compose down -v` → Datenbank reset funktioniert

**Test 3: Production Build**
1. Frontend Build:
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```
2. Build erfolgreich (dist/ Ordner erstellt)
3. Preview läuft ohne Fehler
4. Assets optimiert (DevTools Network: Minified JS/CSS)
5. Source Maps verfügbar für Debugging

**Test 4: Production Deployment (Optional)**
1. Backend auf Railway/Render deployen
2. Frontend auf Vercel deployen
3. Environment Variables konfiguriert
4. CORS konfiguriert mit Frontend-URL
5. API Calls funktionieren zwischen Frontend und Backend
6. Production URLs erreichbar

**Validierung:**
- ✅ Docker Setup läuft (Backend + Frontend)
- ✅ docker-compose.yml funktioniert
- ✅ Volumes für Datenpersistenz
- ✅ Production Build erfolgreich
- ✅ DEPLOYMENT.md vorhanden mit Railway/Vercel Guide
- ✅ README aktualisiert mit Docker-Anleitung
- ✅ nginx.conf für optimales Frontend-Serving
- ✅ .dockerignore Files vorhanden

**Code-Konsistenz Check:**
- ✅ Dockerfile Best Practices (Multi-Stage für Frontend)
- ✅ docker-compose mit environment variables
- ✅ Backend .env.example Template
- ✅ Frontend nginx.conf für SPA-Routing
- ✅ .dockerignore verhindert unnötige Files

---

---

### 8.5 README Update

**README.md Update:**

```bash
# Backend läuft auf Port 8000
# Frontend läuft auf Port 5173
```

**Test 1: Error Boundary**
1. Navigiere zu einer Seite
2. Öffne DevTools Console
3. Simuliere Fehler: In Browser Console eingeben: `throw new Error('Test error')`
4. Error Boundary Fallback sollte erscheinen
5. "Go to Home" Button funktioniert
6. Seite neu laden → App funktioniert normal

**Test 2: Loading States**
1. Navigiere zu `/` (Tracker)
2. Refresh → Loading Spinner erscheint kurz
3. Navigiere zu `/stats` → Loading während Datenverarbeitung
4. Network Throttling (DevTools): "Slow 3G" → Loading States länger sichtbar

**Test 3: Toast Notifications**
1. Navigiere zu `/settings`
2. Ändere Werte und speichere
3. Grüner Success-Toast erscheint oben rechts
4. Toast verschwindet nach 3 Sekunden
5. Ungültige Werte → Error Toast
6. Mehrere Aktionen → Toasts stapeln sich

**Test 4: Accessibility**
1. Keyboard Navigation:
   - Tab durch alle interaktiven Elemente
   - Enter/Space aktiviert Buttons
   - Timer mit Keyboard steuerbar
2. Screen Reader (VoiceOver macOS / NVDA Windows):
   - Labels werden vorgelesen
   - Button-Zweck erkennbar
   - Live Regions für Timer
3. Contrast Check (DevTools Lighthouse):
   - Accessibility Score > 90

**Test 5: Backend Logging**
1. Backend Terminal zeigt strukturierte Logs:
   ```
   2025-12-20 10:00:00 - main - INFO - Fetching all projects
   2025-12-20 10:00:01 - main - INFO - Project created: Website Redesign
   ```
2. Fehler werden geloggt mit Traceback
3. Environment Variables funktionieren (`.env` wird gelesen)

**Test 6: Docker**
1. `docker-compose up --build`
2. Frontend auf http://localhost:3000 erreichbar
3. Backend auf http://localhost:8000 erreichbar
4. API Docs: http://localhost:8000/docs
5. App funktioniert vollständig in Docker
6. Daten persistieren (Volume funktioniert)
7. `docker-compose down -v` → Datenbank reset

**Test 7: Production Build**
1. Frontend Build:
   ```bash
   cd frontend
   npm run build
   npm run preview  # Preview production build
   ```
2. Build erfolgreich (dist/ erstellt)
3. Preview läuft ohne Fehler
4. Assets optimiert (DevTools Network: Minified JS/CSS)

**Validierung:**
- ✅ Error Boundary fängt Fehler ab, Fallback-UI funktioniert
- ✅ Loading States in allen Pages (Tracker, Stats, Todos, Settings)
- ✅ Toast System funktioniert (Success, Error, Auto-Dismiss)
- ✅ Keyboard Navigation vollständig
- ✅ ARIA Labels vorhanden
- ✅ Backend Logging strukturiert
- ✅ Environment Variables funktionieren
- ✅ Docker Setup läuft (Backend + Frontend)
- ✅ Production Build erfolgreich
- ✅ DEPLOYMENT.md vorhanden mit Railway/Vercel Guide
- ✅ README aktualisiert

**Performance Check:**
- Lighthouse Audit (DevTools):
  - Performance: > 90
  - Accessibility: > 90
  - Best Practices: > 90
  - SEO: > 80

**Code-Konsistenz Check:**
- ✅ Error Boundary als Class Component (React Pattern)
- ✅ Loading/Skeleton mit CSS Animations
- ✅ Toast Context + Provider Pattern
- ✅ useToast Hook für einfache Nutzung
- ✅ Backend mit python-dotenv + logging
- ✅ Dockerfile Best Practices (Multi-Stage für Frontend)
- ✅ docker-compose mit Volumes für Datenpersistenz
- ✅ nginx.conf für optimales Frontend-Serving

---

## Phase 9: Dark Mode & UI Optimierung

**Ziel:** Vollständiger Dark Mode mit Persistence, Theme Toggle und optimierte UI

### 9.1 Theme Context & Provider

**Erstellen: frontend/src/context/ThemeContext.tsx**

```typescript
import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. localStorage
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    
    // 2. System Preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 3. Default
    return 'light';
  });

  useEffect(() => {
    // Update document class
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### 9.2 CSS Variables für Theming

**Aktualisieren: frontend/src/index.css**

```css
:root {
  /* Light Theme (Default) */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-bg-tertiary: #f3f4f6;
  
  --color-text-primary: #111827;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  
  --color-border: #e5e7eb;
  --color-border-hover: #d1d5db;
  
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-light: #eef2ff;
  
  --color-success: #10b981;
  --color-success-light: #d1fae5;
  --color-error: #ef4444;
  --color-error-light: #fee2e2;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

[data-theme='dark'] {
  /* Dark Theme */
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;
  
  --color-border: #334155;
  --color-border-hover: #475569;
  
  --color-primary: #818cf8;
  --color-primary-hover: #6366f1;
  --color-primary-light: #1e1b4b;
  
  --color-success: #34d399;
  --color-success-light: #064e3b;
  --color-error: #f87171;
  --color-error-light: #7f1d1d;
  --color-warning: #fbbf24;
  --color-warning-light: #78350f;
  
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: background-color var(--transition-normal), color var(--transition-normal);
}

#root {
  min-height: 100vh;
}
```

### 9.3 Theme Toggle Button Component

**Erstellen: frontend/src/components/ThemeToggle.tsx**

```typescript
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.toggle}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className={styles.icon} />
      ) : (
        <Sun className={styles.icon} />
      )}
    </button>
  );
}
```

**Erstellen: frontend/src/components/ThemeToggle.module.css**

```css
.toggle {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.toggle:hover {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border-hover);
  transform: scale(1.05);
}

.toggle:active {
  transform: scale(0.95);
}

.icon {
  width: 20px;
  height: 20px;
  transition: transform var(--transition-fast);
}

.toggle:hover .icon {
  transform: rotate(15deg);
}

[data-theme='dark'] .toggle {
  box-shadow: var(--shadow-sm);
}
```

### 9.4 Sidebar/Layout Integration

**Aktualisieren: frontend/src/components/Sidebar.tsx**

Füge ThemeToggle in der Sidebar hinzu (z.B. unten oder oben im Header):

```typescript
import ThemeToggle from './ThemeToggle';

// In der Sidebar-Komponente, z.B. im Header oder Footer:
<div className={styles.header}>
  <h1>Timetracking</h1>
  <ThemeToggle />
</div>
```

### 9.5 App.tsx Integration

**Aktualisieren: frontend/src/App.tsx**

```typescript
import { BrowserRouter as Router } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
// ... andere Imports

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Router>
            <StoreProvider>
              {/* App Content */}
            </StoreProvider>
          </Router>
          <Toast />
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

### 9.6 Komponenten CSS auf CSS Variables umstellen

**Aktualisieren: Alle Component CSS Module**

Ersetze hardcoded Colors durch CSS Variables:

**Beispiel - Button.module.css:**

```css
.button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: var(--color-primary);
  color: white;
}

.button:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.secondary {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.secondary:hover:not(:disabled) {
  background-color: var(--color-bg-tertiary);
  border-color: var(--color-border-hover);
}
```

**Beispiel - Card.module.css:**

```css
.card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-border-hover);
}
```

**Beispiel - Input.module.css:**

```css
.input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.875rem;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  transition: all var(--transition-fast);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}
```

### 9.7 Timer Component Dark Mode Optimierung

**Aktualisieren: frontend/src/components/Timer.module.css**

Optimiere Timer für Dark Mode mit besseren Kontrasten:

```css
.timer {
  text-align: center;
  padding: 2rem;
}

.display {
  font-size: 4rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  margin: 2rem 0;
  color: var(--color-text-primary);
  text-shadow: var(--shadow-sm);
}

.modeIndicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: all var(--transition-fast);
}

[data-theme='dark'] .modeIndicator {
  box-shadow: var(--shadow-sm);
}

.focus {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.break {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}
```

### 9.8 Statistics Charts Dark Mode

**Aktualisieren: frontend/src/pages/StatsPage.tsx**

Passe Recharts Theme dynamisch an:

```typescript
import { useTheme } from '../context/ThemeContext';

export default function StatsPage() {
  const { theme } = useTheme();
  
  // Chart Colors basierend auf Theme
  const chartColors = {
    primary: theme === 'dark' ? '#818cf8' : '#6366f1',
    success: theme === 'dark' ? '#34d399' : '#10b981',
    text: theme === 'dark' ? '#cbd5e1' : '#6b7280',
    grid: theme === 'dark' ? '#334155' : '#e5e7eb',
  };

  return (
    // ... Stats Content
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
      <XAxis 
        dataKey="name" 
        stroke={chartColors.text}
        style={{ fontSize: '0.75rem' }}
      />
      <YAxis 
        stroke={chartColors.text}
        style={{ fontSize: '0.75rem' }}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
          border: `1px solid ${theme === 'dark' ? '#334155' : '#e5e7eb'}`,
          borderRadius: '8px',
          color: chartColors.text,
        }}
      />
      <Bar dataKey="hours" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
    </BarChart>
  );
}
```

### 9.9 Loading & Skeleton Dark Mode

**Aktualisieren: frontend/src/components/Skeleton.module.css**

```css
.item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  margin-bottom: 0.75rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.content {
  flex: 1;
}

.line {
  height: 12px;
  background: linear-gradient(
    90deg,
    var(--color-bg-tertiary) 0%,
    var(--color-border) 50%,
    var(--color-bg-tertiary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

### 9.10 Toast Dark Mode

**Aktualisieren: frontend/src/components/Toast.module.css**

```css
.container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: none;
}

.toast {
  min-width: 300px;
  padding: 1rem 1.25rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  pointer-events: auto;
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.success {
  border-left: 4px solid var(--color-success);
}

.error {
  border-left: 4px solid var(--color-error);
}

.info {
  border-left: 4px solid var(--color-primary);
}

.icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.success .icon {
  color: var(--color-success);
}

.error .icon {
  color: var(--color-error);
}

.info .icon {
  color: var(--color-primary);
}

.message {
  flex: 1;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: var(--color-text-tertiary);
  transition: color var(--transition-fast);
  border-radius: 4px;
}

.close:hover {
  color: var(--color-text-primary);
  background-color: var(--color-bg-tertiary);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .container {
    left: 1rem;
    right: 1rem;
  }
  
  .toast {
    min-width: unset;
  }
}
```

---

## Testing Phase 9

**Test 1: Theme Toggle**
1. App öffnen im Browser
2. Theme Toggle Button in Sidebar klicken
3. ✅ Theme wechselt zwischen Light/Dark
4. ✅ Smooth Transitions (keine Flackern)
5. ✅ Icon wechselt (Sun ↔ Moon)

**Test 2: Theme Persistence**
1. Dark Mode aktivieren
2. Browser-Tab schließen
3. App neu öffnen
4. ✅ Dark Mode ist noch aktiv (localStorage funktioniert)

**Test 3: System Preference**
1. localStorage löschen: `localStorage.removeItem('theme')`
2. Browser Dark Mode aktivieren (System Settings)
3. App neu laden
4. ✅ App respektiert System Preference

**Test 4: Alle Komponenten Dark Mode**
Prüfe jede Page/Component:
- ✅ Tracker Page: Timer, Buttons, Cards
- ✅ Stats Page: Charts (Farben), Cards, Text
- ✅ Todos Page: Todo-Liste, Checkboxen, Inputs
- ✅ Settings Page: Form-Inputs, Buttons
- ✅ Sidebar: Navigation, Active States
- ✅ Toast Notifications: Success, Error, Info
- ✅ Loading States & Skeletons
- ✅ Error Boundary Fallback

**Test 5: Kontrast & Accessibility**
1. DevTools → Lighthouse → Accessibility Audit
2. ✅ Accessibility Score > 90
3. ✅ Kontrast-Ratio erfüllt WCAG AA (4.5:1)
4. Dark Mode Farben getestet mit Contrast Checker

**Test 6: Performance**
1. Theme Toggle mehrmals schnell klicken
2. ✅ Keine Performance-Probleme
3. ✅ Transitions smooth (keine Layout Shifts)
4. DevTools Performance: Kein Memory Leak

**Test 7: Cross-Browser**
- ✅ Chrome/Edge: Dark Mode funktioniert
- ✅ Firefox: Dark Mode funktioniert
- ✅ Safari: Dark Mode funktioniert
- ✅ Mobile Safari: Dark Mode funktioniert

**Validierung:**
- ✅ ThemeContext + Provider implementiert
- ✅ Theme Toggle Button in Sidebar
- ✅ CSS Variables für alle Colors
- ✅ Alle Component CSS auf Variables umgestellt
- ✅ Dark Theme in index.css definiert
- ✅ localStorage Persistence funktioniert
- ✅ System Preference Detection funktioniert
- ✅ Smooth Transitions (background, colors)
- ✅ Charts Dark Mode kompatibel
- ✅ Toast, Loading, Skeleton Dark Mode ready
- ✅ Accessibility Standards erfüllt
- ✅ Keine hardcoded Colors mehr im Code

**Code-Konsistenz Check:**
- ✅ ThemeContext folgt Context Pattern (wie ToastContext)
- ✅ useTheme Hook mit Error Handling
- ✅ CSS Variables Convention: `--color-*`, `--shadow-*`
- ✅ data-theme Attribut am html Element
- ✅ TypeScript Types für Theme ('light' | 'dark')
- ✅ localStorage Key: 'theme'
- ✅ Fallback: System Preference → Default 'light'

**UI/UX Check:**
- ✅ Toggle Button Position logisch (Sidebar Header/Footer)
- ✅ Icon Animation on Hover (Rotation)
- ✅ Tooltip/aria-label vorhanden
- ✅ Kein Flackern beim Theme Switch
- ✅ Alle Farben haben ausreichend Kontrast
- ✅ Focus States sichtbar in beiden Themes

---

## Phase 10: Multi-User Support mit Authentication

**Ziel:** Mehrere Benutzer können sich mit Username/Passwort einloggen. Jeder User hat eigene Projekte, Todos, Time Entries und Settings. Keine Zusammenarbeit zwischen Usern.

**Scope:**
- User Registration & Login
- Session Management (JWT Tokens)
- User-spezifische Daten (isolation)
- Login Screen vor App-Zugriff
- Protected Routes
- Logout Funktionalität

---

### 10.1 Backend: User Model & Authentication

**Backend Models erweitern:**

**backend/models.py - User Model hinzufügen:**
```python
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import bcrypt

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    # Relationships
    projects = relationship("Project", back_populates="user", cascade="all, delete-orphan")
    time_entries = relationship("TimeEntry", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("PomodoroSettings", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.hashed_password.encode('utf-8'))
    
    @staticmethod
    def hash_password(password: str) -> str:
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
```

**Bestehende Models erweitern (user_id Foreign Key):**

```python
class Project(Base):
    __tablename__ = "projects"
    # ... existing fields ...
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="projects")

class TimeEntry(Base):
    __tablename__ = "time_entries"
    # ... existing fields ...
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="time_entries")

class PomodoroSettings(Base):
    __tablename__ = "pomodoro_settings"
    # ... existing fields ...
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    user = relationship("User", back_populates="settings")
```

**backend/schemas.py - User Schemas:**
```python
from pydantic import BaseModel, validator

class UserCreate(BaseModel):
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
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None
```

**backend/auth.py - JWT Authentication:**
```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from models import User
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user
```

**Dependencies installieren:**
```bash
cd backend
pip install python-jose[cryptography] bcrypt python-multipart
pip freeze > requirements.txt
```

---

### 10.2 Backend: Auth Endpoints

**backend/main.py - Auth Routes hinzufügen:**
```python
from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from auth import create_access_token, get_current_user
from models import User
from schemas import UserCreate, UserLogin, UserResponse, Token
from datetime import timedelta

app = FastAPI()

# ... existing imports and setup ...

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    # Check if username exists
    existing_user = db.query(User).filter(User.username == user_data.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = User.hash_password(user_data.password)
    new_user = User(
        username=user_data.username,
        hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user

@app.post("/api/auth/login", response_model=Token)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == user_data.username).first()
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
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user
```

---

### 10.3 Backend: Protected Routes mit User Isolation

**Alle bestehenden Endpoints anpassen:**

**Beispiel - Projects Endpoints:**
```python
@app.get("/api/projects", response_model=List[ProjectResponse])
def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.user_id == current_user.id).all()
    return projects

@app.post("/api/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    new_project = Project(
        **project.dict(),
        user_id=current_user.id
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

# Repeat for: PUT, DELETE - always filter by current_user.id
```

**Repeat für alle Endpoints:**
- `/api/projects/*` - Filter nach user_id
- `/api/todos/*` - Filter nach project.user_id
- `/api/time-entries/*` - Filter nach user_id
- `/api/settings/*` - Filter nach user_id

**WICHTIG: Ownership Validation:**
```python
def get_project_or_404(project_id: int, user_id: int, db: Session) -> Project:
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == user_id
    ).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
```

---

### 10.4 Database Migration

**Datenbank neu initialisieren (ACHTUNG: Löscht alle Daten!):**

```bash
cd backend
rm timetracker.db
# main.py: Base.metadata.create_all(bind=engine) läuft beim Start
python -m uvicorn main:app --reload
```

**Alternative: Alembic Migrations (optional für Production):**
```bash
pip install alembic
alembic init alembic
# Alembic Config + Migrations erstellen
```

---

### 10.5 Frontend: Auth Context & Token Management

**frontend/src/context/AuthContext.tsx:**
```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Invalid token
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Login failed');
    }

    const data = await response.json();
    const newToken = data.access_token;
    
    localStorage.setItem('token', newToken);
    setToken(newToken);
    await fetchUser(newToken);
    navigate('/');
  };

  const register = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    // Auto-login after registration
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

### 10.6 Frontend: API Client mit Token

**frontend/src/lib/api.ts - Token in alle Requests einfügen:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
}

export async function fetchProjects() {
  const response = await fetch(`${API_URL}/projects`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch projects');
  return response.json();
}

export async function createProject(data: ProjectCreate) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create project');
  return response.json();
}

// Repeat for all API functions: todos, time-entries, settings
```

---

### 10.7 Frontend: Login & Register Pages

**frontend/src/pages/LoginPage.tsx:**
```typescript
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className={styles.subtitle}>
            {isRegister 
              ? 'Sign up to start tracking your time' 
              : 'Sign in to continue to your workspace'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            minLength={3}
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            minLength={6}
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Loading...' : (isRegister ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className={styles.toggleButton}
          >
            {isRegister 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
}
```

**frontend/src/pages/LoginPage.module.css:**
```css
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  padding: 1rem;
}

.card {
  width: 100%;
  max-width: 28rem;
  padding: 2.5rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.error {
  padding: 0.75rem;
  background: var(--color-error-light);
  border: 1px solid var(--color-error);
  border-radius: 0.5rem;
  color: var(--color-error);
  font-size: 0.875rem;
  text-align: center;
}

.footer {
  margin-top: 1.5rem;
  text-align: center;
}

.toggleButton {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: 0.875rem;
  cursor: pointer;
  text-decoration: underline;
  transition: opacity var(--transition-fast);
}

.toggleButton:hover {
  opacity: 0.8;
}
```

---

### 10.8 Frontend: Protected Routes

**frontend/src/components/ProtectedRoute.tsx:**
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './Loading';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

**frontend/src/App.tsx - Routes mit Protection:**
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
// ... other imports

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public Route */}
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <StoreProvider>
                      <Layout>
                        <Routes>
                          <Route index element={<Navigate to="/tracker" replace />} />
                          <Route path="/tracker" element={<TrackerPage />} />
                          <Route path="/stats" element={<StatsPage />} />
                          <Route path="/todos" element={<TodosPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                        </Routes>
                      </Layout>
                    </StoreProvider>
                  </ProtectedRoute>
                } />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
```

---

### 10.9 Frontend: Logout Button in Sidebar

**frontend/src/components/Layout.tsx - User Info + Logout:**
```typescript
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        {/* Logo + Theme Toggle */}
        <div className={styles.logo}>
          <Clock size={28} />
          <span>Timetracker</span>
          <ThemeToggle />
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          {/* ... existing nav items ... */}
        </nav>

        {/* User Info + Logout at Bottom */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <User size={18} />
            <span className={styles.username}>{user?.username}</span>
          </div>
          <button
            onClick={logout}
            className={styles.logoutButton}
            title="Logout"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {children}
      </main>
    </div>
  );
}
```

**frontend/src/components/Layout.module.css - User Section Styles:**
```css
.userSection {
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.userInfo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.username {
  font-weight: 500;
}

.logoutButton {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: all var(--transition-fast);
  text-align: left;
  width: 100%;
}

.logoutButton:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-error);
}
```

---

### 10.10 Testing & Validierung

**Test 1: User Registration**
1. Browser öffnen: http://localhost:5173/login
2. ✅ "Sign Up" klicken
3. ✅ Username (min. 3 Zeichen) + Password (min. 6 Zeichen) eingeben
4. ✅ Submit → Erfolgreiche Registration + Auto-Login
5. ✅ Redirect zu Tracker Page
6. ✅ Username in Sidebar sichtbar

**Test 2: User Login**
1. Logout klicken → Redirect zu /login
2. ✅ Username + Password eingeben
3. ✅ Submit → Erfolgreicher Login
4. ✅ Token in localStorage gespeichert
5. ✅ Redirect zu /tracker
6. ✅ Bestehende Projekte des Users laden

**Test 3: Data Isolation**
1. User A einloggen
2. ✅ Projekt "Project A" erstellen
3. ✅ Todos für Project A erstellen
4. ✅ Time Entry starten
5. Logout
6. User B einloggen (neuer User)
7. ✅ Projekte leer (User A's Projekte nicht sichtbar)
8. ✅ User B kann eigene Projekte erstellen
9. ✅ User A einloggen → Alle Daten noch vorhanden

**Test 4: Token Expiration**
1. Token manuell aus localStorage löschen
2. ✅ Refresh → Redirect zu /login
3. ✅ API Request ohne Token → 401 Unauthorized
4. ✅ Login → Neue API Requests mit Token erfolgreich

**Test 5: Protected Routes**
1. Browser öffnen ohne Login: http://localhost:5173/tracker
2. ✅ Automatischer Redirect zu /login
3. ✅ Nach Login: Redirect zurück zu /tracker
4. ✅ Direkte URL-Navigation nur mit gültigem Token

**Test 6: Logout**
1. Eingeloggt im Tracker
2. ✅ Logout Button in Sidebar klicken
3. ✅ Token aus localStorage entfernt
4. ✅ Redirect zu /login
5. ✅ User State cleared
6. ✅ Zurück-Button führt zu Login (nicht zur App)

**Validierung Checkliste:**

**Backend:**
- ✅ User Model mit bcrypt password hashing
- ✅ JWT Token Generation & Validation
- ✅ /api/auth/register Endpoint
- ✅ /api/auth/login Endpoint
- ✅ /api/auth/me Endpoint
- ✅ get_current_user Dependency
- ✅ Alle Endpoints protected (Depends(get_current_user))
- ✅ User ID in allen Models (Projects, TimeEntries, Settings)
- ✅ Filter nach user_id in allen GET Endpoints
- ✅ Ownership Validation in UPDATE/DELETE

**Frontend:**
- ✅ AuthContext mit login/register/logout
- ✅ Token in localStorage persistence
- ✅ LoginPage mit Register Toggle
- ✅ ProtectedRoute Component
- ✅ API Client mit Authorization Headers
- ✅ User Info in Sidebar
- ✅ Logout Button funktional
- ✅ Loading States während Auth
- ✅ Error Handling (wrong password, username taken)
- ✅ Auto-redirect nach Login/Logout

**Security:**
- ✅ Passwords gehashed (bcrypt)
- ✅ JWT Token mit Expiration
- ✅ Bearer Token in Authorization Header
- ✅ 401 Unauthorized bei invalid token
- ✅ User Isolation in Database Queries
- ✅ Keine User-Daten über API exposed (außer username)

**UX:**
- ✅ Login Form Validation (min length)
- ✅ Error Messages bei Login/Register Fehlern
- ✅ Loading States in Login Form
- ✅ Smooth Redirects
- ✅ Logout Confirmation (optional)
- ✅ Remember Me über localStorage

---

### 10.11 Optional: Zusätzliche Features

**Nice-to-Have (nicht im Scope, aber erwähnenswert):**

1. **Email statt Username:**
   - User Model: `email` field mit validation
   - Forgot Password Flow

2. **Refresh Tokens:**
   - Längere Session mit Refresh Token
   - Access Token kürzer (15 min)

3. **Profile Page:**
   - Username ändern
   - Password ändern
   - Account löschen

4. **Admin Panel:**
   - User Management
   - Statistics über alle User

5. **Social Login:**
   - OAuth2 (Google, GitHub)
   - FastAPI Social Auth

**Für diesen Plan: Fokus auf einfachen Username/Password Login mit JWT Tokens.**

---

**Phase 10 Status:** Bereit zur Implementierung

**Nächste Schritte:**
1. Backend Models + Migration
2. Auth Endpoints implementieren
3. Frontend AuthContext + LoginPage
4. Protected Routes einbauen
5. Testing mit mehreren Usern

---
