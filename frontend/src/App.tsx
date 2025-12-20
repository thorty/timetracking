import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import TodosPage from './pages/TodosPage';
import styles from './App.module.css';

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<div className={styles.placeholder}>Tracker Page</div>} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="/stats" element={<div className={styles.placeholder}>Stats Page</div>} />
          </Routes>
        </Layout>
      </StoreProvider>
    </BrowserRouter>
  );
}
