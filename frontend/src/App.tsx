import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Toast from './components/Toast';
import Layout from './components/Layout';
import TrackerPage from './pages/TrackerPage';
import TodosPage from './pages/TodosPage';
import StatsPage from './pages/StatsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter>
          <StoreProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<TrackerPage />} />
                <Route path="/todos" element={<TodosPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Layout>
          </StoreProvider>
        </BrowserRouter>
        <Toast />
      </ToastProvider>
    </ErrorBoundary>
  );
}
