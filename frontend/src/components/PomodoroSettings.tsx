import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/context/ToastContext';
import { api } from '@/lib/api';
import { Clock } from 'lucide-react';
import Input from './ui/Input';
import Button from './ui/Button';
import Card from './ui/Card';
import styles from './PomodoroSettings.module.css';

export default function PomodoroSettings() {
  const { pomodoroSettings, refreshPomodoroSettings } = useStore();
  const { showToast } = useToast();
  const [focusDuration, setFocusDuration] = useState(pomodoroSettings.focus_duration);
  const [breakDuration, setBreakDuration] = useState(pomodoroSettings.break_duration);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (focusDuration < 1 || focusDuration > 60) {
      showToast('Focus duration must be between 1 and 60 minutes', 'error');
      return;
    }
    if (breakDuration < 1 || breakDuration > 60) {
      showToast('Break duration must be between 1 and 60 minutes', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await api.pomodoroSettings.update({
        focus_duration: focusDuration,
        break_duration: breakDuration,
      });
      await refreshPomodoroSettings();
      
      showToast('Settings saved successfully!', 'success');
      
      console.log('✅ Pomodoro settings updated');
    } catch (error) {
      console.error('Failed to update settings:', error);
      showToast('Failed to save settings', 'error');
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
      </form>
    </Card>
  );
}
