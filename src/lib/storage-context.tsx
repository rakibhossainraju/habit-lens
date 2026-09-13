"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogEntry, RuleInsight, MetricSummary } from "./types";
import { INITIAL_LOG_ENTRIES, INITIAL_RULE_INSIGHTS } from "./mock-data";

interface StorageContextType {
  logs: LogEntry[];
  insights: RuleInsight[];
  addLog: (entry: Omit<LogEntry, "id" | "createdAt">) => LogEntry;
  updateLog: (id: string, entry: Partial<LogEntry>) => void;
  deleteLog: (id: string) => void;
  resetToDefault: () => void;
  getLogById: (id: string) => LogEntry | undefined;
  metrics: MetricSummary;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: React.ReactNode }) {
  // Seeded with the mock data so server and first client render produce
  // identical output (no hydration mismatch, no blank page while JS loads).
  // localStorage isn't readable on the server, so a returning visitor's saved
  // edits can only be swapped in after mount, once this effect runs.
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOG_ENTRIES);
  const [insights] = useState<RuleInsight[]>(INITIAL_RULE_INSIGHTS);

  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem("habit-lens-logs");
      if (storedLogs) {
        const parsed = JSON.parse(storedLogs);
        if (Array.isArray(parsed) && parsed.length > 0) {
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
      localStorage.setItem("habit-lens-logs", JSON.stringify(newLogs));
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
    saveLogs(INITIAL_LOG_ENTRIES);
  };

  const getLogById = (id: string) => {
    return logs.find((l) => l.id === id);
  };

  // Compute metrics dynamically
  const metrics: MetricSummary = React.useMemo(() => {
    if (logs.length === 0) {
      return {
        avgSleep: 0,
        avgMorningEnergy: 0,
        avgAfternoonEnergy: 0,
        avgEveningEnergy: 0,
        totalLogs: 0,
        sleepConsistency: 0,
      };
    }

    const totalSleep = logs.reduce((acc, l) => acc + (l.sleepDuration || 0), 0);
    const totalMorning = logs.reduce((acc, l) => acc + (l.morningEnergy || 0), 0);
    const totalAfternoon = logs.reduce((acc, l) => acc + (l.afternoonEnergy || 0), 0);
    const totalEvening = logs.reduce((acc, l) => acc + (l.eveningEnergy || 0), 0);

    // Sleep consistency: percentage of logs with sleepDuration >= 7.5 and <= 9.0
    const consistentLogs = logs.filter(
      (l) => l.sleepDuration >= 7.5 && l.sleepDuration <= 9.0
    ).length;
    const consistencyPercentage = Math.round((consistentLogs / logs.length) * 100);

    return {
      avgSleep: Number((totalSleep / logs.length).toFixed(1)),
      avgMorningEnergy: Number((totalMorning / logs.length).toFixed(1)),
      avgAfternoonEnergy: Number((totalAfternoon / logs.length).toFixed(1)),
      avgEveningEnergy: Number((totalEvening / logs.length).toFixed(1)),
      totalLogs: logs.length,
      sleepConsistency: consistencyPercentage,
    };
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
