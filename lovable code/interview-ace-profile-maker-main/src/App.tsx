import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/auth';
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

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-slate-600 font-medium">Loading ApplyAce...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

// Placeholder components for missing pages
const ProfilePage = () => (
  <div className="flex h-screen bg-gray-50">
    <div className="w-64">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600">ApplyAce</h1>
      </div>
    </div>
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </div>
    </main>
  </div>
);

const SettingsPage = () => (
  <div className="flex h-screen bg-gray-50">
    <div className="w-64">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600">ApplyAce</h1>
      </div>
    </div>
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600 mt-2">Coming soon...</p>
      </div>
    </main>
  </div>
);

const AnalyticsPage = () => (
  <div className="flex h-screen bg-gray-50">
    <div className="w-64">
      <div className="p-4">
        <h1 className="text-xl font-bold text-blue-600">ApplyAce</h1>
      </div>
    </div>
    <main className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Performance insights coming soon...</p>
      </div>
    </main>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <AuthProvider>
          <Toaster 
            position="top-right" 
            richColors
            toastOptions={{
              duration: 4000,
              style: {
                background: 'white',
                border: '1px solid #e2e8f0',
                color: '#1e293b',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthForm />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify" element={<VerifyEmail />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Protected Routes */}
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
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/analytics"
              element={
                <PrivateRoute>
                  <AnalyticsPage />
                </PrivateRoute>
              }
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
