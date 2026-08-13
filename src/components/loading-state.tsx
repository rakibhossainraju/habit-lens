import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  rows?: number;
  className?: string;
}

export function LoadingState({ rows = 3, className }: LoadingStateProps) {
  return (
    <div className={cn("space-y-4 animate-pulse", className)}>
      <div className="h-8 w-1/3 bg-muted rounded-lg" />
      <div className="space-y-2">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 w-full bg-muted/60 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
