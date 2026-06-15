import { BedDouble, Zap, TrendingUp } from "lucide-react";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";

const sleepData = [
  { date: "Jun 9", duration: 8.0, bed: 23.0, wake: 7.0 },
  { date: "Jun 10", duration: 7.75, bed: 23.25, wake: 7.0 },
  { date: "Jun 11", duration: 6.33, bed: 0.5, wake: 6.83 },
  { date: "Jun 12", duration: 7.0, bed: 23.5, wake: 6.5 },
  { date: "Jun 13", duration: 8.17, bed: 22.75, wake: 6.92 },
  { date: "Jun 14", duration: 6.75, bed: 0.0, wake: 6.75 },
  { date: "Jun 15", duration: 7.5, bed: 23.5, wake: 7.0 },
];

const energyData = [
  { date: "Jun 9", morning: 8, afternoon: 7, evening: 8 },
  { date: "Jun 10", morning: 7, afternoon: 8, evening: 9 },
  { date: "Jun 11", morning: 4, afternoon: 5, evening: 6 },
  { date: "Jun 12", morning: 6, afternoon: 6, evening: 6 },
  { date: "Jun 13", morning: 8, afternoon: 7, evening: 8 },
  { date: "Jun 14", morning: 5, afternoon: 5, evening: 7 },
  { date: "Jun 15", morning: 7, afternoon: 6, evening: 8 },
];

const correlations = [
  {
    a: "Sleep Duration",
    b: "Morning Energy",
    r: 0.82,
    description:
      "Strong positive — longer sleep strongly predicts higher morning energy.",
    direction: "positive" as const,
  },
  {
    a: "Exercise",
    b: "Afternoon Energy",
    r: 0.74,
    description:
      "Strong positive — days with any exercise show higher afternoon energy.",
    direction: "positive" as const,
  },
  {
    a: "Sugar Intake",
    b: "Evening Energy",
    r: -0.51,
    description:
      "Moderate negative — higher sugar intake mildly predicts lower evening energy.",
    direction: "negative" as const,
  },
];

