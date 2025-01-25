import MainLayout from "@/components/MainLayout";
import { TaskList } from "@/components/TaskList";
import { TaskView } from "@/components/TaskView";
import { Profile } from '@/components/Profile';
import { DerivedViewsList } from '@/components/DerivedViewsList';
import { useState } from 'react';

interface SelectedTask {
  id: string;
  title: string;
  type_id: string;
}

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);
  const [selectedViewId, setSelectedViewId] = useState<string | null>(null);

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
            onTaskSelect={(task) => {
              setSelectedTask(task);
              setSelectedViewId(null); // Reset view selection when task changes
            }}
          />
        )
      }}
      mainContent={{
        content: (
          <TaskView 
            task={selectedTask} 
            onClose={() => {
              setSelectedTask(null);
              setSelectedViewId(null);
            }}
            selectedViewId={selectedViewId}
          />
        )
      }}
      rightPanel={{
        content: (
          <DerivedViewsList
            selectedTask={selectedTask}
            onViewSelect={setSelectedViewId}
            selectedViewId={selectedViewId}
          />
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