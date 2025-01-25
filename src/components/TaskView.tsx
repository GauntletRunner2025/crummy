import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';

interface Task {
  id: string;
  title: string;
  type_id: string;
  task_type: {
    id: string;
    name: string;
    description: string;
  };
}

interface DerivedTaskView {
  id: string;
  name: string;
  component_name: string;
  is_default: boolean;
  description: string;
}

interface TaskViewProps {
  task: Task | null;
  onClose: () => void;
  selectedViewId: string | null;
}

interface TaskTypeViewProps {
  task: Task;
  onClose: () => void;
}

// Base SetDisplayName component with common functionality
function BaseSetDisplayNameView({ task, onClose, initialValue = '', children }: TaskTypeViewProps & { initialValue?: string; children?: React.ReactNode }) {
  const [displayName, setDisplayName] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error('No user found');

      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      const { error: taskError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (taskError) throw taskError;

      onClose();
    } catch (error) {
      console.error('Error updating display name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="task-view-container">
      <div className="task-view-card">
        <header className="task-view-header">
          <div className="flex justify-between items-center">
            <h1 className="task-view-title">{task.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="task-view-content">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="displayName" className="text-sm font-medium">
                Display Name
              </label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            {children}
            <Button 
              onClick={handleSubmit}
              disabled={isUpdating || !displayName.trim()}
            >
              {isUpdating ? 'Updating...' : 'Update Display Name'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Default SetDisplayName view
function SetDisplayNameView(props: TaskTypeViewProps) {
  return <BaseSetDisplayNameView {...props} />;
}

// Anonymous SetDisplayName view
function SetDisplayNameAnonymousView(props: TaskTypeViewProps) {
  return (
    <BaseSetDisplayNameView {...props} initialValue="Anonymous_">
      <p className="text-sm text-gray-500">
        Your display name will be prefixed with "Anonymous_"
      </p>
    </BaseSetDisplayNameView>
  );
}

// Cutesy SetDisplayName view
function SetDisplayNameCutesyView(props: TaskTypeViewProps) {
  return (
    <BaseSetDisplayNameView {...props} initialValue="★ ">
      <div className="space-y-2">
        <p className="text-sm text-gray-500">
          Your display name will be decorated with cute symbols ★彡
        </p>
        <div className="text-sm">
          Preview: <span className="font-medium">★ {props.task.title} 彡</span>
        </div>
      </div>
    </BaseSetDisplayNameView>
  );
}

function DefaultTaskView({ task, onClose }: TaskTypeViewProps) {
  return (
    <div className="task-view-container">
      <div className="task-view-card">
        <header className="task-view-header">
          <div className="flex justify-between items-center">
            <h1 className="task-view-title">{task.title}</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="task-view-content">
          <div>Default task view</div>
        </div>
      </div>
    </div>
  );
}

// Main TaskView component that renders the appropriate view
export function TaskView({ task, onClose, selectedViewId }: TaskViewProps) {
  const [derivedViews, setDerivedViews] = useState<DerivedTaskView[]>([]);

  useEffect(() => {
    if (!task) return;

    const fetchDerivedViews = async () => {
      const { data, error } = await supabase
        .from('derived_task_views')
        .select('*')
        .eq('task_type_id', task.type_id);

      if (error) {
        console.error('Error fetching derived views:', error);
        return;
      }

      setDerivedViews(data || []);
    };

    fetchDerivedViews();
  }, [task]);

  if (!task) return null;

  const selectedView = derivedViews.find(view => view.id === selectedViewId);
  
  // Map component names to actual components
  const componentMap: Record<string, React.ComponentType<TaskTypeViewProps>> = {
    SetDisplayNameView,
    SetDisplayNameAnonymousView,
    SetDisplayNameCutesyView,
    // Add other view components here
  };

  const ViewComponent = selectedView 
    ? componentMap[selectedView.component_name] || DefaultTaskView
    : DefaultTaskView;

  return <ViewComponent task={task} onClose={onClose} />;
}
