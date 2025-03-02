import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const UserProfile = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        // Early out if no session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) {
          toast.error('Please sign in to continue');
          navigate('/auth');
          return;
        }

        // Get user email from session since it's already available
        setEmail(session.user.email);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Session expired. Please sign in again');
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEmail();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="text-left p-2">
        <h2 className="text-xl font-semibold mb-2">User Profile</h2>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!email) return null;

  return (
    <div className="text-left p-2">
      <h2 className="text-xl font-semibold mb-2">User Profile</h2>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
  );
};

export default UserProfile;
