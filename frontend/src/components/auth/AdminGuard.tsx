import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AdminGuard({ 
  children, 
  fallback = <AccessDeniedFallback />,
  redirectTo = '/admin-login'
}: AdminGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to admin login
        navigate(redirectTo);
        return;
      }

      // Check if user has admin role in metadata
      const userMetadata = user?.user_metadata;
      const hasAdminRole = userMetadata?.role === 'admin';
      
      if (hasAdminRole) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
        // Optionally redirect non-admin users
        navigate(redirectTo);
      }
    }
  }, [user, loading, isAuthenticated, navigate, redirectTo]);

  // Show loading while checking auth
  if (loading || isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show fallback if not admin
  if (!isAdmin) {
    return <>{fallback}</>;
  }

  // Render children if admin
  return <>{children}</>;
}

// Default access denied component
function AccessDeniedFallback() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>
        <div className="space-y-3">
          <Button 
            onClick={() => navigate('/admin-login')}
            className="w-full"
          >
            Go to Admin Login
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Hook for checking admin status
export function useAdminStatus() {
  const { user, loading, isAuthenticated } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        setIsAdmin(false);
        return;
      }

      const userMetadata = user?.user_metadata;
      const hasAdminRole = userMetadata?.role === 'admin';
      setIsAdmin(hasAdminRole);
    }
  }, [user, loading, isAuthenticated]);

  return {
    isAdmin,
    loading,
    isAuthenticated,
    user
  };
} 