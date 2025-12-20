import { useState, useEffect } from 'react';
import { Play, Pause, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import styles from './Timer.module.css';

type TimerMode = 'focus' | 'break';

interface TimerProps {
  focusDuration: number; // in Minuten
  breakDuration: number; // in Minuten
  onComplete: (elapsedSeconds: number) => void;
}

export default function Timer({ focusDuration, breakDuration, onComplete }: TimerProps) {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [secondsLeft, setSecondsLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [totalSeconds, setTotalSeconds] = useState(focusDuration * 60);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  // Timer countdown
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          // Timer completed
          if (mode === 'focus') {
            onComplete(elapsedSeconds + 1);
            setElapsedSeconds(0);
          }
          return 0;
        }
        setElapsedSeconds((e) => e + 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, mode, elapsedSeconds, onComplete]);

  // Mode change effect
  useEffect(() => {
    const duration = mode === 'focus' ? focusDuration : breakDuration;
    setTotalSeconds(duration * 60);
    setSecondsLeft(duration * 60);
    setElapsedSeconds(0);
    setIsRunning(false);
  }, [mode, focusDuration, breakDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  
  const handleStop = () => {
    if (mode === 'focus' && elapsedSeconds > 0) {
      onComplete(elapsedSeconds);
    }
    setIsRunning(false);
    setSecondsLeft(totalSeconds);
    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const circumference = 2 * Math.PI * 120; // radius 120
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.timer}>
      {/* Mode Toggle */}
      <div className={styles.modeToggle}>
        <button
          className={`${styles.modeBtn} ${mode === 'focus' ? styles.active : ''}`}
          onClick={() => setMode('focus')}
          disabled={isRunning}
        >
          Focus ({focusDuration} min)
        </button>
        <button
          className={`${styles.modeBtn} ${mode === 'break' ? styles.active : ''}`}
          onClick={() => setMode('break')}
          disabled={isRunning}
        >
          Break ({breakDuration} min)
        </button>
      </div>

      {/* Timer Circle */}
      <div className={styles.circle}>
        <svg className={styles.svg} viewBox="0 0 250 250">
          {/* Background circle */}
          <circle
            cx="125"
            cy="125"
            r="120"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="125"
            cy="125"
            r="120"
            fill="none"
            stroke={mode === 'focus' ? '#6366f1' : '#10b981'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 125 125)"
            initial={false}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3 }}
          />
        </svg>
        <div className={styles.timeDisplay}>
          <span className={styles.time}>{formatTime(secondsLeft)}</span>
          <span className={styles.label}>{mode === 'focus' ? 'Focus' : 'Break'}</span>
        </div>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {!isRunning ? (
          <Button size="lg" onClick={handleStart}>
            <Play size={24} />
            Start
          </Button>
        ) : (
          <>
            <Button size="lg" variant="secondary" onClick={handlePause}>
              <Pause size={24} />
              Pause
            </Button>
            <Button size="lg" variant="destructive" onClick={handleStop}>
              <Square size={24} />
              Stop
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
