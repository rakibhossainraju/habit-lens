"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Moon, Sun, SunMedium, Sunset, Sparkles, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { InsightCard } from "@/components/insight-card";
import { TrendChartCard } from "@/components/trend-chart-card";
import { LogTable } from "@/components/log-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useStorage } from "@/lib/storage-context";

export default function DashboardPage() {
  const { logs, insights, metrics, deleteLog } = useStorage();

  // `new Date()` isn't deterministic across server/client renders, so "today"
  // is resolved client-side only, after mount.
  const [todayDate, setTodayDate] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTodayDate(new Date().toISOString().split("T")[0]);
  }, []);

  const todayLog = todayDate ? logs.find((l) => l.date === todayDate) : undefined;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        description="Observe your recent wellbeing trends and daily activity patterns with quiet clarity."
      >
        <Link href="/logs/new">
          <Button variant="default" size="sm" className="gap-2">
            <PlusCircle className="size-4" />
            <span>Quick Log</span>
          </Button>
        </Link>
      </PageHeader>

      {/* Today's Status Banner */}
      <Card className="bg-secondary/40 border-border">
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {todayLog ? "Today's entry recorded" : "No log recorded for today yet"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {todayLog
                  ? `Logged ${todayLog.sleepDuration} hrs sleep and morning energy of ${todayLog.morningEnergy}/10.`
                  : "Take a quiet moment to record your sleep window and diurnal energy ratings."}
              </p>
            </div>
          </div>

          <Link href="/logs/new">
            <Button variant={todayLog ? "outline" : "default"} size="sm">
              {todayLog ? "Update Today's Log" : "Log Today's Entry"}
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Key Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Avg Sleep Duration"
          value={metrics.avgSleep}
          unit="hrs"
          subtitle="Based on recent 14 logs"
          icon={Moon}
          trend="8.0h Target"
        />
        <MetricCard
          title="Avg Morning Energy"
          value={metrics.avgMorningEnergy}
          unit="/ 10"
          subtitle="Diurnal start clarity"
          icon={Sun}
          trend="7.4/10 Avg"
        />
        <MetricCard
          title="Avg Afternoon Energy"
          value={metrics.avgAfternoonEnergy}
          unit="/ 10"
          subtitle="Midday stamina"
          icon={SunMedium}
          trend="6.8/10 Avg"
        />
        <MetricCard
          title="Sleep Consistency"
          value={`${metrics.sleepConsistency}%`}
          subtitle="7.5h–9.0h optimal window"
          icon={Sunset}
          trend={`${metrics.totalLogs} Logs`}
        />
      </div>

      {/* Trend Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrendChartCard
            title="Diurnal Energy & Sleep Trends"
            description="14-day chronological progression of sleep duration and energy ratings"
            entries={logs}
            maxVal={10}
            series={[
              {
                key: "morningEnergy",
                label: "Morning Energy",
                colorVar: "var(--chart-1)",
                unit: "/10",
              },
              {
                key: "afternoonEnergy",
                label: "Afternoon Energy",
                colorVar: "var(--chart-2)",
                unit: "/10",
              },
              {
                key: (entry) => entry.sleepDuration,
                label: "Sleep (hrs)",
                colorVar: "var(--chart-4)",
                unit: "hrs",
                dashed: true,
              },
            ]}
          />
        </div>

        {/* Latest Rule-Based Insights preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-foreground">Latest Insights</h2>
            <Link
              href="/insights"
              className="text-xs font-mono text-muted-foreground hover:text-primary flex items-center gap-1"
            >
              <span>View all ({insights.length})</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>

          <div className="space-y-4">
            {insights.slice(0, 2).map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>
      </div>

      {/* Recent Entries Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium text-foreground">Recent Entries</h2>
            <p className="text-xs text-muted-foreground">Historical daily logs overview</p>
          </div>
          <Link href="/logs">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs font-mono">
              <span>View All Logs</span>
              <ArrowRight className="size-3.5" />
            </Button>
          </Link>
        </div>

        <LogTable logs={logs.slice(0, 5)} onDeleteLog={deleteLog} showFilters={false} />
      </div>
    </div>
  );
}
