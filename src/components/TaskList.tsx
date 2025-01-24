import { useEffect, useState } from 'react';
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskButton } from "@/components/TaskButton";
import '@/styles/task-list.css';

interface Task {
  id: string;
  title: string;
  assigned_to: string;
  type: 'SetDisplayName' | 'Default';
}

interface TaskListProps {
  onTaskSelect: (task: { id: string; title: string } | null) => void;
  selectedTaskId?: string;
}

export function TaskList({ onTaskSelect, selectedTaskId }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Get the current user's ID
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id || null);
    };
    getCurrentUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId) return;

    // Initial fetch
    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId);
      
      if (error) {
        console.error('Error fetching tasks:', error);
        return;
      }
      
      setTasks(data || []);
    };

    fetchTasks();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('tasks_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `assigned_to=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks(prev => [...prev, payload.new as Task]);
          } else if (payload.eventType === 'DELETE') {
            setTasks(prev => prev.filter(task => task.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setTasks(prev => prev.map(task => 
              task.id === payload.new.id ? payload.new as Task : task
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (!userId) return null;

  return (
    <ScrollArea className="task-list-container">
      <div className="task-list-content">
        <h2 className="task-list-title">Your Tasks</h2>
        <div className="flex flex-col">
          {tasks.map((task) => (
            <TaskButton
              key={task.id}
              id={task.id}
              title={task.title}
              isSelected={task.id === selectedTaskId}
              onSelect={onTaskSelect}
            />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
