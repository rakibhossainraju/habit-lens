import {
  BedDouble,
  Zap,
  TrendingUp,
  Plus,
  ArrowRight,
  CalendarDays,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { StatCard } from "@/components/cards/stat-card";
import { SectionCard } from "@/components/cards/section-card";
import { Button } from "@/components/ui/button";

const recentLogs = [
  { date: "Today", sleep: "7h 30m", morning: 7, afternoon: 6, evening: 8 },
  { date: "Yesterday", sleep: "6h 45m", morning: 5, afternoon: 5, evening: 7 },
  { date: "Jun 13", sleep: "8h 10m", morning: 8, afternoon: 7, evening: 8 },
  { date: "Jun 12", sleep: "7h 00m", morning: 6, afternoon: 6, evening: 6 },
  { date: "Jun 11", sleep: "6h 20m", morning: 4, afternoon: 5, evening: 6 },
];

const insights = [
  {
    text: "Your energy is 22% higher on days with 7h+ sleep.",
    icon: Lightbulb,
    color: "text-primary",
    dot: "bg-primary",
  },
  {
    text: "Evening energy consistently peaks mid-week.",
    icon: TrendingUp,
    color: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  {
    text: "Weekend bedtimes are 45 min later on average.",
    icon: BedDouble,
    color: "text-amber-600",
    dot: "bg-amber-400",
  },
];

function EnergyBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
      <span className="w-4 text-right text-xs tabular-nums text-muted-foreground">
        {value}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <PageTitle>Good morning</PageTitle>
          <PageDescription>
            Sunday, June 15 · Here&apos;s your wellness snapshot.
          </PageDescription>
        </div>
        <Button render={<Link href="/logs/new" />} size="sm">
          <Plus className="size-3.5" />
          Log today
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Avg Sleep"
          value="7.2h"
          icon={BedDouble}
          trend="up"
          trendValue="+0.4h"
          subtext="vs last week"
        />
        <StatCard
          label="Morning Energy"
          value="6.8"
          icon={Zap}
          trend="up"
          trendValue="+0.6"
          subtext="7-day avg"
        />
        <StatCard
          label="Consistency"
          value="82%"
          icon={TrendingUp}
          trend="neutral"
          trendValue="Stable"
        />
        <StatCard
          label="Days Logged"
          value="24"
          icon={CalendarDays}
          trend="up"
          trendValue="+3"
          subtext="this month"
        />
      </div>

      {/* Recent Logs + Insights */}
      <div className="grid gap-4 lg:grid-cols-5">
        {/* Recent Logs */}
        <div className="lg:col-span-3">
          <SectionCard
            title="Recent Entries"
            description="Your last 5 daily logs at a glance."
            action={
              <Button variant="ghost" size="xs" render={<Link href="/logs" />}>
                View all <ArrowRight className="size-3" />
              </Button>
            }
          >
            <div className="flex flex-col divide-y divide-border">
              {recentLogs.map((log) => (
                <div
                  key={log.date}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="w-20 shrink-0">
                    <p className="text-sm font-medium text-foreground">
                      {log.date}
                    </p>
                    <p className="text-xs text-muted-foreground">{log.sleep}</p>
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-muted-foreground">
                        Morning
                      </span>
                      <EnergyBar value={log.morning} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-muted-foreground">
                        Afternoon
                      </span>
                      <EnergyBar value={log.afternoon} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-16 text-xs text-muted-foreground">
                        Evening
                      </span>
                      <EnergyBar value={log.evening} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        {/* Insights */}
        <div className="lg:col-span-2">
          <SectionCard
            title="Latest Insights"
            description="Patterns detected this week."
            action={
              <Button
                variant="ghost"
                size="xs"
                render={<Link href="/insights" />}
              >
                All <ArrowRight className="size-3" />
              </Button>
            }
          >
            <div className="flex flex-col gap-4">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${insight.dot}`}
                  />
                  <p className="text-sm leading-snug text-foreground/80">
                    {insight.text}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Weekly Trend Placeholder */}
      <SectionCard
        title="7-Day Energy Trend"
        description="Morning, afternoon, and evening energy over the past week."
      >
        <div className="flex h-48 items-end gap-3 pt-4">
          {recentLogs
            .slice()
            .reverse()
            .concat([
              {
                date: "Jun 10",
                sleep: "7h 45m",
                morning: 7,
                afternoon: 8,
                evening: 9,
              },
              {
                date: "Jun 9",
                sleep: "8h 00m",
                morning: 8,
                afternoon: 7,
                evening: 8,
              },
            ])
            .slice(0, 7)
            .map((log, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-col gap-0.5">
                  {[log.morning, log.afternoon, log.evening].map((val, j) => (
                    <div
                      key={j}
                      // @no-color
                      className="w-full rounded-sm opacity-80 bg-gray-200"
                      style={{
                        height: `${(val / 10) * 80}px`,
                        // backgroundColor: `oklch(${0.62 - j * 0.08} 0.12 ${162 - j * 2})`,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-muted-foreground">
                  {log.date
                    .replace("Today", "Today")
                    .replace("Yesterday", "Yest.")}
                </span>
              </div>
            ))}
        </div>
        <div className="mt-3 flex items-center gap-4 border-t pt-3">
          {["Morning", "Afternoon", "Evening"].map((label, i) => (
            <div key={label} className="flex items-center gap-1.5">
              <div
                // @no-color
                className="size-2 rounded-full bg-gray-200"
                style={
                  {
                    // backgroundColor: `oklch(${0.62 - i * 0.08} 0.12 ${162 - i * 2})`,
                  }
                }
              />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </SectionCard>
    </PageContainer>
  );
}
