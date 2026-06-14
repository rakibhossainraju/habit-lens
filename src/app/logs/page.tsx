"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const mockLogs = [
  {
    id: "1",
    date: "2026-06-15",
    sleepDuration: "7h 30m",
    morningEnergy: 7,
    afternoonEnergy: 6,
    eveningEnergy: 8,
    createdAt: "2026-06-15 08:12",
  },
  {
    id: "2",
    date: "2026-06-14",
    sleepDuration: "6h 45m",
    morningEnergy: 5,
    afternoonEnergy: 5,
    eveningEnergy: 7,
    createdAt: "2026-06-14 07:55",
  },
  {
    id: "3",
    date: "2026-06-13",
    sleepDuration: "8h 10m",
    morningEnergy: 8,
    afternoonEnergy: 7,
    eveningEnergy: 8,
    createdAt: "2026-06-13 09:03",
  },
  {
    id: "4",
    date: "2026-06-12",
    sleepDuration: "7h 00m",
    morningEnergy: 6,
    afternoonEnergy: 6,
    eveningEnergy: 6,
    createdAt: "2026-06-12 08:30",
  },
  {
    id: "5",
    date: "2026-06-11",
    sleepDuration: "6h 20m",
    morningEnergy: 4,
    afternoonEnergy: 5,
    eveningEnergy: 6,
    createdAt: "2026-06-11 08:01",
  },
  {
    id: "6",
    date: "2026-06-10",
    sleepDuration: "7h 45m",
    morningEnergy: 7,
    afternoonEnergy: 8,
    eveningEnergy: 9,
    createdAt: "2026-06-10 07:44",
  },
  {
    id: "7",
    date: "2026-06-09",
    sleepDuration: "8h 00m",
    morningEnergy: 8,
    afternoonEnergy: 7,
    eveningEnergy: 8,
    createdAt: "2026-06-09 08:20",
  },
  {
    id: "8",
    date: "2026-06-08",
    sleepDuration: "5h 50m",
    morningEnergy: 3,
    afternoonEnergy: 4,
    eveningEnergy: 5,
    createdAt: "2026-06-08 09:15",
  },
];

type SortField = "date" | "sleepDuration" | "morningEnergy" | "afternoonEnergy" | "eveningEnergy";
type SortDir = "asc" | "desc";

function EnergyDot({ value }: { value: number }) {
  const color =
    value >= 8
      ? "bg-emerald-500"
      : value >= 6
        ? "bg-primary"
        : value >= 4
          ? "bg-amber-400"
          : "bg-rose-400";
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("size-2 rounded-full", color)} />
      <span className="tabular-nums">{value}</span>
    </span>
  );
}

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  const filtered = mockLogs
    .filter((log) => log.date.includes(search))
    .sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      if (sortField === "date") return mul * a.date.localeCompare(b.date);
      if (sortField === "sleepDuration") return mul * a.sleepDuration.localeCompare(b.sleepDuration);
      return mul * ((a[sortField] as number) - (b[sortField] as number));
    });

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="size-3" />
    ) : (
      <ChevronDown className="size-3" />
    );
  }

  const thClass =
    "px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors";

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-4">
        <div>
          <PageTitle>Daily Logs</PageTitle>
          <PageDescription>Browse and manage your habit entries.</PageDescription>
        </div>
        <Button render={<Link href="/logs/new" />} size="sm">
          <Plus className="size-3.5" />
          New log
        </Button>
      </div>

      <SectionCard>
        {/* Search */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-input bg-background px-3 py-2 ring-offset-background focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by date (e.g. 2026-06)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No logs found"
            description="Try adjusting your search filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {(
                    [
                      { label: "Date", field: "date" },
                      { label: "Sleep", field: "sleepDuration" },
                      { label: "Morning", field: "morningEnergy" },
                      { label: "Afternoon", field: "afternoonEnergy" },
                      { label: "Evening", field: "eveningEnergy" },
                    ] as { label: string; field: SortField }[]
                  ).map(({ label, field }) => (
                    <th
                      key={field}
                      className={thClass}
                      onClick={() => handleSort(field)}
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        <SortIcon field={field} />
                      </span>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      <Link
                        href={`/logs/${log.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {log.date}
                      </Link>
                    </td>
                    <td className="px-4 py-3 tabular-nums text-foreground/80">
                      {log.sleepDuration}
                    </td>
                    <td className="px-4 py-3">
                      <EnergyDot value={log.morningEnergy} />
                    </td>
                    <td className="px-4 py-3">
                      <EnergyDot value={log.afternoonEnergy} />
                    </td>
                    <td className="px-4 py-3">
                      <EnergyDot value={log.eveningEnergy} />
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {log.createdAt}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon-xs" render={<Link href={`/logs/${log.id}`} />}>
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon-xs" className="text-destructive hover:text-destructive">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </PageContainer>
  );
}
