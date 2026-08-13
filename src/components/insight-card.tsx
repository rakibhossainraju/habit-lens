import React from "react";
import { Lightbulb, Layers } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { RuleInsight } from "@/lib/types";
import { cn } from "@/lib/utils";

interface InsightCardProps {
  insight: RuleInsight;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const getConfidenceBadgeVariant = (confidence: RuleInsight["confidence"]) => {
    switch (confidence) {
      case "High":
        return "highConfidence";
      case "Medium":
        return "mediumConfidence";
      case "Low":
        return "lowConfidence";
      default:
        return "muted";
    }
  };

  return (
    <Card className={cn("flex flex-col justify-between transition-colors", className)}>
      <CardHeader className="p-5 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Lightbulb className="size-4 shrink-0" strokeWidth={1.75} />
            </div>
            <CardTitle className="text-base font-medium text-foreground leading-snug">
              {insight.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-1 space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {insight.description}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/60">
          <Badge variant={getConfidenceBadgeVariant(insight.confidence)}>
            {insight.confidence} confidence — {insight.logsAnalyzed} logs
          </Badge>

          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
            <Layers className="size-3.5" />
            <span>{insight.relatedMetric}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
