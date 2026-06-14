import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type TrendDirection = "up" | "down" | "neutral";

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: TrendDirection;
  trendValue?: string;
  className?: string;
}

const trendColors: Record<TrendDirection, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-rose-500 dark:text-rose-400",
  neutral: "text-muted-foreground",
};

const trendSymbols: Record<TrendDirection, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  trendValue,
  className,
}: StatCardProps) {
  return (
    <Card size="sm" className={cn("min-w-0", className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          {Icon && (
            <div className="flex size-7 shrink-0 items-center justify-center rounded-xl bg-accent">
              <Icon className="size-3.5 text-accent-foreground" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="font-heading text-3xl font-normal tracking-tight text-foreground">
          {value}
        </p>
        {(subtext || (trend && trendValue)) && (
          <div className="mt-1.5 flex items-center gap-2">
            {trend && trendValue && (
              <span className={cn("text-xs font-medium", trendColors[trend])}>
                {trendSymbols[trend]} {trendValue}
              </span>
            )}
            {subtext && (
              <span className="text-xs text-muted-foreground">{subtext}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
