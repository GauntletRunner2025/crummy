import MainLayout from "@/components/MainLayout";
import { TaskList } from "@/components/TaskList";
import { TaskView } from "@/components/TaskView";
import { ActionList } from '@/components/ActionList';
import { Profile } from '@/components/Profile';
import { useState } from 'react';

interface SelectedTask {
  id: string;
  title: string;
  type_id: string;
}

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);

  return (
    <MainLayout
      topRight={{
        content: (
          <Profile />
        )
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
          <ActionList taskTypeId={selectedTask?.type_id || null} />
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