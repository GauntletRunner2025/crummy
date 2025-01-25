import { useEffect, useState } from 'react';
import type { ActionTemplate } from '../types/ActionTemplate';
import type { Task } from '../types/Task';
import { supabase } from '@/lib/supabase';

interface ActionTemplateListProps {
  task: Task;
  onTemplateSelect: (template: ActionTemplate) => void;
}

export function ActionTemplateList({ task, onTemplateSelect }: ActionTemplateListProps) {
  const [templates, setTemplates] = useState<ActionTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTemplates() {
      if (!task) return;

      const { data, error } = await supabase
        .from('action_templates')
        .select('*')
        .eq('task_type', task.type_id)
        .eq('is_active', true);

      if (error) {
        console.error('Error loading action templates:', error);
        return;
      }

      setTemplates(data || []);
      setLoading(false);
    }

    loadTemplates();
  }, [task]);

  if (loading) {
    return <div className="p-4">Loading templates...</div>;
  }

  if (templates.length === 0) {
    return <div className="p-4 text-gray-500">No templates available for this task type.</div>;
  }

  return (
    <div className="flex flex-col gap-2 p-4">
      <h3 className="text-lg font-semibold mb-2">Action Templates</h3>
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => onTemplateSelect(template)}
          className="flex flex-col items-start p-3 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <span className="font-medium">{template.name}</span>
          {template.description && (
            <span className="text-sm text-gray-600">{template.description}</span>
          )}
        </button>
      ))}
    </div>
  );
}
