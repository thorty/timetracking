import { forwardRef, SelectHTMLAttributes, ReactNode } from 'react';
import styles from './Select.module.css';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  children: ReactNode;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, className, children, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(7);

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.selectWrapper}>
          <select
            id={selectId}
            ref={ref}
            className={`${styles.select} ${error ? styles.error : ''} ${className || ''}`}
            {...props}
          >
            {children}
          </select>
          <div className={styles.chevron}>
            <svg className={styles.chevronIcon} viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
        {error && <p className={styles.errorText}>{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
