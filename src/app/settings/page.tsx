"use client";

import { useState } from "react";
import { Download, Check } from "lucide-react";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { Button } from "@/components/ui/button";

const inputClass =
  "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 first:pt-0 last:pb-0">
      <div className="flex flex-col gap-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        checked ? "bg-primary" : "bg-muted"
      }`}
    >
      <span
        className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const trackedMetrics = [
  { id: "sleep", label: "Sleep", description: "Bedtime and wake time" },
  { id: "morning", label: "Morning Energy", description: "0–10 score" },
  { id: "afternoon", label: "Afternoon Energy", description: "0–10 score" },
  { id: "evening", label: "Evening Energy", description: "0–10 score" },
  { id: "notes", label: "Daily Notes", description: "Free text field" },
];

export default function SettingsPage() {
  const [displayName, setDisplayName] = useState("Rakib");
  const [email] = useState("rakibhossianraju@gmail.com");
  const [weekStart, setWeekStart] = useState<"monday" | "sunday">("monday");
  const [notifications, setNotifications] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [enabledMetrics, setEnabledMetrics] = useState<Record<string, boolean>>(
    Object.fromEntries(trackedMetrics.map((m) => [m.id, true]))
  );
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function toggleMetric(id: string) {
    setEnabledMetrics((m) => ({ ...m, [id]: !m[id] }));
  }

  return (
    <PageContainer>
      <div className="flex items-start justify-between gap-4">
        <div>
          <PageTitle>Settings</PageTitle>
          <PageDescription>Manage your profile, appearance, and tracker configuration.</PageDescription>
        </div>
        <Button size="sm" onClick={handleSave}>
          {saved ? (
            <>
              <Check className="size-3.5" /> Saved
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Profile */}
        <SectionCard
          title="Profile"
          description="Your personal details."
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Display name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className={`${inputClass} cursor-not-allowed opacity-60`}
              />
              <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
          </div>
        </SectionCard>

        {/* Appearance */}
        <SectionCard
          title="Appearance"
          description="Customize the look and feel of the app."
        >
          <div className="divide-y divide-border">
            <SettingRow
              label="Week starts on"
              description="Affects weekly summaries and trend views."
            >
              <div className="flex rounded-xl border border-input overflow-hidden text-sm">
                {(["monday", "sunday"] as const).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setWeekStart(day)}
                    className={`px-3 py-1.5 capitalize transition-colors ${
                      weekStart === day
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-muted"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </SettingRow>
            <SettingRow
              label="Compact mode"
              description="Reduce card padding and spacing for denser layouts."
            >
              <Toggle checked={compactMode} onChange={() => setCompactMode((v) => !v)} />
            </SettingRow>
            <SettingRow
              label="Daily log reminders"
              description="Receive a daily nudge to complete your log."
            >
              <Toggle
                checked={notifications}
                onChange={() => setNotifications((v) => !v)}
              />
            </SettingRow>
          </div>
        </SectionCard>

        {/* Tracker Configuration */}
        <SectionCard
          title="Tracker Configuration"
          description="Choose which fields appear when creating a new log."
        >
          <div className="divide-y divide-border">
            {trackedMetrics.map((metric) => (
              <SettingRow
                key={metric.id}
                label={metric.label}
                description={metric.description}
              >
                <Toggle
                  checked={enabledMetrics[metric.id]}
                  onChange={() => toggleMetric(metric.id)}
                />
              </SettingRow>
            ))}
          </div>
        </SectionCard>

        {/* Data Export */}
        <SectionCard
          title="Data Export"
          description="Download a copy of all your logged data."
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Export all 24 entries as a CSV or JSON file. Your data belongs to you.
            </p>
            <div className="flex gap-2 shrink-0">
              <Button variant="outline" size="sm">
                <Download className="size-3.5" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <Download className="size-3.5" />
                Export JSON
              </Button>
            </div>
          </div>
        </SectionCard>
      </div>
    </PageContainer>
  );
}
