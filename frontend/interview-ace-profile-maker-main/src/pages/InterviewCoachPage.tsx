import { useAuth } from '../hooks/useAuth';
import { InterviewCoach } from '../components/interview/InterviewCoach';
import ProtectedRoute from '../components/auth/ProtectedRoute';

export const InterviewCoachPage = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <InterviewCoach 
        user={user ? {
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || ''
        } : undefined} 
      />
    </ProtectedRoute>
  );
}; 