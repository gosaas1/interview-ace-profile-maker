import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error('Authentication failed. Please try again.');
          navigate('/auth');
          return;
        }

        if (!session) {
          console.error('No session found');
          toast.error('No active session found. Please sign in again.');
          navigate('/auth');
          return;
        }

        console.log('User session:', session.user);

        // Get the user profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          // If profile doesn't exist, create one
          const newProfile = {
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || ''
          };

          console.log('Creating new profile:', newProfile);

          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([newProfile])
            .select()
            .single();

          if (insertError) {
            console.error('Profile creation error:', insertError);
            console.error('Error details:', {
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint
            });
            toast.error('Failed to create user profile. Please try again.');
            navigate('/auth');
            return;
          }

          console.log('Profile created successfully:', insertedProfile);
        }

        toast.success('Successfully signed in!');
        navigate('/dashboard');
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-slate-600">Completing sign in...</p>
      </div>
    </div>
  );
} 