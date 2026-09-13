"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogEntry, RuleInsight, MetricSummary } from "./types";
import { api } from "./api";

export interface StorageContextType {
  logs: LogEntry[];
  insights: RuleInsight[];
  isLoading: boolean;
  addLog: (entry: Omit<LogEntry, "id" | "createdAt">) => Promise<LogEntry> | LogEntry;
  updateLog: (id: string, entry: Partial<LogEntry>) => Promise<void> | void;
  deleteLog: (id: string) => Promise<void> | void;
  resetToDefault: () => void;
  clearAllLogs: () => void;
  getLogById: (id: string) => LogEntry | undefined;
  metrics: MetricSummary;
  refresh: () => Promise<void>;
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
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [apiInsights, setApiInsights] = useState<RuleInsight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const [logsRes, insightsRes] = await Promise.all([
        api.fetchLogs(),
        api.fetchInsights(),
      ]);
      if (logsRes.success && Array.isArray(logsRes.data)) {
        setLogs(logsRes.data);
      }
      if (insightsRes.success && Array.isArray(insightsRes.data)) {
        setApiInsights(insightsRes.data);
      }
    } catch (e) {
      console.error("Failed to load data from API:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Clear any legacy localStorage mock logs so frontend is 100% dependent on API
    try {
      localStorage.removeItem("habit-lens-logs");
    } catch {
      // Ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  const addLog = async (entry: Omit<LogEntry, "id" | "createdAt">): Promise<LogEntry> => {
    try {
      const res = await api.createLog(entry);
      const newEntry = res.data;
      setLogs((prev) => {
        const updated = [newEntry, ...prev];
        updated.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return updated;
      });
      return newEntry;
    } catch (error) {
      console.error("Failed to add log:", error);
      const fallbackEntry: LogEntry = {
        ...entry,
        id: `log-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLogs((prev) => [fallbackEntry, ...prev]);
      return fallbackEntry;
    }
  };

  const updateLog = async (id: string, updatedFields: Partial<LogEntry>) => {
    const current = logs.find((l) => l.id === id);
    if (current) {
      try {
        await api.updateLog(current, updatedFields);
      } catch (e) {
        console.error("Failed to update log on API:", e);
      }
    }
    setLogs((prev) =>
      prev.map((log) => (log.id === id ? { ...log, ...updatedFields } : log))
    );
  };

  const deleteLog = async (id: string) => {
    try {
      await api.deleteLog(id);
    } catch (e) {
      console.error("Failed to delete log on API:", e);
    }
    setLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const resetToDefault = () => {
    setLogs(api.getInitialLogs());
  };

  const clearAllLogs = () => {
    setLogs([]);
  };

  const getLogById = (id: string) => {
    return logs.find((l) => l.id === id);
  };

  // Derive rule insights dynamically from actual recorded logs or fall back to API insights
  const insights = React.useMemo(() => {
    if (logs.length === 0) {
      return apiInsights;
    }
    const dynamic = computeRuleInsights(logs);
    if (dynamic.length > 0) return dynamic;
    return apiInsights;
  }, [logs, apiInsights]);

  // Compute metrics dynamically via API layer helper
  const metrics: MetricSummary = React.useMemo(() => {
    return api.calculateMetrics(logs);
  }, [logs]);

  return (
    <StorageContext.Provider
      value={{
        logs,
        insights,
        isLoading,
        addLog,
        updateLog,
        deleteLog,
        resetToDefault,
        clearAllLogs,
        getLogById,
        metrics,
        refresh,
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
