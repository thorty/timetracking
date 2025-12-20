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
