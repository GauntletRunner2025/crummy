import { Card } from "@/components/ui/card";
import NineGridLayout from "@/components/NineGridLayout";
import LogoutButton from "@/components/LogoutButton";
import UserProfile from "@/components/UserProfile";

const Dashboard = () => {
  return (
    <NineGridLayout
      topLeft={{
        content: <UserProfile />
      }}
      topCenter={{
        content: (
          <div className="text-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
          </div>
        )
      }}
      topRight={{
        content: <LogoutButton />
      }}
      leftPanel={{
        content: (
          <div>
            <h2 className="text-xl font-semibold">Navigation</h2>
          </div>
        )
      }}
      rightPanel={{
        content: (
          <div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>
        )
      }}
      bottomLeft={{
        content: (
          <div>
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
        )
      }}
      bottomCenter={{
        content: (
          <div>
            <h3 className="text-lg font-semibold">Statistics</h3>
          </div>
        )
      }}
      bottomRight={{
        content: (
          <div>
            <h3 className="text-lg font-semibold">Notifications</h3>
          </div>
        )
      }}
    />
  );
};

export default Dashboard;