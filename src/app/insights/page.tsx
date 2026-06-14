import { TrendingUp, TrendingDown, Minus, BedDouble, Zap, Dumbbell, Droplets } from "lucide-react";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/cards/stat-card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface Insight {
  title: string;
  description: string;
  confidence: "high" | "medium" | "low";
  relatedMetric: string;
  direction: "positive" | "negative" | "neutral";
  icon: LucideIcon;
}

const insights: Insight[] = [
  {
    title: "Better energy on exercise days",
    description:
      "On days you logged exercise, your average afternoon energy was 7.4 compared to 5.1 on non-exercise days — a 45% increase.",
    confidence: "high",
    relatedMetric: "Exercise → Afternoon Energy",
    direction: "positive",
    icon: Dumbbell,
  },
  {
    title: "Sleep under 6.5h predicts low morning energy",
    description:
      "In 91% of cases, sleeping less than 6.5 hours was followed by a morning energy score of 4 or below.",
    confidence: "high",
    relatedMetric: "Sleep Duration → Morning Energy",
    direction: "negative",
    icon: BedDouble,
  },
  {
    title: "Evening energy peaks mid-week",
    description:
      "Tuesday through Thursday show consistently higher evening energy (avg 7.8) compared to weekends (avg 6.2).",
    confidence: "medium",
    relatedMetric: "Day of Week → Evening Energy",
    direction: "neutral",
    icon: Zap,
  },
  {
    title: "High water intake correlates with higher energy",
    description:
      "Days with 2L+ water intake show 0.8 higher average energy across all three time periods.",
    confidence: "medium",
    relatedMetric: "Water Intake → Overall Energy",
    direction: "positive",
    icon: Droplets,
  },
  {
    title: "Consistent bedtime improves next-day focus",
    description:
      "When your sleep and wake time varied by less than 30 minutes from your average, morning energy averaged 7.2 vs 5.6.",
    confidence: "high",
    relatedMetric: "Sleep Consistency → Morning Energy",
    direction: "positive",
    icon: BedDouble,
  },
  {
    title: "Weekend sleep duration is longer but less restorative",
    description:
      "Despite averaging 8.2h on weekends vs 7.1h on weekdays, Monday morning energy scores are the lowest of the week.",
    confidence: "low",
    relatedMetric: "Weekend Sleep → Monday Energy",
    direction: "negative",
    icon: BedDouble,
  },
];

const confidenceConfig = {
  high: { label: "High", bar: "w-full", color: "bg-primary" },
  medium: { label: "Medium", bar: "w-2/3", color: "bg-amber-400" },
  low: { label: "Low", bar: "w-1/3", color: "bg-muted-foreground/40" },
};

const directionConfig = {
  positive: { icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
  negative: { icon: TrendingDown, color: "text-rose-500 dark:text-rose-400" },
  neutral: { icon: Minus, color: "text-muted-foreground" },
};

function InsightCard({ insight }: { insight: Insight }) {
  const conf = confidenceConfig[insight.confidence];
  const dir = directionConfig[insight.direction];
  const DirectionIcon = dir.icon;
  const MetricIcon = insight.icon;

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-md ring-1 ring-foreground/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent">
            <MetricIcon className="size-4 text-accent-foreground" strokeWidth={1.5} />
          </div>
          <p className="font-heading text-base font-normal text-foreground leading-snug">
            {insight.title}
          </p>
        </div>
        <DirectionIcon className={cn("mt-0.5 size-4 shrink-0", dir.color)} />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {insight.description}
      </p>

      <div className="flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{insight.relatedMetric}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{conf.label} confidence</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div className={cn("h-full rounded-full", conf.bar, conf.color)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const highConf = insights.filter((i) => i.confidence === "high");
  const otherConf = insights.filter((i) => i.confidence !== "high");

  return (
    <PageContainer>
      <div>
        <PageTitle>Insights</PageTitle>
        <PageDescription>
          Rule-based patterns detected from your logged data. Updated as you add more entries.
        </PageDescription>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Insights" value={insights.length} icon={TrendingUp} />
        <StatCard label="High Confidence" value={highConf.length} icon={TrendingUp} trend="up" trendValue="Strong signal" />
        <StatCard label="Entries Analysed" value="24" icon={BedDouble} subtext="last 30 days" />
      </div>

      {/* High confidence */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            High confidence
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {highConf.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </div>

      {/* Other insights */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Emerging patterns
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {otherConf.map((insight) => (
            <InsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
