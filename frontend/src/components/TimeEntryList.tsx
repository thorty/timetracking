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
