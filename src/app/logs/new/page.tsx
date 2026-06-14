"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/typography/page-title";
import { PageDescription } from "@/components/typography/page-description";
import { PageContainer } from "@/components/layout/page-container";
import { SectionCard } from "@/components/cards/section-card";
import { Button } from "@/components/ui/button";

interface CustomField {
  id: string;
  key: string;
  value: string;
}

function EnergySlider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  const color =
    value >= 8
      ? "text-emerald-600"
      : value >= 6
        ? "text-primary"
        : value >= 4
          ? "text-amber-500"
          : "text-rose-500";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className={`text-sm font-medium tabular-nums ${color}`}>{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "flex h-9 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

const textareaClass =
  "flex min-h-24 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none";

export default function NewLogPage() {
  const router = useRouter();

  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [morningEnergy, setMorningEnergy] = useState(5);
  const [afternoonEnergy, setAfternoonEnergy] = useState(5);
  const [eveningEnergy, setEveningEnergy] = useState(5);
  const [notes, setNotes] = useState("");
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  function addField() {
    setCustomFields((f) => [
      ...f,
      { id: crypto.randomUUID(), key: "", value: "" },
    ]);
  }

  function removeField(id: string) {
    setCustomFields((f) => f.filter((cf) => cf.id !== id));
  }

  function updateField(id: string, prop: "key" | "value", val: string) {
    setCustomFields((f) =>
      f.map((cf) => (cf.id === id ? { ...cf, [prop]: val } : cf))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/logs");
  }

  return (
    <PageContainer>
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="icon-sm" render={<Link href="/logs" />} className="-ml-1 mt-1">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <PageTitle>New Log</PageTitle>
          <PageDescription>Record your habits and energy levels for today.</PageDescription>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Sleep */}
        <SectionCard
          title="Sleep"
          description="When did you fall asleep and wake up?"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Sleep time">
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className={inputClass}
              />
            </FormField>
            <FormField label="Wake time">
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className={inputClass}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Energy */}
        <SectionCard
          title="Energy"
          description="Rate your energy levels throughout the day from 0 to 10."
        >
          <div className="flex flex-col gap-6">
            <EnergySlider
              label="Morning energy"
              value={morningEnergy}
              onChange={setMorningEnergy}
            />
            <EnergySlider
              label="Afternoon energy"
              value={afternoonEnergy}
              onChange={setAfternoonEnergy}
            />
            <EnergySlider
              label="Evening energy"
              value={eveningEnergy}
              onChange={setEveningEnergy}
            />
          </div>
        </SectionCard>

        {/* Notes */}
        <SectionCard title="Notes" description="Anything worth remembering about today?">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional notes — food, exercise, mood, context..."
            className={textareaClass}
          />
        </SectionCard>

        {/* Custom Fields */}
        <SectionCard
          title="Custom Fields"
          description="Track anything else that matters to you."
          action={
            <Button type="button" variant="outline" size="sm" onClick={addField}>
              <Plus className="size-3.5" />
              Add field
            </Button>
          }
        >
          {customFields.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No custom fields yet. Add one to track things like meals, exercise, or water intake.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Field name (e.g. Exercise)"
                    value={field.key}
                    onChange={(e) => updateField(field.id, "key", e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 30 min run)"
                    value={field.value}
                    onChange={(e) =>
                      updateField(field.id, "value", e.target.value)
                    }
                    className={`${inputClass} flex-[2]`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeField(field.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" render={<Link href="/logs" />}>
            Cancel
          </Button>
          <Button type="submit">Save log</Button>
        </div>
      </form>
    </PageContainer>
  );
}
