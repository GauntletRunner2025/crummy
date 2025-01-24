import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Lock, Github, Google, Twitter, Facebook, Apple, Linkedin } from "lucide-react";

interface AuthFormProps {
  isLogin?: boolean;
  onToggle: () => void;
}

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

  const sampleLogins = [
    { email: "admin@example.com", password: "admin123", label: "Admin" },
    { email: "user@example.com", password: "user123", label: "Basic User" },
    { email: "test@example.com", password: "test123", label: "Test User" },
    { email: "demo@example.com", password: "demo123", label: "Demo User" },
    { email: "guest@example.com", password: "guest123", label: "Guest" },
    { email: "sample@example.com", password: "sample123", label: "Sample" },
  ];

  const handleSampleLogin = (sampleEmail: string, samplePassword: string) => {
    setEmail(sampleEmail);
    setPassword(samplePassword);
    const form = document.querySelector("form");
    if (form) {
      form.requestSubmit();
    }
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

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Sample Logins
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sampleLogins.map((login, index) => (
          <Button
            key={index}
            variant="secondary"
            className="form-transition"
            onClick={() => handleSampleLogin(login.email, login.password)}
          >
            {login.label}
          </Button>
        ))}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="form-transition">
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
        <Button variant="outline" className="form-transition">
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button variant="outline" className="form-transition">
          <Twitter className="mr-2 h-4 w-4" />
          Twitter
        </Button>
        <Button variant="outline" className="form-transition">
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
        <Button variant="outline" className="form-transition">
          <Apple className="mr-2 h-4 w-4" />
          Apple
        </Button>
        <Button variant="outline" className="form-transition">
          <Linkedin className="mr-2 h-4 w-4" />
          LinkedIn
        </Button>
      </div>

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