import { Card } from "@/components/ui/card";
import MainLayout from "@/components/MainLayout";
import LogoutButton from "@/components/LogoutButton";
import UserProfile from "@/components/UserProfile";
import { TaskList } from "@/components/TaskList";
import { TaskView } from "@/components/TaskView";
import { useState } from 'react';

interface SelectedTask {
  id: string;
  title: string;
}

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);

  return (
    <MainLayout
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
          <TaskList 
            selectedTask={selectedTask} 
            onTaskSelect={setSelectedTask}
          />
        )
      }}
      mainContent={{
        content: (
          <TaskView 
            task={selectedTask} 
            onClose={() => setSelectedTask(null)} 
          />
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