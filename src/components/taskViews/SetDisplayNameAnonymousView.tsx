import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TaskTypeViewProps } from "./types";

export function SetDisplayNameAnonymousView({ task, onClose }: TaskTypeViewProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Generate anonymous name
      const anonymousName = `Anonymous${Math.floor(Math.random() * 10000)}`;

      // Update display name in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: anonymousName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Mark task as complete
      const { error: taskError } = await supabase
        .from('tasks')
        .update({ status: 'Complete' })
        .eq('id', task.id);

      if (taskError) throw taskError;

      onClose();
    } catch (error) {
      console.error('Failed to set anonymous name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Click "Stay Anonymous" to get a randomly generated anonymous name.
        </p>
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
          disabled={isUpdating}
        >
          Stay Anonymous
        </Button>
      </div>
    </div>
  );
}
