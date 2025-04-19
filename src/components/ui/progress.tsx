import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  value,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-white relative h-4 w-full overflow-hidden rounded-full p-[2px] flex",
        className
      )}
      {...props}
    >
      <div className="w-full h-full overflow-hidden rounded-full">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary h-full w-full flex-1 transition-all duration-500 rounded-r-full"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    </ProgressPrimitive.Root>
  );
}

export { Progress };
