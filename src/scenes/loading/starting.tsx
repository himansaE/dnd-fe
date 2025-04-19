import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  smooth?: boolean;
  className?: string;
};

export const StartingScene = ({
  value: progress = 0, // Default to 0 if not provided
  smooth = true,
  className = "",
}: ProgressProps) => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-charcoal ">
      <div className="flex flex-col items-center justify-center gap-5">
        <h1 className="text-4xl font-bold text-white">GAME STARTING</h1>
        <Progress
          value={progress > 100 ? 100 : progress}
          className={cn(smooth ? "transition-all duration-500" : "", className)}
        />
      </div>
    </div>
  );
};
