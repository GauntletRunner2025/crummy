export interface Task {
  id: string;
  title: string;
  type_id: string;
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
  };
  onClose: () => void;
}
