import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (username.length < 3) {
      setError('Username muss mindestens 3 Zeichen lang sein');
      return;
    }
    if (password.length < 6) {
      setError('Password muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register(username, password);
      } else {
        await login(username, password);
      }
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Timetracking App</h1>
          <p className={styles.subtitle}>
            {isRegister ? 'Erstelle einen Account' : 'Willkommen zurück'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            autoFocus
            label="Username"
            placeholder="Dein Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />

          <Input
            type="password"
            label="Password"
            placeholder="Dein Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading ? 'Lädt...' : isRegister ? 'Registrieren' : 'Anmelden'}
          </Button>
        </form>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          disabled={loading}
        >
          {isRegister 
            ? 'Hast du schon einen Account? Anmelden' 
            : 'Noch keinen Account? Registrieren'}
        </button>
      </div>
    </div>
  );
}
