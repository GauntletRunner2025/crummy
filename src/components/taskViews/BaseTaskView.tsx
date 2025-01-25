import React from 'react';
import { supabase } from "@/lib/supabase";
import { TaskTypeViewProps } from './types';

interface BaseTaskViewState {
  isSubmitting: boolean;
}

export abstract class BaseTaskView<S extends BaseTaskViewState = BaseTaskViewState> extends React.Component<TaskTypeViewProps, S> {
  // Abstract method that derived classes must implement
  protected abstract renderContent(): React.ReactNode;
  
  // Base functionality for completing a task
  protected async completeTask(): Promise<void> {
    if (!this.props.task?.id) {
      throw new Error('Cannot complete task: task ID is missing');
    }
    
    this.setState({ isSubmitting: true } as Partial<S>);
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', this.props.task.id);

      if (error) throw error;
      
      this.props.onClose();
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    } finally {
      this.setState({ isSubmitting: false } as Partial<S>);
    }
  }

  render() {
    return this.renderContent();
  }
}
