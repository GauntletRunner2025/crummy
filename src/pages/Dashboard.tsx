import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Successfully logged out!");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
        <div className="grid gap-6">
          <div className="p-6 bg-accent rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Welcome to your Dashboard</h2>
            <p className="text-muted-foreground">
              This is a protected page that can only be accessed by authenticated users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;