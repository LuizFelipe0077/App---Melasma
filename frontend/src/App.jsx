import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PatientDashboardPage from './pages/PatientDashboardPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import PatientLayout from './pages/PatientLayout.jsx';

function RequireRole({ role, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { session } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to={session.role === 'ADMIN' ? '/admin' : '/paciente'} replace /> : <LoginPage />}
      />

      <Route
        path="/paciente"
        element={
          <RequireRole role="PACIENTE">
            <PatientLayout />
          </RequireRole>
        }
      >
        <Route index element={<PatientDashboardPage />} />
        <Route path="historico" element={<HistoryPage />} />
        <Route path="calendario" element={<CalendarPage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <RequireRole role="ADMIN">
            <AdminDashboardPage />
          </RequireRole>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={!session ? '/login' : session.role === 'ADMIN' ? '/admin' : '/paciente'}
            replace
          />
        }
      />
    </Routes>
  );
}
