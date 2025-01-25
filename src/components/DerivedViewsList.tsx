import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';

interface DerivedView {
  id: string;
  name: string;
  component_name: string;
  is_default: boolean;
  description: string;
}

interface DerivedViewsListProps {
  selectedTask: {
    id: string;
    type_id: string;
  } | null;
  onViewSelect: (viewId: string) => void;
  selectedViewId: string | null;
}

export function DerivedViewsList({ selectedTask, onViewSelect, selectedViewId }: DerivedViewsListProps) {
  const [derivedViews, setDerivedViews] = useState<DerivedView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedTask) {
      setDerivedViews([]);
      setLoading(false);
      return;
    }

    const fetchDerivedViews = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('derived_task_views')
        .select('*')
        .eq('task_type_id', selectedTask.type_id);

      if (error) {
        console.error('Error fetching derived views:', error);
        return;
      }

      const views = data || [];
      setDerivedViews(views);

      // If there's no selected view, select the default one or the first one
      if (!selectedViewId && views.length > 0) {
        const defaultView = views.find(view => view.is_default);
        onViewSelect(defaultView?.id || views[0].id);
      }

      setLoading(false);
    };

    fetchDerivedViews();
  }, [selectedTask, selectedViewId, onViewSelect]);

  if (!selectedTask) {
    return (
      <div className="p-4 text-muted-foreground">
        Select a task to view available actions
      </div>
    );
  }

  if (loading) {
    return <div className="p-4">Loading views...</div>;
  }

  if (derivedViews.length === 0) {
    return <div className="p-4 text-muted-foreground">No views available for this task type.</div>;
  }

  return (
    <div className="h-full">
      <div className="px-2 py-1 font-medium text-sm text-muted-foreground">
        Quick Actions
      </div>
      <div>
        {derivedViews.map((view) => (
          <Button
            key={view.id}
            variant="ghost"
            className={`w-full rounded-none h-auto px-2 py-2 justify-start hover:bg-accent ${
              selectedViewId === view.id ? "bg-accent" : ""
            }`}
            onClick={() => onViewSelect(view.id)}
          >
            <div className="flex flex-col items-start w-full overflow-hidden">
              <div className="truncate font-medium w-full">{view.name}</div>
              {view.description && (
                <div className="text-sm text-muted-foreground whitespace-normal break-words w-full">
                  {view.description}
                </div>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
