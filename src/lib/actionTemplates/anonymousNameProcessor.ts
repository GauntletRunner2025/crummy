import type { ActionTemplateProcessor } from '../../types/ActionTemplate';
import type { Task } from '../../types/Task';

export const anonymousNameProcessor: ActionTemplateProcessor = async (task: Task) => {
    if (!task) {
        throw new Error('Task is required');
    }

    return {
        displayName: 'Anonymous'
    };
};
