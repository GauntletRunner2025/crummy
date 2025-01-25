import MainLayout from "@/components/MainLayout";
import { TaskList } from "@/components/TaskList";
import { TaskView } from "@/components/TaskView";
import { Profile } from '@/components/Profile';
import { ActionTemplatesPanel } from '@/components/ActionTemplatesPanel';
import { useState } from 'react';
import type { ActionTemplate } from '@/types/ActionTemplate';

interface SelectedTask {
  id: string;
  title: string;
  type_id: string;
}

export default function Dashboard() {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null);

  const handleTemplateSelect = (template: ActionTemplate) => {
    // The template processing will be handled by the TaskView component
    console.log('Selected template:', template);
  };

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
            onTemplateSelect={handleTemplateSelect}
          />
        )
      }}
      rightPanel={{
        content: (
          <ActionTemplatesPanel
            selectedTask={selectedTask}
            onTemplateSelect={handleTemplateSelect}
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