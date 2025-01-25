import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";
import { supabase } from "@/lib/supabase";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate('/dashboard', { replace: true });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/dashboard', { replace: true });
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return null; // Or a loading spinner
  }

  return (
    <div className="page-container">
      <AuthCard
        title={isLogin ? "Sign In" : "Sign Up"}
        description=""
      >
        <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </AuthCard>
    </div>
  );
};

export default Auth;