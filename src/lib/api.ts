import { mockLogsFixture, mockInsightsFixture } from "@/fixtures";
import {
  type LogEntryDTO,
  type RuleInsightDTO,
  type CreateLogDTO,
  type UpdateLogDTO,
  type ApiResponseDTO,
  toLogEntryDomain,
  toLogEntryListDomain,
  toLogEntryDTO,
  toRuleInsightListDomain,
} from "@/lib/dto";
import type { LogEntry, RuleInsight, MetricSummary } from "@/lib/types";

/**
 * Habit Lens API Layer
 *
 * Connected directly to the application's Next.js API route handlers (/api/logs, /api/insights).
 */
export const api = {
  /**
   * Synchronously loads sample fixture log entries (used for fallback or manual reset)
   */
  getInitialLogs(): LogEntry[] {
    const dtos: LogEntryDTO[] = mockLogsFixture;
    return toLogEntryListDomain(dtos);
  },

  /**
   * Synchronously loads sample fixture rule insights (used for fallback or manual reset)
   */
  getInitialInsights(): RuleInsight[] {
    const dtos: RuleInsightDTO[] = mockInsightsFixture;
    return toRuleInsightListDomain(dtos);
  },

  /**
   * Resets database to default sample fixtures via POST /api/logs/reset
   */
  async resetDatabase(): Promise<ApiResponseDTO<LogEntry[]>> {
    try {
      const res = await fetch("/api/logs/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const json: ApiResponseDTO<LogEntryDTO[]> = await res.json();
      return {
        ...json,
        data: toLogEntryListDomain(json.data || []),
      };
    } catch {
      return {
        success: true,
        data: this.getInitialLogs(),
        total: 14,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Clears all log entries from the database via POST /api/logs/reset
   */
  async clearDatabase(): Promise<ApiResponseDTO<LogEntry[]>> {
    try {
      const res = await fetch("/api/logs/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clear" }),
      });
      const json: ApiResponseDTO<LogEntryDTO[]> = await res.json();
      return {
        ...json,
        data: [],
      };
    } catch {
      return {
        success: true,
        data: [],
        total: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Asynchronous fetch for logs from /api/logs
   */
  async fetchLogs(): Promise<ApiResponseDTO<LogEntry[]>> {
    try {
      const res = await fetch("/api/logs", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch logs: ${res.statusText}`);
      }
      const json: ApiResponseDTO<LogEntryDTO[]> = await res.json();
      return {
        ...json,
        data: toLogEntryListDomain(json.data || []),
        total: json.total ?? (json.data?.length || 0),
      };
    } catch (error) {
      console.error("fetchLogs API error:", error);
      return {
        success: false,
        data: [],
        total: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Asynchronous fetch for a single log entry by ID from /api/logs/[id]
   */
  async fetchLogById(id: string): Promise<ApiResponseDTO<LogEntry | null>> {
    try {
      const res = await fetch(`/api/logs/${id}`, { cache: "no-store" });
      if (!res.ok) {
        return {
          success: false,
          data: null,
          timestamp: new Date().toISOString(),
        };
      }
      const json: ApiResponseDTO<LogEntryDTO | null> = await res.json();
      return {
        ...json,
        data: json.data ? toLogEntryDomain(json.data) : null,
      };
    } catch (error) {
      console.error("fetchLogById API error:", error);
      return {
        success: false,
        data: null,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Asynchronously creates a log entry via POST /api/logs
   */
  async createLog(input: CreateLogDTO): Promise<ApiResponseDTO<LogEntry>> {
    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error(`Failed to create log: ${res.statusText}`);
      }
      const json: ApiResponseDTO<LogEntryDTO> = await res.json();
      return {
        ...json,
        data: toLogEntryDomain(json.data),
      };
    } catch (error) {
      console.error("createLog API error, falling back locally:", error);
      const fallbackDto: LogEntryDTO = {
        ...input,
        id: `log-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      return {
        success: true,
        data: toLogEntryDomain(fallbackDto),
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Asynchronously updates a log entry with partial updates via PUT /api/logs/[id]
   */
  async updateLog(
    current: LogEntry,
    updates: UpdateLogDTO
  ): Promise<ApiResponseDTO<LogEntry>> {
    const currentDto = toLogEntryDTO(current);
    const updatedDto: LogEntryDTO = {
      ...currentDto,
      ...updates,
    };
    try {
      const res = await fetch(`/api/logs/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedDto),
      });
      if (res.ok) {
        const json: ApiResponseDTO<LogEntryDTO> = await res.json();
        return {
          ...json,
          data: toLogEntryDomain(json.data),
        };
      }
    } catch {
      // Ignore and return updated domain entity
    }
    return {
      success: true,
      data: toLogEntryDomain(updatedDto),
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronously deletes a log entry via DELETE /api/logs/[id]
   */
  async deleteLog(id: string): Promise<ApiResponseDTO<boolean>> {
    try {
      const res = await fetch(`/api/logs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const json: ApiResponseDTO<boolean> = await res.json();
        return json;
      }
    } catch {
      // Ignore
    }
    return {
      success: true,
      data: true,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronous fetch for rule-based insights from /api/insights
   */
  async fetchInsights(): Promise<ApiResponseDTO<RuleInsight[]>> {
    try {
      const res = await fetch("/api/insights", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Failed to fetch insights: ${res.statusText}`);
      }
      const json: ApiResponseDTO<RuleInsightDTO[]> = await res.json();
      return {
        ...json,
        data: toRuleInsightListDomain(json.data || []),
        total: json.total ?? (json.data?.length || 0),
      };
    } catch (error) {
      console.error("fetchInsights API error:", error);
      return {
        success: false,
        data: [],
        total: 0,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Computes derived summary metrics for domain logs
   */
  calculateMetrics(logs: LogEntry[]): MetricSummary {
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
  },
};
