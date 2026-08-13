import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-primary text-primary-foreground",
        secondary:
          "border border-transparent bg-secondary text-secondary-foreground",
        muted:
          "border border-transparent bg-muted text-muted-foreground",
        accent:
          "border border-transparent bg-accent text-accent-foreground",
        outline:
          "border border-border text-foreground",
        highConfidence:
          "border border-primary/20 bg-primary/10 text-primary dark:bg-primary/20",
        mediumConfidence:
          "border border-muted-foreground/20 bg-muted text-muted-foreground",
        lowConfidence:
          "border border-border bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
