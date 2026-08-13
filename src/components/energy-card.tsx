import React from "react";
import { Sun, SunMedium, Sunset } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

interface EnergyCardProps {
  morningEnergy: number;
  afternoonEnergy: number;
  eveningEnergy: number;
  onMorningChange: (val: number) => void;
  onAfternoonChange: (val: number) => void;
  onEveningChange: (val: number) => void;
  className?: string;
}

export function EnergyCard({
  morningEnergy,
  afternoonEnergy,
  eveningEnergy,
  onMorningChange,
  onAfternoonChange,
  onEveningChange,
  className,
}: EnergyCardProps) {
  const energyLevels = [
    {
      label: "Morning Energy",
      value: morningEnergy,
      onChange: onMorningChange,
      icon: Sun,
      color: "var(--chart-1)",
      hint: "7:00 AM – 12:00 PM",
    },
    {
      label: "Afternoon Energy",
      value: afternoonEnergy,
      onChange: onAfternoonChange,
      icon: SunMedium,
      color: "var(--chart-2)",
      hint: "12:00 PM – 5:00 PM",
    },
    {
      label: "Evening Energy",
      value: eveningEnergy,
      onChange: onEveningChange,
      icon: Sunset,
      color: "var(--chart-3)",
      hint: "5:00 PM – 10:00 PM",
    },
  ];

  return (
    <Card className={cn("overflow-hidden transition-colors", className)}>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="text-base font-medium">Diurnal Energy Ratings</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Rate your qualitative energy levels from 0 to 10 across three time periods
        </CardDescription>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-5">
        {energyLevels.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="size-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">{item.label}</span>
                <span className="text-[10px] text-muted-foreground font-mono">({item.hint})</span>
              </div>
              <span className="font-mono text-xs font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">
                {item.value} / 10
              </span>
            </div>

            {/* Custom 0-10 Button selector grid */}
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, i) => i).map((num) => {
                const isSelected = item.value === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => item.onChange(num)}
                    className={cn(
                      "h-8 rounded text-xs font-mono transition-colors border",
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold border-primary"
                        : "bg-background text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
