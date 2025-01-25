import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { BaseTaskView } from './BaseTaskView';
import styles from './OnboardingView.module.css';

interface OnboardingViewState {
  targetEmail: string;
  requesterEmail: string;
  notes: string;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export class OnboardingView extends BaseTaskView<OnboardingViewState> {
  state: OnboardingViewState = {
    targetEmail: "",
    requesterEmail: "",
    notes: "",
    isSubmitting: false,
    isLoading: true,
    error: null
  };

  async componentDidMount() {
    await this.loadOnboardingDetails();
  }

  private async loadOnboardingDetails() {
    if (!this.props.task?.target_id) {
      this.setState({ 
        isLoading: false,
        error: 'Invalid onboarding task: missing target ID'
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('onboarding')
        .select('email, requested_by_email')
        .eq('id', this.props.task.target_id)
        .single();

      if (error) throw error;
      
      if (!data?.email) {
        throw new Error('Onboarding record is missing email');
      }

      this.setState({
        targetEmail: data.email,
        requesterEmail: data.requested_by_email || "",
        error: null
      });
    } catch (error) {
      console.error('Failed to load onboarding details:', error);
      this.setState({ 
        error: 'Failed to load onboarding details' 
      });
    } finally {
      this.setState({ isLoading: false });
    }
  }

  private async handleSubmit(): Promise<void> {
    const { notes } = this.state;
    const { task } = this.props;
    
    if (!notes?.trim()) {
      this.setState({ error: 'Please enter onboarding notes' });
      return;
    }

    if (!task?.target_id) {
      this.setState({ error: 'Invalid task: missing target ID' });
      return;
    }

    this.setState({ isSubmitting: true, error: null });
    
    try {
      // First complete the base task
      await this.completeTask();

      // Then handle onboarding-specific updates
      const { data, error } = await supabase
        .from('onboarding')
        .update({ 
          status: 'processed',
          notes: notes.trim(),
          approved: true
        })
        .eq('id', task.target_id)
        .select();  // Add select to get back the updated row

      if (error) {
        console.error('Failed to update onboarding:', error);
        throw error;
      }

      console.log('Updated onboarding record:', data);
    } catch (error) {
      console.error('Failed to process onboarding:', error);
      this.setState({ 
        error: 'Failed to process onboarding. Please try again.' 
      });
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  protected renderContent(): React.ReactNode {
    const { isLoading, isSubmitting, targetEmail, requesterEmail, notes, error } = this.state;

    if (isLoading) {
      return (
        <div className={`task-view-content text-muted-foreground ${styles.taskViewContent}`}>
          Loading onboarding details...
        </div>
      );
    }

    if (error) {
      return (
        <div className={`task-view-content text-destructive ${styles.taskViewContent}`}>
          {error}
        </div>
      );
    }

    return (
      <div className={`task-view-content space-y-4 ${styles.taskViewContent}`}>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">New User Onboarding</h3>

          <div className="grid gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Email</label>
              <Input
                value={targetEmail}
                readOnly
                className="bg-muted"
              />
            </div>

            {requesterEmail && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Requested By</label>
                <Input
                  value={requesterEmail}
                  readOnly
                  className="bg-muted"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Textarea
              value={notes}
              onChange={(e) => this.setState({ notes: e.target.value, error: null })}
              placeholder="Enter any notes about the onboarding process..."
              className={`${styles.notesTextarea}`}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={this.props.onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={() => this.handleSubmit()}
            disabled={isSubmitting || !notes?.trim()}
          >
            {isSubmitting ? "Processing..." : "Complete Onboarding"}
          </Button>
        </div>
      </div>
    );
  }
}
