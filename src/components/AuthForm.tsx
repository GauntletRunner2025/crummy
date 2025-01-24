import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock } from "lucide-react";

interface AuthFormProps {
  isLogin?: boolean;
  onToggle: () => void;
}

const sampleUsers = [
  { email: "admin@example.com", password: "admin123", label: "Admin" },
  { email: "user@example.com", password: "user123", label: "Basic User" },
  { email: "test@example.com", password: "test123", label: "Test User" },
  { email: "demo@example.com", password: "demo123", label: "Demo User" },
  { email: "guest@example.com", password: "guest123", label: "Guest" },
  { email: "viewer@example.com", password: "viewer123", label: "Viewer" },
];

const AuthForm = ({ isLogin = true, onToggle }: AuthFormProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate auth - replace with real auth later
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        localStorage.setItem("isAuthenticated", "true");
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      } else {
        toast.success("Account created successfully!");
        onToggle();
      }
    }, 1000);
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 form-transition"
            />
          </div>
        </div>
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : isLogin ? "Sign In" : "Create Account"}
        </Button>
      </form>

      {isLogin && (
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Sample Accounts
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {sampleUsers.map((user) => (
              <Button
                key={user.email}
                type="button"
                variant="outline"
                onClick={() => handleSampleLogin(user.email, user.password)}
                className="text-xs"
              >
                {user.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <p className="text-sm text-center text-muted-foreground">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-primary hover:underline"
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;