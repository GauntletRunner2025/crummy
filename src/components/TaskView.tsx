import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';
import { Task } from './taskViews';
import { getViewComponent } from './taskViews/registry';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDerivedViews = async () => {
      if (!task) return;

      const { data: views, error } = await supabase
        .from('derived_task_views')
        .select('*')
        .eq('task_type_id', task.type_id);

      if (error) {
        console.error('Error fetching derived views:', error);
        setError('Failed to load task views');
        return;
      }

      setDerivedViews(views);
    };

    fetchDerivedViews();
  }, [task?.type_id]);

  if (!task) return null;

  if (error) {
    return (
      <div className="p-4 text-destructive">
        {error}
      </div>
    );
  }

  // Find the selected view, or use the default view for this task type
  const selectedView = selectedViewId
    ? derivedViews.find(v => v.id === selectedViewId)
    : derivedViews.find(v => v.is_default);

  if (!selectedView) {
    return (
      <div className="p-4 text-destructive">
        Error: No valid view found for this task type
      </div>
    );
  }

  // Get the component using our registry
  const ViewComponent = getViewComponent(selectedView.component_name);
  
  if (!ViewComponent) {
    return (
      <div className="p-4 text-destructive">
        Error: Component {selectedView.component_name} not found in registry. This indicates a mismatch between database configuration and available components.
      </div>
    );
  }

  return (
    <div className="task-view">
      <ViewComponent task={task} onClose={onClose} />
    </div>
  );
}
