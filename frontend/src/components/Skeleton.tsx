import styles from './Skeleton.module.css';

export default function Skeleton({ count = 3 }: { count?: number }) {
  return (
    <div className={styles.container}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.avatar} />
          <div className={styles.content}>
            <div className={styles.line} style={{ width: '60%' }} />
            <div className={styles.line} style={{ width: '40%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
