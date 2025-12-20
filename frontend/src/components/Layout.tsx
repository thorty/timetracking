import type { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Clock, CheckSquare, BarChart3, Settings } from 'lucide-react';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Clock size={24} />
          <span>Timetracker</span>
        </div>
        
        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Clock size={20} />
            <span>Tracker</span>
          </NavLink>
          <NavLink 
            to="/todos" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <CheckSquare size={20} />
            <span>Projects</span>
          </NavLink>
          <NavLink 
            to="/stats" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <BarChart3 size={20} />
            <span>Stats</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
          >
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className={styles.mobileNav}>
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <Clock size={24} />
          <span>Tracker</span>
        </NavLink>
        <NavLink 
          to="/todos" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <CheckSquare size={24} />
          <span>Projects</span>
        </NavLink>
        <NavLink 
          to="/stats" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <BarChart3 size={24} />
          <span>Stats</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => 
            `${styles.mobileLink} ${isActive ? styles.active : ''}`
          }
        >
          <Settings size={24} />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}
