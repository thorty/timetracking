import type { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Clock, CheckSquare, BarChart3, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from './ThemeToggle';
import styles from './Layout.module.css';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={styles.layout}>
      {/* Desktop Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Clock size={24} />
          <span>Timetracker</span>
          <ThemeToggle />
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

        {/* User Section */}
        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <User size={18} />
            <span>{user?.username}</span>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
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