function MiniBarChart({
  data,
  max,
  color,
  label,
}: {
  data: { date: string; value: number }[];
  max: number;
  color: string;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <p className="text-xs text-muted-foreground">{label}</p>}
      <div className="flex h-24 items-end gap-1.5">
        {data.map((d) => (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-sm bg-gray-200"
              style={{
                height: `${(d.value / max) * 88}px`,
                // backgroundColor: color,
              }}
            />
            <span className="text-[9px] text-muted-foreground">
              {d.date.slice(-2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CorrelationCard({ corr }: { corr: (typeof correlations)[0] }) {
  const abs = Math.abs(corr.r);
  const isPositive = corr.direction === "positive";
  const barColor = isPositive ? "bg-primary" : "bg-rose-400";
  // const rColor = isPositive
  //   ? "text-emerald-600 dark:text-emerald-400"
  //   : "text-rose-500 dark:text-rose-400";
  const rColor = "text-gray-600 dark:text-gray-400";

  return (
    <div className="flex flex-col gap-3 rounded-3xl bg-card p-5 shadow-md ring-1 ring-foreground/5">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{corr.a}</span>
          <span className="text-muted-foreground">→</span>
          <span className="font-medium text-foreground">{corr.b}</span>
        </div>
        <span className={`font-heading text-lg ${rColor}`}>
          {corr.r > 0 ? "+" : ""}
          {corr.r.toFixed(2)}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${abs * 100}%` }}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {corr.description}
      </p>
    </div>
  );
}

export default function AnalyticsPage() {
  const avgSleep = (
    sleepData.reduce((s, d) => s + d.duration, 0) / sleepData.length
  ).toFixed(1);

  const avgMorning = (
    energyData.reduce((s, d) => s + d.morning, 0) / energyData.length
  ).toFixed(1);

  return (
    <PageContainer>
      <div>
        <PageTitle>Analytics</PageTitle>
        <PageDescription>
          Visualized trends from the past 7 days of logged data.
        </PageDescription>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Avg Sleep"
          value={`${avgSleep}h`}
          icon={BedDouble}
          trend="up"
          trendValue="+0.4h"
          subtext="vs prior week"
        />
        <StatCard
          label="Avg Morning Energy"
          value={avgMorning}
          icon={Zap}
          trend="up"
          trendValue="+0.6"
        />
        <StatCard
          label="Best Sleep Night"
          value="Jun 13"
          icon={TrendingUp}
          subtext="8h 10m"
        />
      </div>

      {/* Sleep Trends */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Sleep Trends
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <SectionCard
            title="Sleep Duration"
            description="Hours slept per night over 7 days."
          >
            <MiniBarChart
              data={sleepData.map((d) => ({ date: d.date, value: d.duration }))}
              max={10}
              color="oklch(0.45 0.12 160)"
            />
            <div className="mt-3 flex justify-between border-t pt-3 text-xs text-muted-foreground">
              <span>Min: 6.3h</span>
              <span>Avg: {avgSleep}h</span>
              <span>Max: 8.2h</span>
            </div>
          </SectionCard>

          <SectionCard
            title="Bedtime Consistency"
            description="How close to your average 11:30 PM bedtime."
          >
            <div className="flex h-24 items-center gap-1.5">
              {sleepData.map((d) => {
                const deviation = Math.abs(d.bed - 23.5);
                const normalised = Math.min(deviation / 2, 1);
                return (
                  <div
                    key={d.date}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-sm bg-gray-200"
                      style={{
                        height: `${normalised * 80 + 8}px`,
                        // backgroundColor: `oklch(${0.62 - normalised * 0.2} 0.12 ${160 + normalised * 10})`,
                      }}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {d.date.slice(-2)}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
              Shorter bar = closer to your average bedtime. Lower deviation =
              better consistency.
            </p>
          </SectionCard>
        </div>
      </div>

      {/* Energy Trends */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Energy Trends
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SectionCard title="Morning Energy" size="sm">
            <MiniBarChart
              data={energyData.map((d) => ({ date: d.date, value: d.morning }))}
              max={10}
              color="oklch(0.62 0.12 162)"
            />
          </SectionCard>
          <SectionCard title="Afternoon Energy" size="sm">
            <MiniBarChart
              data={energyData.map((d) => ({
                date: d.date,
                value: d.afternoon,
              }))}
              max={10}
              color="oklch(0.54 0.12 160)"
            />
          </SectionCard>
          <SectionCard title="Evening Energy" size="sm">
            <MiniBarChart
              data={energyData.map((d) => ({ date: d.date, value: d.evening }))}
              max={10}
              color="oklch(0.46 0.11 158)"
            />
          </SectionCard>
        </div>

        {/* Stacked view */}
        <SectionCard
          title="Energy Overview"
          description="Morning, afternoon, and evening stacked by day."
        >
          <div className="flex h-36 items-end gap-2">
            {energyData.map((d) => (
              <div
                key={d.date}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <div className="flex w-full flex-col gap-0.5">
                  {[
                    { val: d.morning, color: "oklch(0.62 0.12 162)" },
                    { val: d.afternoon, color: "oklch(0.54 0.12 160)" },
                    { val: d.evening, color: "oklch(0.46 0.11 158)" },
                  ].map(({ val, color }, i) => (
                    <div
                      key={i}
                      className="w-full rounded-sm bg-gray-200"
                      style={{
                        height: `${(val / 10) * 38}px`,
                        // backgroundColor: color,
                      }}
                    />
                  ))}
                </div>
                <span className="text-[9px] text-muted-foreground">
                  {d.date.slice(-2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 border-t pt-3">
            {["Morning", "Afternoon", "Evening"].map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <div
                  className="size-2 rounded-full"
                  style={{
                    backgroundColor: `oklch(${0.62 - i * 0.08} 0.12 ${162 - i * 2})`,
                  }}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Correlations */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Correlations
          </p>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {correlations.map((corr) => (
            <CorrelationCard key={corr.a + corr.b} corr={corr} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}
