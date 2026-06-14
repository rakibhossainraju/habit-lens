"use client";

import {
  Moon,
  Sun,
  BookOpen,
  BedDouble,
  Zap,
  TrendingUp,
  AlertCircle,
  BarChart2,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTitle } from "@/components/typography/page-title";
import { SectionTitle } from "@/components/typography/section-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";

function DemoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <SectionTitle className="shrink-0 text-muted-foreground">{title}</SectionTitle>
        <Separator className="flex-1" />
      </div>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <PageTitle>Design System</PageTitle>
          <PageDescription>
            Foundation components for Habit Lens — verify visual consistency across light and dark themes.
          </PageDescription>
        </div>
        <Button variant="outline" size="sm" onClick={toggleTheme} className="shrink-0">
          {isDark ? (
            <>
              <Sun className="size-3.5" /> Light mode
            </>
          ) : (
            <>
              <Moon className="size-3.5" /> Dark mode
            </>
          )}
        </Button>
      </div>

      {/* Typography */}
      <DemoSection title="Typography">
        <div className="flex flex-col gap-3 rounded-4xl bg-card p-6 shadow-md ring-1 ring-foreground/5">
          <PageTitle>Page Title — Instrument Serif</PageTitle>
          <SectionTitle>Section Title — tracking tight</SectionTitle>
          <PageDescription>
            Page description using muted foreground. Used for context beneath page and section headings to orient the reader without overwhelming primary content.
          </PageDescription>
          <p className="text-sm text-foreground">
            Body text in Geist Sans. Clear, technical, readable at small sizes.
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
            Label / Overline — xs + widest tracking
          </p>
        </div>
      </DemoSection>

      {/* Stat Cards */}
      <DemoSection title="Stat Cards">
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
            label="Afternoon Energy"
            value="5.1"
            icon={BarChart2}
            trend="down"
            trendValue="-0.9"
            subtext="vs last week"
          />
        </div>
      </DemoSection>

      {/* Section Cards */}
      <DemoSection title="Section Cards">
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="Sleep Summary"
            description="Your average bedtime and wake time this week."
          >
            <div className="flex flex-col gap-3">
              {[
                { day: "Monday", sleep: "11:30 PM", wake: "7:15 AM", duration: "7h 45m" },
                { day: "Tuesday", sleep: "12:00 AM", wake: "7:30 AM", duration: "7h 30m" },
                { day: "Wednesday", sleep: "11:00 PM", wake: "6:45 AM", duration: "7h 45m" },
              ].map((entry) => (
                <div key={entry.day} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{entry.day}</span>
                  <span className="font-medium tabular-nums">{entry.duration}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Insights"
            description="Rule-based observations from the past 7 days."
            action={
              <Button variant="ghost" size="icon-xs">
                <TrendingUp className="size-3.5" />
              </Button>
            }
          >
            <div className="flex flex-col gap-3">
              {[
                { text: "Better afternoon energy on days with 7h+ sleep", positive: true },
                { text: "Energy dips observed after late bedtimes", positive: false },
                { text: "Morning energy is most consistent on weekdays", positive: true },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm">
                  <div
                    className={`mt-0.5 size-1.5 shrink-0 rounded-full ${
                      insight.positive ? "bg-primary" : "bg-rose-400"
                    }`}
                  />
                  <span className="text-foreground/80 leading-snug">{insight.text}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </DemoSection>

      {/* Feedback States */}
      <DemoSection title="Feedback States">
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard title="Empty State">
            <EmptyState
              icon={BookOpen}
              title="No logs yet"
              description="Start tracking your daily habits to see patterns emerge over time."
              action={
                <Button size="sm">
                  <Plus className="size-3.5" />
                  Add first log
                </Button>
              }
            />
          </SectionCard>

          <SectionCard title="Error State">
            <EmptyState
              icon={AlertCircle}
              title="Something went wrong"
              description="We couldn't load your data. Please try again."
              action={
                <Button variant="outline" size="sm">
                  Retry
                </Button>
              }
            />
          </SectionCard>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard title="Loading — Cards" size="sm">
            <LoadingState variant="cards" className="grid-cols-1!" />
          </SectionCard>
          <SectionCard title="Loading — List" size="sm">
            <LoadingState variant="list" />
          </SectionCard>
          <SectionCard title="Loading — Detail" size="sm">
            <LoadingState variant="detail" />
          </SectionCard>
        </div>
      </DemoSection>

      {/* Color Palette */}
      <DemoSection title="Color Tokens">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Primary", bg: "bg-primary", text: "text-primary-foreground" },
            { label: "Secondary", bg: "bg-secondary", text: "text-secondary-foreground" },
            { label: "Accent", bg: "bg-accent", text: "text-accent-foreground" },
            { label: "Muted", bg: "bg-muted", text: "text-muted-foreground" },
            { label: "Card", bg: "bg-card", text: "text-card-foreground border border-border" },
            { label: "Background", bg: "bg-background", text: "text-foreground border border-border" },
            { label: "Destructive", bg: "bg-destructive/15", text: "text-destructive" },
            { label: "Sidebar", bg: "bg-sidebar", text: "text-sidebar-foreground border border-sidebar-border" },
          ].map((swatch) => (
            <div
              key={swatch.label}
              className={`${swatch.bg} ${swatch.text} flex h-16 items-end rounded-2xl px-3 pb-2`}
            >
              <span className="text-xs font-medium">{swatch.label}</span>
            </div>
          ))}
        </div>
      </DemoSection>

      {/* Buttons */}
      <DemoSection title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="sm">Small</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
        </div>
      </DemoSection>
    </PageContainer>
  );
}
