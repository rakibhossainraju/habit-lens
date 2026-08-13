import React from "react";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("p-8 text-center transition-colors border-dashed", className)}>
      <CardContent className="flex flex-col items-center justify-center p-6 space-y-3">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground mb-1">
          <FolderOpen className="size-6 text-muted-foreground" strokeWidth={1.5} />
        </div>

        <h3 className="text-base font-medium text-foreground tracking-tight">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>

        {(actionLabel && (onAction || actionHref)) && (
          <div className="pt-2">
            {actionHref ? (
              <Link href={actionHref}>
                <Button variant="outline" size="sm">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button variant="outline" size="sm" onClick={onAction}>
                {actionLabel}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
