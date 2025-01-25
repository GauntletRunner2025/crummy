import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

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
    return <div className="p-4 text-gray-500">No views available for this task type.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className="text-lg font-semibold mb-2">Available Views</h3>
      {derivedViews.map((view) => (
        <button
          key={view.id}
          onClick={() => onViewSelect(view.id)}
          className={`flex flex-col items-start p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors ${
            selectedViewId === view.id ? 'border-blue-500 bg-blue-50' : ''
          }`}
        >
          <span className="font-medium">{view.name}</span>
          {view.description && (
            <span className="text-sm text-gray-600">{view.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
