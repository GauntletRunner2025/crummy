import { Task } from './Task';

export interface ActionTemplate {
    id: string;
    name: string;
    description: string | null;
    processor_function: string;
    is_active: boolean;
    task_type: string;
}

export interface ActionOption {
    id: string;
    task_id: string;
    template_id: string;
    option_data: Record<string, any>;
    created_at: string;
}

// Example processor function type
export type ActionTemplateProcessor = (
    task: Task
) => Promise<Record<string, any>>;

// Example processor function
export const exampleProcessor: ActionTemplateProcessor = async (task) => {
    if (!task) {
        throw new Error('Task is required');
    }

    // Process the task 
    // This is where you'd implement the logic to transform task data
    // into prefilled form fields based on the template
    
    return {
        suggestedTitle: `${task.title}`,
        suggestedFields: {
            // Add your processed fields here
        }
    };
};
