import type { ReactNode } from 'react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function StatCard({ title, children, className }: StatCardProps) {
  return (
    <div className={`${styles.card} ${className || ''}`}>
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
