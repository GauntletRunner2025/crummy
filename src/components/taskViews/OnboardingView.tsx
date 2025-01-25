import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { TaskTypeViewProps } from "./types";

export function OnboardingView({ task, onClose }: TaskTypeViewProps) {
  const [emailBody, setEmailBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    // Extract email from task title (format: "New User Onboarding: email@example.com")
    const emailMatch = task.title.match(/New User Onboarding: (.+@.+)/);
    if (emailMatch) {
      setEmail(emailMatch[1]);
    }
  }, [task.title]);

  const handleSubmit = async () => {
    if (!emailBody.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Update task status
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', task.id);

      if (taskError) throw taskError;

      // Update onboarding status
      const { error: onboardingError } = await supabase
        .from('onboarding')
        .update({ status: 'invited' })
        .eq('email', email);

      if (onboardingError) throw onboardingError;

      // TODO: Send email invitation (will be implemented in a separate Edge function)
      
      onClose();
    } catch (error) {
      console.error('Failed to process onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <Input
          value={email}
          readOnly
          className="bg-muted"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Invitation Message</label>
        <Textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          placeholder="Enter your invitation message here..."
          className="min-h-[200px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !emailBody.trim()}
        >
          Invite User
        </Button>
      </div>
    </div>
  );
}
