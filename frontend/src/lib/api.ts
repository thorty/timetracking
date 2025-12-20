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
    getAll: () => fetchApi<TimeEntry[]>('/timeentries'),
    create: (data: { todo_id: number; duration: number }) =>
      fetchApi<TimeEntry>('/timeentries', { 
        method: 'POST', 
        body: JSON.stringify(data) 
      }),
  },
  pomodoroSettings: {
    get: () => fetchApi<PomodoroSettings>('/settings'),
    update: (data: PomodoroSettings) =>
      fetchApi<PomodoroSettings>('/settings', { 
        method: 'PUT', 
        body: JSON.stringify(data) 
      }),
  },
};
