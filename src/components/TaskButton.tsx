import { Button } from "@/components/ui/button";

interface TaskButtonProps {
  title: string;
  isSelected: boolean;
  onClick: () => void;
}

export function TaskButton({ title, isSelected, onClick }: TaskButtonProps) {
  return (
    <Button
      variant="ghost"
      className={`w-full rounded-none h-auto px-2 py-2 justify-start hover:bg-accent ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={onClick}
    >
      <div className="whitespace-normal text-left">{title}</div>
    </Button>
  );
}
