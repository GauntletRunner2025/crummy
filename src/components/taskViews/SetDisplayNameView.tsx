import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TaskTypeViewProps } from "./types";

export function SetDisplayNameView({ task, onClose }: TaskTypeViewProps) {
  const [displayName, setDisplayName] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (!displayName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update display name in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: displayName })
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
      console.error('Failed to update display name:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Display Name</label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
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
          disabled={isUpdating || !displayName.trim()}
        >
          Set Display Name
        </Button>
      </div>
    </div>
  );
}
