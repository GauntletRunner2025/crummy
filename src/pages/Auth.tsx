import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AuthCard
        title={isLogin ? "Welcome Back" : "Create Account"}
        description={
          isLogin
            ? "Enter your credentials to access your account"
            : "Sign up for a new account to get started"
        }
      >
        <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </AuthCard>
    </div>
  );
};

export default Auth;