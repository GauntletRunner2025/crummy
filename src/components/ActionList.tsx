import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

interface Action {
  id: string;
  name: string;
  description: string;
  action_data: {
    operation: string;
    [key: string]: any;
  };
}

interface ActionListProps {
  taskTypeId: string | null;
}

export function ActionList({ taskTypeId }: ActionListProps) {
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    const fetchActions = async () => {
      if (!taskTypeId) {
        setActions([]);
        return;
      }

      const { data, error } = await supabase
        .from('actions')
        .select('*')
        .eq('task_type_id', taskTypeId);

      if (error) throw error;
      setActions(data || []);
    };

    fetchActions();
  }, [taskTypeId]);

  if (!taskTypeId) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a task to view available actions
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {actions.map((action) => (
        <Button
          key={action.id}
          variant="outline"
          className="w-full justify-start"
          title={action.description || action.name}
        >
          {action.name}
        </Button>
      ))}
    </div>
  );
}
