import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UserProfile {
  email: string;
  display_name: string;
  role: string;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;
      
      return profileData;
    } catch (err) {
      console.error('Profile fetch failed:', err);
      throw err;
    }
  };

  useEffect(() => {
    let realtimeChannel: RealtimeChannel;

    const setupProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          throw new Error("Not authenticated");
        }

        // Initial profile fetch
        const profileData = await fetchProfile(user.id);
        setProfile({
          email: user.email || '',
          display_name: profileData?.display_name || user.email?.split('@')[0] || 'User',
          role: user.role || 'User'
        });

        // Subscribe to realtime changes
        realtimeChannel = supabase
          .channel('profile_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`
            },
            async (payload) => {
              console.log('Profile change detected:', payload);
              try {
                const updatedProfile = await fetchProfile(user.id);
                setProfile(prev => ({
                  ...prev!,
                  display_name: updatedProfile?.display_name || prev?.display_name || 'User'
                }));
              } catch (err) {
                console.error('Failed to fetch updated profile:', err);
              }
            }
          )
          .subscribe();

      } catch (err) {
        console.error('Profile setup failed:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
        if (err.message === "Not authenticated") {
          navigate('/auth', { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    setupProfile();

    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth', { replace: true });
    } catch (err) {
      console.error('Logout failed:', err);
      navigate('/auth', { replace: true });
    }
  };

  if (isLoading) {
    return null;
  }

  if (error) {
    return null;
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="grid grid-cols-[1fr,auto] h-full items-center">
      <div className="px-2 py-1 text-sm">
        <div className="font-medium" title={profile.email}>
          {profile.display_name}
        </div>
        <div className="text-muted-foreground text-xs">
          {profile.role}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleLogout}
        className="h-8 w-8"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
