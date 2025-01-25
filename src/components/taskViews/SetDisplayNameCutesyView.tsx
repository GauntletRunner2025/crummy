import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { TaskTypeViewProps } from "./types";

export function SetDisplayNameCutesyView({ task, onClose }: TaskTypeViewProps) {
  const [cuteName, setCuteName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchRandomCuteName = async () => {
    setIsLoading(true);
    try {
      // Get a random untaken name using our stored procedure
      const { data, error } = await supabase
        .rpc('get_random_untaken_cute_name');

      if (error) throw error;
      if (!data || data.length === 0) throw new Error('No cute names available');

      setCuteName(data[0].name);
    } catch (error) {
      console.error('Error fetching cute name:', error);
      // Fallback to a default cute name if something goes wrong
      setCuteName('★ Cutie ★');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!cuteName.trim()) return;
    
    setIsUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Mark the cute name as taken
      const { data: cuteNameData } = await supabase
        .from('cute_names')
        .select('id')
        .eq('name', cuteName)
        .single();

      if (cuteNameData) {
        const { error: updateError } = await supabase
          .from('cute_names')
          .update({ taken: true })
          .eq('id', cuteNameData.id);

        if (updateError) throw updateError;
      }

      // Update display name in profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ display_name: cuteName })
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

  // Fetch a random name when the component mounts
  useEffect(() => {
    fetchRandomCuteName();
  }, []);

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Choose a Cute Name!</label>
        <div className="flex gap-2">
          <Input
            value={cuteName}
            readOnly
            placeholder="Loading cute name..."
            disabled={isLoading}
            className="w-[62%]"
          />
          <Button
            variant="ghost"
            onClick={fetchRandomCuteName}
            disabled={isLoading || isUpdating}
            title="Roll for a new cute name"
            className="flex-none w-[38%] text-lg"
          >
            🎲 Roll Again
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Click the dice to get a different cute name!
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdating}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!cuteName.trim() || isUpdating || isLoading}
        >
          {isUpdating ? "Updating..." : "Set Display Name"}
        </Button>
      </div>
    </div>
  );
}
