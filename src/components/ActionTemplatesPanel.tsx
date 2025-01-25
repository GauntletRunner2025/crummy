import { useEffect, useState } from 'react';
import { ActionTemplateList } from './ActionTemplateList';
import type { ActionTemplate } from '@/types/ActionTemplate';
import type { Task } from '@/types/Task';

interface ActionTemplatesPanelProps {
  selectedTask: Task | null;
  onTemplateSelect: (template: ActionTemplate) => void;
}

export function ActionTemplatesPanel({ selectedTask, onTemplateSelect }: ActionTemplatesPanelProps) {
  if (!selectedTask) {
    return (
      <div className="p-4 text-muted-foreground">
        Select a task to view available templates
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <ActionTemplateList 
        task={selectedTask} 
        onTemplateSelect={onTemplateSelect}
      />
    </div>
  );
}
