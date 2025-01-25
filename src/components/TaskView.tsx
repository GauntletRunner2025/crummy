import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';
import {
  Task,
  DefaultTaskView,
  OnboardingView,
  SetDisplayNameView,
  SetDisplayNameCutesyView,
  SetDisplayNameAnonymousView
} from './taskViews';

interface TaskViewProps {
  task: Task | null;
  onClose: () => void;
  selectedViewId: string | null;
}

interface DerivedTaskView {
  id: string;
  name: string;
  component_name: string;
  is_default: boolean;
  description: string;
}

// Main TaskView component that renders the appropriate view
export function TaskView({ task, onClose, selectedViewId }: TaskViewProps) {
  const [derivedViews, setDerivedViews] = useState<DerivedTaskView[]>([]);

  useEffect(() => {
    const fetchDerivedViews = async () => {
      if (!task) return;

      const { data: views, error } = await supabase
        .from('derived_task_views')
        .select('*')
        .eq('task_type_id', task.type_id);

      if (error) {
        console.error('Error fetching derived views:', error);
        return;
      }

      setDerivedViews(views);
    };

    fetchDerivedViews();
  }, [task?.type_id]);

  if (!task) return null;

  // Find the selected view, or use the default view for this task type
  const selectedView = selectedViewId
    ? derivedViews.find(v => v.id === selectedViewId)
    : derivedViews.find(v => v.is_default);

  // Map component names to actual components
  const viewComponents: Record<string, React.ComponentType<any>> = {
    'DefaultTaskView': DefaultTaskView,
    'OnboardingView': OnboardingView,
    'SetDisplayNameView': SetDisplayNameView,
    'SetDisplayNameCutesyView': SetDisplayNameCutesyView,
    'SetDisplayNameAnonymousView': SetDisplayNameAnonymousView,
  };

  // Get the component to render
  const ViewComponent = selectedView
    ? viewComponents[selectedView.component_name]
    : DefaultTaskView;

  return (
    <div className="task-view">
      <ViewComponent task={task} onClose={onClose} />
    </div>
  );
}
