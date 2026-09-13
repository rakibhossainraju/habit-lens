"use client";

import React, { useState } from "react";
import { Moon, Sun, Flame, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MetricCard } from "@/components/metric-card";
import { InsightCard } from "@/components/insight-card";
import { TrendChartCard } from "@/components/trend-chart-card";
import { LogTable } from "@/components/log-table";
import { SleepCard } from "@/components/sleep-card";
import { EnergyCard } from "@/components/energy-card";
import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { INITIAL_LOG_ENTRIES, INITIAL_RULE_INSIGHTS } from "@/lib/mock-data";

const COLOR_TOKENS = [
  { name: "Primary", className: "bg-primary text-primary-foreground" },
  { name: "Secondary", className: "bg-secondary text-secondary-foreground" },
  { name: "Accent", className: "bg-accent text-accent-foreground" },
  { name: "Muted", className: "bg-muted text-muted-foreground" },
  { name: "Card", className: "bg-card text-card-foreground border border-border" },
  { name: "Sidebar", className: "bg-sidebar text-sidebar-foreground" },
  { name: "Destructive", className: "bg-destructive/10 text-destructive" },
];

const BADGE_VARIANTS = [
  "default",
  "secondary",
  "muted",
  "accent",
  "outline",
  "highConfidence",
  "mediumConfidence",
  "lowConfidence",
] as const;

const BUTTON_VARIANTS = [
  "default",
  "outline",
  "secondary",
  "ghost",
  "destructive",
  "link",
] as const;

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [sleepTime, setSleepTime] = useState("22:45");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [morningEnergy, setMorningEnergy] = useState(7);
  const [afternoonEnergy, setAfternoonEnergy] = useState(6);
  const [eveningEnergy, setEveningEnergy] = useState(5);

  return (
    <div className="space-y-12 max-w-5xl mx-auto pb-16">
      <PageHeader
        title="Design System"
        description="A living reference of the foundation components and tokens the rest of Habit Lens is built from. Verify visual consistency here before extending the system elsewhere."
      />

      <Section title="Color Tokens" description="Semantic tokens defined in globals.css. Toggle the theme switcher in the top nav to verify both palettes.">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {COLOR_TOKENS.map((token) => (
            <div
              key={token.name}
              className={`rounded-xl p-4 text-xs font-mono font-medium ${token.className}`}
            >
              {token.name}
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typography" description="Headings and body text use the shared sans stack; numeric data uses the mono stack for scannability.">
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Page Title — text-2xl font-semibold
          </h1>
          <h2 className="text-lg font-semibold text-foreground">
            Section Title — text-lg font-semibold
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Body copy — text-sm text-muted-foreground. Used for descriptions and
            reflective explanatory text throughout the product.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Metadata / numeric — font-mono text-xs, used for timestamps, units, and stats.
          </p>
        </div>
      </Section>

      <Section title="Buttons">
        <div className="rounded-xl border border-border bg-card p-5 flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
      </Section>

      <Section title="Badges" description="Used for confidence indicators, tags, and status.">
        <div className="rounded-xl border border-border bg-card p-5 flex flex-wrap gap-2">
          {BADGE_VARIANTS.map((variant) => (
            <Badge key={variant} variant={variant}>
              {variant}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Form Fields">
        <div className="rounded-xl border border-border bg-card p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="Text input" />
          <Input type="number" placeholder="Numeric input" />
          <Textarea placeholder="Textarea for notes" className="sm:col-span-2" />
        </div>
      </Section>

      <Section title="Metric & Insight Cards">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard title="Avg Sleep" value={7.9} unit="hrs" icon={Moon} trend="+0.4" subtitle="vs last week" />
          <MetricCard title="Morning Energy" value={7.2} unit="/10" icon={Sun} />
          <MetricCard title="Streak" value={12} unit="days" icon={Flame} subtitle="logging streak" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {INITIAL_RULE_INSIGHTS.slice(0, 2).map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </div>
      </Section>

      <Section title="Sleep & Energy Input Cards">
        <div className="grid grid-cols-1 gap-4">
          <SleepCard
            sleepTime={sleepTime}
            wakeTime={wakeTime}
            onSleepTimeChange={setSleepTime}
            onWakeTimeChange={setWakeTime}
            calculatedDuration={8.25}
          />
          <EnergyCard
            morningEnergy={morningEnergy}
            afternoonEnergy={afternoonEnergy}
            eveningEnergy={eveningEnergy}
            onMorningChange={setMorningEnergy}
            onAfternoonChange={setAfternoonEnergy}
            onEveningChange={setEveningEnergy}
          />
        </div>
      </Section>

      <Section title="Trend Chart">
        <TrendChartCard
          title="Sleep Duration"
          description="Sample line chart rendered from mock log entries"
          entries={INITIAL_LOG_ENTRIES}
          series={[{ key: "sleepDuration", label: "Sleep", colorVar: "var(--chart-1)", unit: "hrs" }]}
          maxVal={12}
        />
      </Section>

      <Section title="Log Table">
        <LogTable logs={INITIAL_LOG_ENTRIES.slice(0, 4)} showFilters={false} />
      </Section>

      <Section title="Empty & Loading States">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EmptyState
            title="No entries yet"
            description="This is what a section looks like before any data has been logged."
            actionLabel="Log an Entry"
            actionHref="/logs/new"
          />
          <div className="rounded-xl border border-border bg-card p-5">
            <LoadingState rows={2} />
          </div>
        </div>
      </Section>

      <Section title="Icon Usage" description="lucide-react at 1.75 stroke weight inside a size-7 secondary chip, or size-4 inline with text.">
        <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
          <div className="flex size-7 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
            <Sparkles className="size-4" strokeWidth={1.75} />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            bg-secondary chip, size-7 container, size-4 icon
          </span>
        </div>
      </Section>
    </div>
  );
}
