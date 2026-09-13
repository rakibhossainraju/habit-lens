"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogEntry, RuleInsight, MetricSummary } from "./types";
import { INITIAL_LOG_ENTRIES } from "./mock-data";
import { api } from "./api";

interface StorageContextType {
  logs: LogEntry[];
  insights: RuleInsight[];
  addLog: (entry: Omit<LogEntry, "id" | "createdAt">) => LogEntry;
  updateLog: (id: string, entry: Partial<LogEntry>) => void;
  deleteLog: (id: string) => void;
  resetToDefault: () => void;
  clearAllLogs: () => void;
  getLogById: (id: string) => LogEntry | undefined;
  metrics: MetricSummary;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

function computeRuleInsights(logs: LogEntry[]): RuleInsight[] {
  if (logs.length === 0) return [];

  const list: RuleInsight[] = [];

  // Rule 1: Sleep Duration vs Energy Pattern
  const goodSleepLogs = logs.filter((l) => l.sleepDuration >= 7.5);
  const shortSleepLogs = logs.filter((l) => l.sleepDuration < 7.5);

  if (goodSleepLogs.length > 0 && shortSleepLogs.length > 0) {
    const avgGoodMorning =
      goodSleepLogs.reduce((acc, l) => acc + l.morningEnergy, 0) / goodSleepLogs.length;
    const avgShortMorning =
      shortSleepLogs.reduce((acc, l) => acc + l.morningEnergy, 0) / shortSleepLogs.length;
    const diff = avgGoodMorning - avgShortMorning;

    if (Math.abs(diff) >= 0.5) {
      list.push({
        id: "insight-sleep-energy",
        title:
          diff > 0
            ? "Higher morning energy on 7.5h+ sleep nights"
            : "Consistent morning readiness across sleep windows",
        description: `Morning energy ratings average ${avgGoodMorning.toFixed(1)}/10 after 7.5h+ of sleep, compared to ${avgShortMorning.toFixed(1)}/10 on shorter sleep nights.`,
        confidence: logs.length >= 7 ? "High" : logs.length >= 3 ? "Medium" : "Low",
        logsAnalyzed: logs.length,
        relatedMetric: "Sleep & Diurnal Energy",
      });
    }
  }

  // Rule 2: Sleep Window Consistency Observation
  if (logs.length >= 3) {
    const consistentLogs = logs.filter(
      (l) => l.sleepDuration >= 7.5 && l.sleepDuration <= 9.0
    ).length;
    const consistencyPct = Math.round((consistentLogs / logs.length) * 100);

    list.push({
      id: "insight-sleep-consistency",
      title: "Sleep window consistency observation",
      description: `${consistencyPct}% of your recorded logs maintain a balanced 7.5h–9.0h duration window.`,
      confidence: logs.length >= 6 ? "High" : "Medium",
      logsAnalyzed: logs.length,
      relatedMetric: "Sleep Consistency",
    });
  }

  // Rule 3: Movement & Activity Pattern (if custom fields recorded)
  const exerciseLogs = logs.filter((l) =>
    (l.customFields || []).some(
      (cf) =>
        cf.key.toLowerCase().includes("exercise") ||
        cf.key.toLowerCase().includes("walk") ||
        cf.key.toLowerCase().includes("run") ||
        cf.key.toLowerCase().includes("gym") ||
        cf.key.toLowerCase().includes("yoga")
    )
  );
  const restLogs = logs.filter(
    (l) =>
      !(l.customFields || []).some(
        (cf) =>
          cf.key.toLowerCase().includes("exercise") ||
          cf.key.toLowerCase().includes("walk") ||
          cf.key.toLowerCase().includes("run") ||
          cf.key.toLowerCase().includes("gym") ||
          cf.key.toLowerCase().includes("yoga")
      )
  );

  if (exerciseLogs.length > 0 && restLogs.length > 0) {
    const avgExAfternoon =
      exerciseLogs.reduce((acc, l) => acc + l.afternoonEnergy, 0) / exerciseLogs.length;
    const avgRestAfternoon =
      restLogs.reduce((acc, l) => acc + l.afternoonEnergy, 0) / restLogs.length;

    list.push({
      id: "insight-exercise-energy",
      title: "Afternoon stamina on active days",
      description: `Afternoon energy averages ${avgExAfternoon.toFixed(1)}/10 on days with movement recorded, compared to ${avgRestAfternoon.toFixed(1)}/10 on rest days.`,
      confidence: exerciseLogs.length >= 3 ? "High" : "Medium",
      logsAnalyzed: logs.length,
      relatedMetric: "Exercise & Energy",
    });
  }

  // Rule 4: Diurnal Rhythm
  if (logs.length >= 2) {
    const avgMorning = logs.reduce((acc, l) => acc + l.morningEnergy, 0) / logs.length;
    const avgAfternoon = logs.reduce((acc, l) => acc + l.afternoonEnergy, 0) / logs.length;
    const avgEvening = logs.reduce((acc, l) => acc + l.eveningEnergy, 0) / logs.length;

    list.push({
      id: "insight-diurnal-rhythm",
      title: "Diurnal energy rhythm",
      description: `Observed daily rhythm: Morning (${avgMorning.toFixed(1)}/10), Midday (${avgAfternoon.toFixed(1)}/10), Evening (${avgEvening.toFixed(1)}/10).`,
      confidence: logs.length >= 5 ? "High" : "Medium",
      logsAnalyzed: logs.length,
      relatedMetric: "Diurnal Energy",
    });
  }

  return list;
}

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_ENTRIES);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem("habit-lens-logs");
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        if (Array.isArray(parsed)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setLogs(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to load stored logs:", e);
    }
  }, []);

  const saveLogs = (newLogs: LogEntry[]) => {
    setLogs(newLogs);
    try {
      if (newLogs.length === 0) {
        localStorage.removeItem("habit-lens-logs");
      } else {
        localStorage.setItem("habit-lens-logs", JSON.stringify(newLogs));
      }
    } catch (e) {
      console.error("Failed to save logs to localStorage:", e);
    }
  };

  const addLog = (entry: Omit<LogEntry, "id" | "createdAt">): LogEntry => {
    const newEntry: LogEntry = {
      ...entry,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newEntry, ...logs];
    // Sort by date descending
    updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    saveLogs(updated);
    return newEntry;
  };

  const updateLog = (id: string, updatedFields: Partial<LogEntry>) => {
    const updated = logs.map((log) =>
      log.id === id ? { ...log, ...updatedFields } : log
    );
    saveLogs(updated);
  };

  const deleteLog = (id: string) => {
    const updated = logs.filter((log) => log.id !== id);
    saveLogs(updated);
  };

  const resetToDefault = () => {
    saveLogs(api.getInitialLogs());
  };

  const clearAllLogs = () => {
    saveLogs([]);
  };

  const getLogById = (id: string) => {
    return logs.find((l) => l.id === id);
  };

  // Derive rule insights dynamically from actual recorded logs or fall back to mock observations
  const insights = React.useMemo(() => {
    if (logs.length === 0) return [];
    const dynamic = computeRuleInsights(logs);
    if (dynamic.length > 0) return dynamic;
    return api.getInitialInsights();
  }, [logs]);

  // Compute metrics dynamically via API layer helper
  const metrics: MetricSummary = React.useMemo(() => {
    return api.calculateMetrics(logs);
  }, [logs]);

  return (
    <StorageContext.Provider
      value={{
        logs,
        insights,
        addLog,
        updateLog,
        deleteLog,
        resetToDefault,
        clearAllLogs,
        getLogById,
        metrics,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const context = useContext(StorageContext);
  if (!context) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
}
