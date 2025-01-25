import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface UserProfile {
  email: string;
  display_name: string;
  role: string;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;
      if (!profileData) throw new Error("Profile not found");

      setProfile({
        email: user.email || '',
        display_name: profileData.display_name,
        role: user.role || 'User'
      });
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  if (!profile) return null;

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
        className="h-full aspect-square rounded-none border-l"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
