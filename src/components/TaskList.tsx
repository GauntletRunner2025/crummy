import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { TaskButton } from "@/components/TaskButton";
import '@/styles/task-list.css';

interface Task {
  id: string;
  title: string;
  assigned_to: string;
  type_id: string;
  task_type: {
    id: string;
    name: string;
    description: string;
  };
}

interface TaskListProps {
  onTaskSelect: (task: { id: string; title: string } | null) => void;
  selectedTask?: { id: string; title: string };
}

export function TaskList({ selectedTask, onTaskSelect }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          assigned_to,
          type_id,
          task_type:task_types(*)
        `)
        .eq('assigned_to', user.id);

      if (error) throw error;
      setTasks(data || []);
    };

    fetchTasks();

    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          fetchTasks();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, []);

  return (
    <div className="task-list">
      <div className="task-list-content">
        {tasks.map((task) => (
          <TaskButton
            key={task.id}
            title={task.title}
            isSelected={selectedTask?.id === task.id}
            onClick={() => onTaskSelect(task)}
          />
        ))}
      </div>
    </div>
  );
}
