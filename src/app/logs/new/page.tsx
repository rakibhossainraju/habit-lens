"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Plus, Trash2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SleepCard } from "@/components/sleep-card";
import { EnergyCard } from "@/components/energy-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useStorage } from "@/lib/storage-context";
import { CustomField } from "@/lib/types";

export default function NewLogPage() {
  const router = useRouter();
  const { addLog } = useStorage();

  // `new Date()` isn't deterministic across server/client renders, so today's
  // date is resolved client-side only, after mount.
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(new Date().toISOString().split("T")[0]);
  }, []);
  const [sleepTime, setSleepTime] = useState<string>("22:30");
  const [wakeTime, setWakeTime] = useState<string>("06:30");
  const [morningEnergy, setMorningEnergy] = useState<number>(7);
  const [afternoonEnergy, setAfternoonEnergy] = useState<number>(7);
  const [eveningEnergy, setEveningEnergy] = useState<number>(6);
  const [notes, setNotes] = useState<string>("");
  const [customFields, setCustomFields] = useState<CustomField[]>([
    { key: "Exercise", value: "30 min Walk" },
    { key: "Water Intake", value: "2.0 L" },
  ]);

  const [submitted, setSubmitted] = useState(false);

  // Calculate sleep duration automatically
  const calculateDuration = (): number => {
    if (!sleepTime || !wakeTime) return 0;
    const [sH, sM] = sleepTime.split(":").map(Number);
    const [wH, wM] = wakeTime.split(":").map(Number);

    const start = sH * 60 + sM;
    let end = wH * 60 + wM;

    if (end <= start) {
      end += 24 * 60; // crossed midnight
    }

    const durationMinutes = end - start;
    return Number((durationMinutes / 60).toFixed(2));
  };

  const sleepDuration = calculateDuration();

  const handleAddCustomField = (presetKey?: string, presetValue?: string) => {
    setCustomFields([
      ...customFields,
      { key: presetKey || "", value: presetValue || "" },
    ]);
  };

  const handleRemoveCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const handleCustomFieldChange = (
    index: number,
    field: "key" | "value",
    val: string
  ) => {
    const updated = [...customFields];
    updated[index][field] = val;
    setCustomFields(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty custom fields
    const validCustomFields = customFields.filter(
      (cf) => cf.key.trim() !== "" || cf.value.trim() !== ""
    );

    addLog({
      date,
      sleepTime,
      wakeTime,
      sleepDuration,
      morningEnergy,
      afternoonEnergy,
      eveningEnergy,
      notes,
      customFields: validCustomFields,
    });

    setSubmitted(true);
    setTimeout(() => {
      router.push("/logs");
    }, 1000);
  };

  const presetSuggestions = [
    { key: "Exercise", value: "30 min Jog" },
    { key: "Water Intake", value: "2.5 L" },
    { key: "Breakfast", value: "Oatmeal" },
    { key: "Sugar Intake", value: "Low" },
    { key: "Coffee", value: "2 cups" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="New Log Entry"
        description="Record today's sleep window, diurnal energy ratings, and custom dynamic lifestyle variables."
      >
        <Link href="/logs">
          <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
            <ArrowLeft className="size-3.5" />
            <span>Back to Logs</span>
          </Button>
        </Link>
      </PageHeader>

      {submitted ? (
        <Card className="p-8 text-center bg-accent/40 border-primary/20">
          <CardContent className="flex flex-col items-center justify-center space-y-3">
            <CheckCircle2 className="size-10 text-primary animate-bounce" />
            <h3 className="text-lg font-semibold text-foreground">Entry Saved Successfully</h3>
            <p className="text-xs text-muted-foreground">Redirecting to daily logs...</p>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selector */}
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground block mb-1">
                  Log Entry Date
                </label>
                <div className="relative w-48">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="pl-9 font-mono text-sm"
                    required
                  />
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                <span className="font-mono">Habit Lens</span> values unhurried logging. Feel free to skip optional fields.
              </div>
            </div>
          </Card>

          {/* Sleep Section */}
          <SleepCard
            sleepTime={sleepTime}
            wakeTime={wakeTime}
            onSleepTimeChange={setSleepTime}
            onWakeTimeChange={setWakeTime}
            calculatedDuration={sleepDuration}
          />

          {/* Diurnal Energy Ratings */}
          <EnergyCard
            morningEnergy={morningEnergy}
            afternoonEnergy={afternoonEnergy}
            eveningEnergy={eveningEnergy}
            onMorningChange={setMorningEnergy}
            onAfternoonChange={setAfternoonEnergy}
            onEveningChange={setEveningEnergy}
          />

          {/* General Notes Section */}
          <Card>
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-base font-medium">Qualitative Notes</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Record open-ended reflections, context, or qualitative observations from your day
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2">
              <Textarea
                placeholder="e.g. Rested well. Afternoon felt quiet and focused after a walk in the sun..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[100px] text-sm"
              />
            </CardContent>
          </Card>

          {/* Custom Key-Value Fields Section */}
          <Card>
            <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-base font-medium">Custom Dynamic Fields</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Track custom lifestyle factors (e.g. Exercise, Meals, Hydration, Caffeine)
                </CardDescription>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddCustomField()}
                className="gap-1.5 text-xs"
              >
                <Plus className="size-3.5" />
                <span>Add Field</span>
              </Button>
            </CardHeader>

            <CardContent className="p-5 pt-2 space-y-4">
              {/* Preset suggestion chips */}
              <div className="flex flex-wrap items-center gap-1.5 pb-2">
                <span className="text-xs text-muted-foreground mr-1">Quick suggestions:</span>
                {presetSuggestions.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleAddCustomField(item.key, item.value)}
                    className="text-xs font-mono bg-secondary hover:bg-accent text-secondary-foreground px-2 py-0.5 rounded border border-border transition-colors"
                  >
                    + {item.key}
                  </button>
                ))}
              </div>

              {customFields.length === 0 ? (
                <p className="text-xs text-muted-foreground italic text-center py-4">
                  No custom fields added yet. Click &ldquo;Add Field&rdquo; or select a suggestion above.
                </p>
              ) : (
                <div className="space-y-3">
                  {customFields.map((field, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Input
                        type="text"
                        placeholder="Field Name (e.g. Exercise)"
                        value={field.key}
                        onChange={(e) =>
                          handleCustomFieldChange(idx, "key", e.target.value)
                        }
                        className="text-xs font-mono"
                      />
                      <Input
                        type="text"
                        placeholder="Value (e.g. 30 min Walk)"
                        value={field.value}
                        onChange={(e) =>
                          handleCustomFieldChange(idx, "value", e.target.value)
                        }
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleRemoveCustomField(idx)}
                        aria-label="Remove field"
                      >
                        <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Link href="/logs">
              <Button type="button" variant="ghost" size="sm">
                Cancel
              </Button>
            </Link>
            <Button type="submit" variant="default" size="sm" className="px-6 font-medium">
              Save Daily Entry
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
