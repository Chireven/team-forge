import * as React from 'react';
import { Link, Route, Routes, Navigate, useNavigate, useLocation, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SetupPage from './pages/SetupPage';
import LoginPage from './pages/LoginPage';
import NxWelcome from './nx-welcome';
import { ThemeProvider, ToastProvider } from '@team-forge/shared/ui';
import { NavigationProvider, useNavigation } from '@team-forge/shared/utils';
import { PermissionProvider } from '@team-forge/shared/auth-client';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Simple Guard Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Inner component that relies on Router Context
const ShellContent = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSetupRequired, setIsSetupRequired] = React.useState(false);
  // Safe here because App wraps us in Router
  const navigate = useNavigate();

  // Navigation Registry Access
  const { registerNavItem } = useNavigation();

  React.useEffect(() => {
    // Register Default Shell Items
    registerNavItem({
      id: 'dashboard',
      label: 'Dashboard',
      path: '/',
      section: 'main',
      order: 10
    });

    const checkStatus = async () => {
      try {
        const res = await axios.get('/api/auth/status');
        if (res.data.isSetupRequired) {
          setIsSetupRequired(true);
        }
      } catch (err) {
        console.error('Failed to check status', err);
      } finally {
        setIsLoading(false);
      }
    };
    checkStatus();
  }, [registerNavItem]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route
          path="/setup"
          element={isSetupRequired ? <SetupPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Protected Dashboard Layout Route */}
        <Route
          element={
            isSetupRequired ? (
              <Navigate to="/setup" />
            ) : (
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            )
          }
        >
          <Route path="/" element={<NxWelcome title="Team Forge Dashboard" />} />
          {/* Plugin Routes will go here later */}
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          {/* TODO: Pass actual user permissions here once we have them from JWT */}
          <PermissionProvider user={{ isSuperAdmin: false, permissions: ['test.permission'] }}>
            <NavigationProvider>
              <ShellContent />
            </NavigationProvider>
          </PermissionProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
