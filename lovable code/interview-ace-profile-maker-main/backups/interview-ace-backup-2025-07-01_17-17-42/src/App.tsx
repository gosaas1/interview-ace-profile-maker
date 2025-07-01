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
import { TopNavigation } from '@/components/navigation/TopNavigation';
import { AppLayout } from '@/components/layout/AppLayout';
import BackendTest from '@/components/debug/BackendTest';
import LinkedInDebug from '@/components/debug/LinkedInDebug';
import LinkedInOAuthTest from '@/components/debug/LinkedInOAuthTest';
import LinkedInMainAuthTest from '@/components/debug/LinkedInMainAuthTest';
import { KeywordTest } from '@/components/debug/KeywordTest';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentFailed from '@/pages/PaymentFailed';
import PaymentTest from '@/components/debug/PaymentTest';
import StripeSetup from '@/components/debug/StripeSetup';
import PaymentDebug from '@/components/debug/PaymentDebug';
import { TemplateTest } from '@/components/debug/TemplateTest';
import { DatabaseSchemaTest } from '@/components/debug/DatabaseSchemaTest';
import EliteExecutive from '@/pages/EliteExecutive';

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
          {/* Public routes without top navigation */}
          <Route path="/" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/pricing" element={<AppLayout><Index /></AppLayout>} />
          <Route path="/elite-executive" element={<AppLayout showTopNav={false}><EliteExecutive /></AppLayout>} />
          <Route path="/auth" element={<AppLayout showTopNav={false}><AuthForm /></AppLayout>} />
          <Route path="/auth/reset-password" element={<AppLayout showTopNav={false}><ResetPassword /></AppLayout>} />
          <Route path="/auth/verify" element={<AppLayout showTopNav={false}><VerifyEmail /></AppLayout>} />
          <Route path="/auth/callback" element={<AppLayout showTopNav={false}><AuthCallback /></AppLayout>} />
          
          {/* Payment routes */}
          <Route path="/payment-success" element={<AppLayout showTopNav={false}><PaymentSuccess /></AppLayout>} />
          <Route path="/payment-failed" element={<AppLayout showTopNav={false}><PaymentFailed /></AppLayout>} />
          
          {/* Protected Routes with top navigation */}
          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/cvs"
            element={
              <AppLayout>
                <PrivateRoute>
                  <CVs />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/cv-builder"
            element={
              <AppLayout>
                <PrivateRoute>
                  <CVBuilderPage />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/cv-builder/:cvId"
            element={
              <AppLayout>
                <PrivateRoute>
                  <CVBuilderPage />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/interviews"
            element={
              <AppLayout>
                <PrivateRoute>
                  <Interviews />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/jobs"
            element={
              <AppLayout>
                <PrivateRoute>
                  <Jobs />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/profile"
            element={
              <AppLayout>
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <AppLayout>
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/analytics"
            element={
              <AppLayout>
                <PrivateRoute>
                  <AnalyticsPage />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/debug"
            element={
              <AppLayout>
                <PrivateRoute>
                  <BackendTest />
                </PrivateRoute>
              </AppLayout>
            }
          />
          <Route
            path="/debug/linkedin"
            element={
              <AppLayout>
                <LinkedInDebug />
              </AppLayout>
            }
          />
          <Route
            path="/debug/linkedin-oauth"
            element={
              <AppLayout>
                <LinkedInOAuthTest />
              </AppLayout>
            }
          />
          <Route
            path="/debug/linkedin-main"
            element={
              <AppLayout>
                <LinkedInMainAuthTest />
              </AppLayout>
            }
          />
          <Route
            path="/debug/keywords"
            element={
              <AppLayout>
                <KeywordTest />
              </AppLayout>
            }
          />
          <Route
            path="/debug/payments"
            element={
              <AppLayout>
                <PaymentTest />
              </AppLayout>
            }
          />
          <Route
            path="/debug/stripe-setup"
            element={
              <AppLayout>
                <StripeSetup />
              </AppLayout>
            }
          />
          <Route
            path="/debug/payment-debug"
            element={
              <AppLayout>
                <PaymentDebug />
              </AppLayout>
            }
          />
          <Route
            path="/debug/template-test"
            element={
              <AppLayout>
                <TemplateTest />
              </AppLayout>
            }
          />
          <Route
            path="/debug/database-schema"
            element={
              <AppLayout>
                <PrivateRoute>
                  <DatabaseSchemaTest />
                </PrivateRoute>
              </AppLayout>
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
