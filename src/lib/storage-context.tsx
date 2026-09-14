"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { LogEntry, RuleInsight, MetricSummary } from "./types";
import { api } from "./api";
import { computeRuleInsights } from "./rules";

export interface StorageContextType {
  logs: LogEntry[];
  insights: RuleInsight[];
  isLoading: boolean;
  addLog: (entry: Omit<LogEntry, "id" | "createdAt">) => Promise<LogEntry> | LogEntry;
  updateLog: (id: string, entry: Partial<LogEntry>) => Promise<void> | void;
  deleteLog: (id: string) => Promise<void> | void;
  resetToDefault: () => Promise<void> | void;
  clearAllLogs: () => Promise<void> | void;
  getLogById: (id: string) => LogEntry | undefined;
  metrics: MetricSummary;
  refresh: () => Promise<void>;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

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

  const resetToDefault = async () => {
    setIsLoading(true);
    try {
      const res = await api.resetDatabase();
      if (res.success && res.data) {
        setLogs(res.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllLogs = async () => {
    setIsLoading(true);
    try {
      const res = await api.clearDatabase();
      if (res.success) {
        setLogs([]);
      }
    } finally {
      setIsLoading(false);
    }
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
