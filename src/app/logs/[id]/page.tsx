"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Edit3, Trash2, Calendar, Moon, Sun, SunMedium, Sunset, Clock, Layers, Save, X } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useStorage } from "@/lib/storage-context";
import { EmptyState } from "@/components/empty-state";

export default function LogDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { getLogById, updateLog, deleteLog } = useStorage();

  const log = getLogById(id);

  const [isEditing, setIsEditing] = useState(false);

  // Form edit states
  const [editNotes, setEditNotes] = useState(log?.notes || "");
  const [editSleepTime, setEditSleepTime] = useState(log?.sleepTime || "");
  const [editWakeTime, setEditWakeTime] = useState(log?.wakeTime || "");
  const [editMorning, setEditMorning] = useState(log?.morningEnergy ?? 7);
  const [editAfternoon, setEditAfternoon] = useState(log?.afternoonEnergy ?? 7);
  const [editEvening, setEditEvening] = useState(log?.eveningEnergy ?? 6);

  if (!log) {
    return (
      <div className="space-y-6">
        <PageHeader title="Entry Not Found" description="The requested daily log could not be located.">
          <Link href="/logs">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="size-4" />
              <span>Back to Logs</span>
            </Button>
          </Link>
        </PageHeader>
        <EmptyState
          title="Entry missing or deleted"
          description="We couldn't find a daily log entry matching this ID."
          actionLabel="Return to Daily Logs"
          actionHref="/logs"
        />
      </div>
    );
  }

  const handleSaveEdit = () => {
    // Recalculate sleep duration
    let duration = log.sleepDuration;
    if (editSleepTime && editWakeTime) {
      const [sH, sM] = editSleepTime.split(":").map(Number);
      const [wH, wM] = editWakeTime.split(":").map(Number);
      let start = sH * 60 + sM;
      let end = wH * 60 + wM;
      if (end <= start) end += 24 * 60;
      duration = Number(((end - start) / 60).toFixed(2));
    }

    updateLog(log.id, {
      sleepTime: editSleepTime,
      wakeTime: editWakeTime,
      sleepDuration: duration,
      morningEnergy: editMorning,
      afternoonEnergy: editAfternoon,
      eveningEnergy: editEvening,
      notes: editNotes,
    });

    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteLog(log.id);
    router.push("/logs");
  };

  const formattedDate = new Date(log.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title={formattedDate}
        description={`Log Entry Metadata ID: ${log.id}`}
      >
        <div className="flex items-center gap-2">
          <Link href="/logs">
            <Button variant="outline" size="sm" className="gap-2 font-mono text-xs">
              <ArrowLeft className="size-3.5" />
              <span>Logs</span>
            </Button>
          </Link>

          {!isEditing ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="gap-2"
            >
              <Edit3 className="size-3.5" />
              <span>Edit Entry</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="gap-1 text-xs"
            >
              <X className="size-3.5" />
              <span>Cancel</span>
            </Button>
          )}

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            title="Delete entry"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </PageHeader>

      {isEditing ? (
        <Card className="p-6 space-y-6 border-primary/30">
          <div className="flex items-center justify-between border-b pb-3">
            <h3 className="text-base font-semibold">Editing Entry for {log.date}</h3>
            <Button variant="default" size="sm" onClick={handleSaveEdit} className="gap-1.5">
              <Save className="size-3.5" />
              <span>Save Changes</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Sleep Time</label>
              <Input
                type="time"
                value={editSleepTime}
                onChange={(e) => setEditSleepTime(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Wake Time</label>
              <Input
                type="time"
                value={editWakeTime}
                onChange={(e) => setEditWakeTime(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Morning Energy (0-10)</label>
              <Input
                type="number"
                min={0}
                max={10}
                value={editMorning}
                onChange={(e) => setEditMorning(Number(e.target.value))}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Afternoon Energy (0-10)</label>
              <Input
                type="number"
                min={0}
                max={10}
                value={editAfternoon}
                onChange={(e) => setEditAfternoon(Number(e.target.value))}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Evening Energy (0-10)</label>
              <Input
                type="number"
                min={0}
                max={10}
                value={editEvening}
                onChange={(e) => setEditEvening(Number(e.target.value))}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Notes</label>
            <Textarea
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="text-xs min-h-[80px]"
            />
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Sleep Summary Card */}
            <Card>
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="size-4 text-primary" />
                  <CardTitle className="text-base font-medium">Sleep Window</CardTitle>
                </div>
                <span className="font-mono text-xl font-semibold text-foreground">
                  {log.sleepDuration} <span className="text-xs text-muted-foreground font-normal">hrs</span>
                </span>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>Bedtime: <strong className="text-foreground">{log.sleepTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    <span>Wake: <strong className="text-foreground">{log.wakeTime}</strong></span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Energy Breakdown */}
            <Card>
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base font-medium">Diurnal Energy Ratings</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-2 grid grid-cols-3 gap-4 text-center">
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <Sun className="size-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground block font-medium">Morning</span>
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {log.morningEnergy}/10
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <SunMedium className="size-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground block font-medium">Afternoon</span>
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {log.afternoonEnergy}/10
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <Sunset className="size-4 mx-auto mb-1 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground block font-medium">Evening</span>
                  <span className="font-mono text-lg font-semibold text-foreground">
                    {log.eveningEnergy}/10
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Qualitative Notes */}
            <Card>
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base font-medium">Qualitative Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-1">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {log.notes || "No notes entered for this daily log."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Column: Custom Fields & Metadata */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-1.5">
                  <Layers className="size-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">Custom Fields</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 space-y-2">
                {(log.customFields || []).length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No custom fields recorded.</p>
                ) : (
                  (log.customFields || []).map((cf) => (
                    <div
                      key={cf.key}
                      className="flex items-center justify-between p-2 rounded bg-muted/40 border border-border text-xs font-mono"
                    >
                      <span className="text-muted-foreground">{cf.key}</span>
                      <span className="font-medium text-foreground">{cf.value}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="p-5 text-xs font-mono space-y-2 text-muted-foreground border-dashed">
              <div className="flex justify-between">
                <span>Created At:</span>
                <span className="text-foreground">
                  {new Date(log.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Entry Date:</span>
                <span className="text-foreground">{log.date}</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
