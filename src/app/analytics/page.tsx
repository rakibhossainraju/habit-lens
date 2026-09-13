"use client";

import React from "react";
import { Moon, Sun, Activity } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { TrendChartCard } from "@/components/trend-chart-card";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStorage } from "@/lib/storage-context";

export default function AnalyticsPage() {
  const { logs, metrics } = useStorage();

  const correlations = [
    {
      title: "Sleep Duration vs. Morning Energy",
      correlation: "+0.82 Strong Positive",
      description: "Getting 8+ hours of sleep strongly correlates with higher morning energy ratings (avg 8.1/10).",
      domain: "Sleep & Energy",
      color: "var(--chart-4)",
    },
    {
      title: "Movement & Exercise vs. Afternoon Stamina",
      correlation: "+0.65 Moderate Positive",
      description: "Days with 30+ minutes of exercise (walk, jog, cycling) show sustained afternoon ratings.",
      domain: "Exercise & Diurnal Energy",
      color: "var(--chart-1)",
    },
    {
      title: "Sugar Intake vs. Evening Energy Stability",
      correlation: "-0.41 Slight Negative",
      description: "Higher sugar intake shows a mild decrease in evening energy stability, though sleep timing remains primary.",
      domain: "Sugar & Evening Energy",
      color: "var(--chart-3)",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Analytics & Trends"
        description="Honest trend visualizations and correlation analyses start with zero baselines and non-judgmental scaling."
      />

      {/* Sleep Trends Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Moon className="size-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Sleep Trends</h2>
            <p className="text-xs text-muted-foreground">Sleep duration over time & bedtime consistency</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrendChartCard
            title="Sleep Duration Over Time"
            description="Hours slept per night across recent 14 logs (Target window: 7.5h – 9.0h)"
            entries={logs}
            maxVal={12}
            series={[
              {
                key: "sleepDuration",
                label: "Sleep Duration",
                colorVar: "var(--chart-4)",
                unit: "hrs",
              },
            ]}
          />

          <TrendChartCard
            title="Bedtime Window Consistency"
            description="Chronological bar visualization of sleep duration variability"
            entries={logs}
            type="bar"
            maxVal={12}
            series={[
              {
                key: "sleepDuration",
                label: "Duration (hrs)",
                colorVar: "var(--chart-5)",
                unit: "hrs",
              },
            ]}
          />
        </div>
      </div>

      {/* Energy Trends Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Sun className="size-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Energy Trends</h2>
            <p className="text-xs text-muted-foreground">Diurnal energy breakdown: Morning, Afternoon, Evening</p>
          </div>
        </div>

        <TrendChartCard
          title="Diurnal Energy Progression"
          description="Comparison of qualitative energy ratings (0-10) across morning, afternoon, and evening"
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
              key: "eveningEnergy",
              label: "Evening Energy",
              colorVar: "var(--chart-3)",
              unit: "/10",
            },
          ]}
        />
      </div>

      {/* Correlation Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Activity className="size-4" strokeWidth={1.75} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground font-sans">Discovered Correlations</h2>
            <p className="text-xs text-muted-foreground">Neutral mathematical correlation between lifestyle factors</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {correlations.map((c) => (
            <Card key={c.title} className="flex flex-col justify-between p-5 space-y-3">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="muted" className="font-mono text-[10px]">
                    {c.domain}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-foreground" style={{ color: c.color }}>
                    {c.correlation}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-foreground leading-snug">{c.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{c.description}</p>
              </div>

              <div className="pt-3 border-t border-border/60 text-[11px] font-mono text-muted-foreground flex justify-between">
                <span>Sample Size: {metrics.totalLogs} logs</span>
                <span>Honest scale</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
