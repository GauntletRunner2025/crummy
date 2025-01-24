import React from 'react';
import '@/styles/globals.css';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface GridSlot {
  content: React.ReactNode;
}

interface MainLayoutProps {
  topLeft?: GridSlot;
  topCenter?: GridSlot;
  topRight?: GridSlot;
  leftPanel?: GridSlot;
  mainContent?: GridSlot;
  rightPanel?: GridSlot;
  bottomLeft?: GridSlot;
  bottomCenter?: GridSlot;
  bottomRight?: GridSlot;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  topLeft,
  topCenter,
  topRight,
  leftPanel,
  mainContent,
  rightPanel,
  bottomLeft,
  bottomCenter,
  bottomRight,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Successfully logged out!");
    navigate("/auth");
  };

  return (
    <div className="grid-layout">
      {/* Top Row */}
      <div className="grid-cell grid-cell-top">
        {topLeft?.content || <div>Navigation</div>}
      </div>
      <div className="grid-cell grid-cell-top">
        {topCenter?.content || <div>Welcome</div>}
      </div>
      <div className="grid-cell grid-cell-top">
        {topRight?.content || <div>User Profile</div>}
      </div>
      
      {/* Middle Row */}
      <div className="grid-cell grid-cell-side">
        {leftPanel?.content || <div>Navigation</div>}
      </div>
      <div className="grid-cell grid-cell-center">
        {mainContent?.content || <div>Main Content Area</div>}
      </div>
      <div className="grid-cell grid-cell-side">
        {rightPanel?.content || <div>Quick Actions</div>}
      </div>
      
      {/* Bottom Row */}
      <div className="grid-cell grid-cell-bottom">
        {bottomLeft?.content || <div>Recent Activity</div>}
      </div>
      <div className="grid-cell grid-cell-bottom">
        {bottomCenter?.content || <div>Statistics</div>}
      </div>
      <div className="grid-cell grid-cell-bottom">
        {bottomRight?.content || <div>Notifications</div>}
      </div>
    </div>
  );
};

export default MainLayout;
