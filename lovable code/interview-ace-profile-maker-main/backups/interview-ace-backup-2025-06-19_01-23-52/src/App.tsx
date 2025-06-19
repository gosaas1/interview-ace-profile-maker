import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import AuthForm from '@/components/auth/AuthForm';
import ResetPassword from '@/components/auth/ResetPassword';
import VerifyEmail from '@/components/auth/VerifyEmail';
import Dashboard from '@/components/dashboard/Dashboard';
import { CVs } from '@/pages/CVs';
import CVBuilderPage from '@/pages/CVBuilderPage';
import { Interviews } from '@/pages/Interviews';
import { Jobs } from '@/pages/Jobs';
import AuthCallback from '@/components/auth/AuthCallback';
import { useAuth } from '@/hooks/useAuth';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/cvs"
              element={
                <PrivateRoute>
                  <CVs />
                </PrivateRoute>
              }
            />
            <Route
              path="/cv-builder"
              element={
                <PrivateRoute>
                  <CVBuilderPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/cv-builder/:cvId"
              element={
                <PrivateRoute>
                  <CVBuilderPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/interviews"
              element={
                <PrivateRoute>
                  <Interviews />
                </PrivateRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
