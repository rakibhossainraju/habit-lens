import React from "react";
import { Moon, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface SleepCardProps {
  sleepTime: string;
  wakeTime: string;
  onSleepTimeChange: (val: string) => void;
  onWakeTimeChange: (val: string) => void;
  calculatedDuration: number;
  className?: string;
}

export function SleepCard({
  sleepTime,
  wakeTime,
  onSleepTimeChange,
  onWakeTimeChange,
  calculatedDuration,
  className,
}: SleepCardProps) {
  return (
    <Card className={cn("overflow-hidden transition-colors", className)}>
      <CardHeader className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Moon className="size-4 shrink-0" strokeWidth={1.75} />
            </div>
            <div>
              <CardTitle className="text-base font-medium">Sleep Window</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Record your bedtime and wakeup times to calculate sleep duration
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider block">
              Duration
            </span>
            <span className="font-mono text-xl font-semibold text-foreground">
              {calculatedDuration > 0 ? calculatedDuration : "0.0"}{" "}
              <span className="text-xs text-muted-foreground font-normal">hrs</span>
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Sleep Time (Bedtime)
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="time"
              value={sleepTime}
              onChange={(e) => onSleepTimeChange(e.target.value)}
              className="pl-9 font-mono text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground block mb-1.5">
            Wake Time
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="time"
              value={wakeTime}
              onChange={(e) => onWakeTimeChange(e.target.value)}
              className="pl-9 font-mono text-sm"
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
