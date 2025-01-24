import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import '@/styles/task-view.css';

type TaskType = 'SetDisplayName' | 'Default';

interface Task {
  id: string;
  title: string;
  type: TaskType;
}

interface TaskViewProps {
  task: Task | null;
  onClose: () => void;
}

interface TaskTypeViewProps {
  task: Task;
  onClose: () => void;
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
      <Card className="task-view-card">
        <CardHeader className="task-view-header">
          <div className="flex justify-between items-center">
            <CardTitle className="task-view-title">{task.title}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="task-view-content">
          {children}
        </CardContent>
      </Card>
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

function SetDisplayNameView({ task, onClose }: TaskTypeViewProps) {
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

export function TaskView({ task, onClose }: TaskViewProps) {
  if (!task) {
    return (
      <div className="task-view-container flex items-center justify-center text-muted-foreground">
        Select a task to view its details
      </div>
    );
  }

  return task.type === 'SetDisplayName' ? (
    <SetDisplayNameView task={task} onClose={onClose} />
  ) : (
    <DefaultTaskView task={task} onClose={onClose} />
  );
}
