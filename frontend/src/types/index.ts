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
