import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { TaskTypeViewProps } from "./types";

export function DefaultTaskView({ task, onClose }: TaskTypeViewProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">{task.title}</h3>
        <p className="text-sm text-muted-foreground">
          This is a default task view. No special actions are available.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onClose}
        >
          <X className="h-4 w-4 mr-2" />
          Close
        </Button>
      </div>
    </div>
  );
}
