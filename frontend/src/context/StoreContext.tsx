import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
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
