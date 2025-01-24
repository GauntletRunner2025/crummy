import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Successfully logged out!");
    navigate("/auth");
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="icon-button">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
