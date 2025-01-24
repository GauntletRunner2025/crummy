import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskButtonProps {
  id: string;
  title: string;
  isSelected?: boolean;
  onSelect: (task: { id: string; title: string }) => void;
}

export function TaskButton({ id, title, isSelected, onSelect }: TaskButtonProps) {
  const handleClick = () => {
    onSelect({ id, title });
  };

  return (
    <Button
      variant="ghost"
      className={"w-full p-0 h-auto " + (isSelected ? "bg-accent" : "")}
      onClick={handleClick}
    >
      <div className="task-card w-full">
        {title}
      </div>
    </Button>
  );
}
