import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground bg-gradient-to-b from-gradient-btn-start to-gradient-btn-end shadow-[0px_4px_4px_#00000040] text-2xl pt-4 cursor-pointer hover:shadow-[0px_4px_4px_#00000080] active:scale-105 focus-visible:shadow-[0px_4px_4px_#00000080] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:focus-visible:ring-offset-foreground transition-all duration-200 ease-in-out leading-0.5",
        button:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:scale-110 active:scale-105 transition-all duration-200 ease-in-out",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:scale-110 active:scale-105 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 transition-all duration-200 ease-in-out",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-105 dark:bg-input/30 dark:border-input dark:hover:bg-input/50 transition-all duration-200 ease-in-out",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:scale-110 active:scale-105 transition-all duration-200 ease-in-out",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:scale-110 active:scale-105 dark:hover:bg-accent/50 transition-all duration-200 ease-in-out",
        link: "text-primary underline-offset-4 hover:underline hover:scale-110 active:scale-105 transition-all duration-200 ease-in-out",
      },
      size: {
        default: "h-9 px-4 pt-2 pb-1 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
