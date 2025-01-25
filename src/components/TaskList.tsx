import { useEffect, useState } from 'react';
import { TaskButton } from './TaskButton';
import { supabase } from '@/lib/supabase';
import { Separator } from './ui/separator';
import '@/styles/task-list.css';

interface Task {
  id: string;
  title: string;
  type_id: string;
  assigned_to: string | null;
  status: 'Open' | 'Complete';
  task_type: {
    id: string;
    name: string;
    description: string;
  };
}

interface TaskListProps {
  selectedTask: Task | null;
  onTaskSelect: (task: Task) => void;
}

export function TaskList({ selectedTask, onTaskSelect }: TaskListProps) {
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([]);
  const [unassignedTasks, setUnassignedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: tasks, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          assigned_to,
          type_id,
          status,
          task_type:task_types(*)
        `)
        .eq('status', 'Open');

      if (error) throw error;

      const assigned = tasks?.filter(task => task.assigned_to === user.id) || [];
      const unassigned = tasks?.filter(task => task.assigned_to === null) || [];

      setAssignedTasks(assigned);
      setUnassignedTasks(unassigned);
      setLoading(false);
    };

    fetchTasks();

    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'tasks' 
      }, () => {
        fetchTasks();
      })
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  return (
    <div className="h-full">
      {/* Assigned Tasks Section */}
      <div>
        <div className="px-2 py-1 font-medium text-sm text-muted-foreground">
          My Tasks
        </div>
        <div>
          {assignedTasks.map((task) => (
            <TaskButton
              key={task.id}
              title={task.title}
              isSelected={selectedTask?.id === task.id}
              onClick={() => onTaskSelect(task)}
            />
          ))}
        </div>
        {assignedTasks.length === 0 && (
          <div className="px-2 py-1 text-sm text-muted-foreground">
            No tasks assigned
          </div>
        )}
      </div>

      <Separator className="my-2" />

      {/* Unassigned Tasks Section */}
      <div>
        <div className="px-2 py-1 font-medium text-sm text-muted-foreground">
          Unassigned Tasks
        </div>
        <div>
          {unassignedTasks.map((task) => (
            <TaskButton
              key={task.id}
              title={task.title}
              isSelected={selectedTask?.id === task.id}
              onClick={() => onTaskSelect(task)}
            />
          ))}
        </div>
        {unassignedTasks.length === 0 && (
          <div className="px-2 py-1 text-sm text-muted-foreground">
            No unassigned tasks
          </div>
        )}
      </div>
    </div>
  );
}
