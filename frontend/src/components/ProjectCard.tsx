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
