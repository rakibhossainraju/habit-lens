"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm text-foreground">{label}</label>
        <span className="text-sm tabular-nums text-muted-foreground">{value}/10</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </div>
  );
}

const inputClass =
  "w-full rounded border border-input bg-background px-3 py-1.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring";

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
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Link href="/logs" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
        </Link>
        <h1 className="text-lg font-medium">New Log</h1>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Sleep */}
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Sleep</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">Sleep time</label>
              <input
                type="time"
                value={sleepTime}
                onChange={(e) => setSleepTime(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-foreground">Wake time</label>
              <input
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        <hr className="border-border" />

        {/* Energy */}
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Energy (0–10)</h2>
          <div className="flex flex-col gap-4">
            <EnergySlider label="Morning" value={morningEnergy} onChange={setMorningEnergy} />
            <EnergySlider label="Afternoon" value={afternoonEnergy} onChange={setAfternoonEnergy} />
            <EnergySlider label="Evening" value={eveningEnergy} onChange={setEveningEnergy} />
          </div>
        </section>

        <hr className="border-border" />

        {/* Notes */}
        <section>
          <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-muted-foreground">Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Food, exercise, mood, context..."
            rows={4}
            className={`${inputClass} resize-none`}
          />
        </section>

        <hr className="border-border" />

        {/* Custom Fields */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Custom Fields</h2>
            <button
              type="button"
              onClick={addField}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <Plus className="size-3.5" />
              Add field
            </button>
          </div>
          {customFields.length === 0 ? (
            <p className="text-sm text-muted-foreground">No custom fields yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {customFields.map((field) => (
                <div key={field.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={field.key}
                    onChange={(e) => updateField(field.id, "key", e.target.value)}
                    className={`${inputClass} flex-1`}
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) => updateField(field.id, "value", e.target.value)}
                    className={`${inputClass} flex-[2]`}
                  />
                  <button
                    type="button"
                    onClick={() => removeField(field.id)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Link
            href="/logs"
            className="rounded border border-input px-4 py-1.5 text-sm text-muted-foreground hover:bg-muted"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded bg-primary px-4 py-1.5 text-sm text-primary-foreground hover:opacity-90"
          >
            Save log
          </button>
        </div>
      </form>
    </div>
  );
}
