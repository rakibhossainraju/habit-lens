import { ArrowLeft, Pencil, BedDouble, Clock } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { StatCard } from "@/components/cards/stat-card";
import { Button } from "@/components/ui/button";

const mockDetail = {
  date: "2026-06-15",
  sleepTime: "11:30 PM",
  wakeTime: "7:00 AM",
  sleepDuration: "7h 30m",
  morningEnergy: 7,
  afternoonEnergy: 6,
  eveningEnergy: 8,
  notes:
    "Felt fairly well-rested. Had a productive morning but energy dipped after lunch. Evening was great after a short walk.",
  customFields: [
    { key: "Breakfast", value: "Oats + banana" },
    { key: "Exercise", value: "30 min walk, evening" },
    { key: "Water intake", value: "2.1 L" },
    { key: "Sugar intake", value: "Low" },
  ],
  createdAt: "2026-06-15 08:12",
};

function EnergyBar({ value, label }: { value: number; label: string }) {
  const color =
    value >= 8
      ? "bg-emerald-500"
      : value >= 6
        ? "bg-primary"
        : value >= 4
          ? "bg-amber-400"
          : "bg-rose-400";
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums">{value}/10</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${(value / 10) * 100}%` }}
        />
      </div>
    </div>
  );
}

export default async function LogDetailPage({ params }: PageProps<"/logs/[id]">) {
  const { id } = await params;

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/logs" />} className="-ml-1 mt-1">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <PageTitle>{mockDetail.date}</PageTitle>
          <PageDescription>
            Created at {mockDetail.createdAt} · Entry #{id}
          </PageDescription>
        </div>
        <Button variant="outline" size="sm" render={<Link href={`/logs/${id}/edit`} />}>
          <Pencil className="size-3.5" />
          Edit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sleep Duration" value={mockDetail.sleepDuration} icon={BedDouble} />
        <StatCard label="Bedtime" value={mockDetail.sleepTime} icon={Clock} />
        <StatCard label="Wake Time" value={mockDetail.wakeTime} icon={Clock} />
      </div>

      {/* Energy */}
      <SectionCard title="Energy Levels" description="Reported energy across the day.">
        <div className="flex flex-col gap-5">
          <EnergyBar value={mockDetail.morningEnergy} label="Morning" />
          <EnergyBar value={mockDetail.afternoonEnergy} label="Afternoon" />
          <EnergyBar value={mockDetail.eveningEnergy} label="Evening" />
        </div>
      </SectionCard>

      {/* Notes */}
      {mockDetail.notes && (
        <SectionCard title="Notes">
          <p className="text-sm leading-relaxed text-foreground/80">{mockDetail.notes}</p>
        </SectionCard>
      )}

      {/* Custom Fields */}
      {mockDetail.customFields.length > 0 && (
        <SectionCard title="Custom Fields" description="Additional tracked metrics for this entry.">
          <div className="grid gap-3 sm:grid-cols-2">
            {mockDetail.customFields.map((field) => (
              <div
                key={field.key}
                className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3"
              >
                <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {field.key}
                </span>
                <span className="text-sm text-foreground">{field.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </PageContainer>
  );
}
