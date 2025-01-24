import { useState } from "react";
import AuthCard from "@/components/AuthCard";
import AuthForm from "@/components/AuthForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

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