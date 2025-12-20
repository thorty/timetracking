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
