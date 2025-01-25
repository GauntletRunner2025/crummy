import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [session, setSession] = useState(() => supabase.auth.getSession());
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        // Force navigation on auth loss
        window.location.href = '/auth';
      }
    });

    // Initial auth check
    supabase.auth.getSession().then((result) => {
      setSession(result);
      setIsChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show nothing during initial check
  if (isChecking) {
    return null;
  }

  // Redirect if no session
  if (!session.data.session) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;