import PomodoroSettings from '@/components/PomodoroSettings';
import styles from './SettingsPage.module.css';

export default function SettingsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.subtitle}>Manage your app preferences</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <PomodoroSettings />
        </section>
      </div>
    </div>
  );
}
