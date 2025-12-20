import { useStore } from '@/context/StoreContext';
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
