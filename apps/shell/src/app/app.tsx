import * as React from 'react';
import { Link, Route, Routes, Navigate, useNavigate, useLocation, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SetupPage from './pages/SetupPage';
import LoginPage from './pages/LoginPage';
import NxWelcome from './nx-welcome';
import { ThemeProvider, ToastProvider, ToastContext } from '@team-forge/shared/ui';
import { NavigationProvider, useNavigation } from '@team-forge/shared/utils';
import { PermissionProvider } from '@team-forge/shared/auth-client';
import { DashboardLayout } from './components/layout/DashboardLayout';

const UserAdmin = React.lazy(() => import('user-admin/Module'));

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
      order: 1
    });

    // 2. Register Core Plugin Links (Eager Registration)
    // In a future phase, this would be data-driven/manifest-driven.
    // For now, we manually register known plugins to solve the "Chicken & Egg" loading problem.
    // We only show this if the user has permission.
    // Note: We need access to the user object here. 
    // Since AuthLoader wraps this, we can assume we are checking valid access, 
    // but typically we'd use the usePermission hook here.

    registerNavItem({
      id: 'users',
      label: 'Users',
      path: '/user-admin',
      section: 'settings',
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
          <Route path="/user-admin/*" element={
            <React.Suspense fallback={<div>Loading Plugin...</div>}>
              <UserAdmin />
            </React.Suspense>
          } />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { setupAxiosInterceptors } from '@team-forge/shared/utils';

// Rule 17: Configure TanStack Query Defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Don't retry on 400/401/403/404 errors
        if (error.response && [400, 401, 403, 404].includes(error.response.status)) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false, // Dev sanity
    },
  },
});

// Auth Wrapper to fetch user profile and permissions
const AuthLoader = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState({ isSuperAdmin: false, permissions: [] as string[] });
  const [loaded, setLoaded] = React.useState(false);
  const { showToast } = React.useContext(ToastContext) as any;

  React.useEffect(() => {
    // 1. Setup Axios Interceptors via Shared Utils
    const cleanup = setupAxiosInterceptors(() => {
      showToast?.('Session Expired. Please login again.', 'error');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
    });

    const token = localStorage.getItem('token');
    if (token) {
      // 2. Fetch Profile
      axios.get('/api/auth/profile')
        .then(res => {
          // Handle standard envelope { data: ... } or direct response
          const profile = res.data.data || res.data;
          setUser({
            isSuperAdmin: profile.isSuperAdmin,
            permissions: []
          });
        })
        .catch(() => {
          console.warn("Failed to load profile. Token may be invalid.");
        })
        .finally(() => setLoaded(true));
    } else {
      setLoaded(true);
    }

    return () => cleanup();
  }, [showToast]);

  if (!loaded) return <div>Initializing Auth...</div>;

  return (
    <PermissionProvider user={user}>
      {children}
    </PermissionProvider>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            <AuthLoader>
              <NavigationProvider>
                <ShellContent />
              </NavigationProvider>
            </AuthLoader>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
