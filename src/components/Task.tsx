import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TaskProps {
  id: string;
  title: string;
  onClick?: () => void;
}

export function Task({ id, title, onClick }: TaskProps) {
  const handleClick = () => {
    console.log("Task clicked:", title);
    onClick?.();
  };

  return (
    <Button
      variant="ghost"
      className="w-full p-0 h-auto"
      onClick={handleClick}
    >
      <Card className="task-card w-full">
        {title}
      </Card>
    </Button>
  );
}
