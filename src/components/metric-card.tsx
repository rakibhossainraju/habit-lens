import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: string;
  className?: string;
}

export function MetricCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-colors", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </span>
          {Icon && (
            <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1.5 mt-1">
          <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs font-medium text-muted-foreground">
              {unit}
            </span>
          )}
        </div>

        {(subtitle || trend) && (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/50 text-xs text-muted-foreground">
            {trend && (
              <span className="font-mono font-medium text-foreground bg-secondary/80 px-1.5 py-0.5 rounded text-[11px]">
                {trend}
              </span>
            )}
            {subtitle && <span>{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
