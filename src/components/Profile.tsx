import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from '@/lib/supabase';

interface UserProfile {
  email: string;
  role: string;
}

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      setProfile({
        email: user.email || '',
        role: user.role || 'User' // Default to 'User' if role is not set
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
    <div className="flex items-center justify-between h-full w-full">
      <div className="flex flex-col px-2 py-1 text-sm">
        <div className="text-muted-foreground truncate" title={profile.email}>
          {profile.email}
        </div>
        <div className="font-medium">
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
