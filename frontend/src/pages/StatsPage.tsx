import { useMemo } from 'react';
import { useStore } from '@/context/StoreContext';
import { useTheme } from '@/context/ThemeContext';
import { COLORS } from '@/lib/utils';
import { formatDuration, getDaysArray, getDateString, getShortDate, getStartOfDay } from '@/lib/utils';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, Target, Flame, Clock } from 'lucide-react';
import StatCard from '@/components/StatCard';
import styles from './StatsPage.module.css';

export default function StatsPage() {
  const { timeEntries, projects, todos } = useStore();
  const { theme } = useTheme();

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

  // Chart Colors basierend auf Theme
  const chartColors = {
    text: theme === 'dark' ? '#cbd5e1' : '#64748b',
    grid: theme === 'dark' ? '#334155' : '#e2e8f0',
    tooltipBg: theme === 'dark' ? '#1e293b' : '#ffffff',
    tooltipBorder: theme === 'dark' ? '#334155' : '#e2e8f0',
  };

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
                    formatter={(value: number | undefined) => value ? formatDuration(value) : ''}
                    contentStyle={{
                      background: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: '0.5rem',
                      color: chartColors.text,
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
                  <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, fill: chartColors.text }}
                    tickLine={false}
                    axisLine={{ stroke: chartColors.grid }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: chartColors.text }}
                    tickLine={false}
                    axisLine={{ stroke: chartColors.grid }}
                    tickFormatter={(value) => `${Math.floor(value / 60)}m`}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => value ? formatDuration(value) : ''}
                    contentStyle={{
                      background: chartColors.tooltipBg,
                      border: `1px solid ${chartColors.tooltipBorder}`,
                      borderRadius: '0.5rem',
                      color: chartColors.text,
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
