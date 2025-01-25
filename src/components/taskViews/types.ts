export interface Task {
  id: string;
  title: string;
  type_id: string;
  target_id?: string;  // Optional since not all tasks will have a target
  task_type: {
    id: string;
    name: string;
    description: string;
  };
}

export interface TaskTypeViewProps {
  task: {
    id: string;
    title: string;
    type_id: string;
    target_id?: string;
  };
  onClose: () => void;
}
