import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface AuthFormProps {
  isLogin?: boolean;
  onToggle: () => void;
}

const sampleUsers = [
  { email: "customer1@example.com", password: "password123", label: "Customer 1", role: "customer" },
  { email: "customer2@example.com", password: "password123", label: "Customer 2", role: "customer" },
  { email: "agent1@example.com", password: "password123", label: "Agent 1", role: "agent" },
  { email: "agent2@example.com", password: "password123", label: "Agent 2", role: "agent" },
  { email: "supervisor@example.com", password: "password123", label: "Supervisor", role: "supervisor" },
  { email: "hr@example.com", password: "password123", label: "HR", role: "hr" }
];

const AuthForm = ({ isLogin = true, onToggle }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = isLogin
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

      if (error) throw error;

      if (isLogin) {
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.success("Account created successfully!");
        onToggle();
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSampleLogin = (sampleEmail: string, samplePassword: string) => {
    setEmail(sampleEmail);
    setPassword(samplePassword);
    // Submit the form programmatically after a short delay to show the filled fields
    setTimeout(() => {
      const form = document.querySelector("form");
      if (form) form.requestSubmit();
    }, 100);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 form-transition"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 form-transition"
            />
          </div>
        </div>
        <Button 
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
        </Button>
      </form>

      {isLogin && (
        <>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Sample Users
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {/* Customers Column */}
            <div className="space-y-2">
              {sampleUsers
                .filter(user => user.role === "customer")
                .map((user) => (
                  <Button
                    key={user.email}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSampleLogin(user.email, user.password)}
                  >
                    {user.label}
                  </Button>
                ))}
            </div>

            {/* Agents Column */}
            <div className="space-y-2">
              {sampleUsers
                .filter(user => user.role === "agent")
                .map((user) => (
                  <Button
                    key={user.email}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSampleLogin(user.email, user.password)}
                  >
                    {user.label}
                  </Button>
                ))}
            </div>

            {/* Supervisor and HR Column */}
            <div className="space-y-2">
              {sampleUsers
                .filter(user => user.role === "supervisor" || user.role === "hr")
                .map((user) => (
                  <Button
                    key={user.email}
                    variant="outline"
                    className="w-full"
                    onClick={() => handleSampleLogin(user.email, user.password)}
                  >
                    {user.label}
                  </Button>
                ))}
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Test Protection
              </span>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => navigate('/dashboard')}
          >
            Try Without Login
          </Button>
        </>
      )}

      <div className="text-sm text-center">
        <button
          type="button"
          onClick={onToggle}
          className="text-primary hover:underline"
          disabled={isLoading}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;