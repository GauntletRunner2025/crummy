import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success("Successfully logged out!");
      navigate("/auth");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} className="icon-button">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
};

export default LogoutButton;
