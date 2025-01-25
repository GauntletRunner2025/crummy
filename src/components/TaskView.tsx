import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';
import type { ActionTemplate } from "@/types/ActionTemplate";

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

interface TaskViewProps {
  task: Task | null;
  onClose: () => void;
  onTemplateSelect?: (template: ActionTemplate) => void;
}

interface TaskTypeViewProps {
  task: Task;
  onClose: () => void;
  onTemplateSelect?: (template: ActionTemplate) => void;
}

function TaskTypeView({ task, onClose, children }: TaskTypeViewProps & { children: JSX.Element }) {
  const handleClose = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) throw error;
      
      onClose();
    } catch (error) {
      console.error('Error closing task:', error);
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
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <div className="task-view-content">
          {children}
        </div>
      </div>
    </div>
  );
}

function DefaultTaskView({ task, onClose }: TaskTypeViewProps) {
  return (
    <TaskTypeView task={task} onClose={onClose}>
      <div>Default task view</div>
    </TaskTypeView>
  );
}

function SetDisplayNameView({ task, onClose, onTemplateSelect }: TaskTypeViewProps) {
  const [displayName, setDisplayName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
        .eq('id', (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      // Delete the task once display name is set
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

  // Add static method to handle template processing
  SetDisplayNameView.processTemplate = (template: ActionTemplate) => {
    import(`@/lib/actionTemplates/${template.processor_function}`)
      .then((module) => {
        const processor = module[template.processor_function];
        if (processor) {
          processor(task).then((result: { displayName: string }) => {
            setDisplayName(result.displayName);
          });
        }
      })
      .catch(console.error);
  };

  return (
    <TaskTypeView task={task} onClose={onClose}>
      <div className="space-y-4">
        <p className="text-muted-foreground">
          Choose a display name that will be visible to other users.
        </p>
        <div className="space-y-2">
          <Input
            placeholder="Enter your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button 
            onClick={handleSubmit}
            disabled={isUpdating || !displayName.trim()}
            className="w-full"
          >
            Set Display Name
          </Button>
        </div>
      </div>
    </TaskTypeView>
  );
}

export function TaskView({ task, onClose, onTemplateSelect }: TaskViewProps) {
  if (!task) {
    return (
      <div className="task-view-container flex items-center justify-center text-muted-foreground">
        Select a task to view its details
      </div>
    );
  }

  return task.type_id === 'SetDisplayName' ? (
    <SetDisplayNameView task={task} onClose={onClose} onTemplateSelect={onTemplateSelect} />
  ) : (
    <DefaultTaskView task={task} onClose={onClose} />
  );
}
