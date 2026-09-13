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
 * Architecture Flow:
 * Fixture (raw JSON fixtures)
 *   ↓
 * DTO (Data Transfer Objects & Mappers)
 *   ↓
 * API Layer (Service abstraction & Endpoints)
 *   ↓
 * Domain Models (LogEntry, RuleInsight, MetricSummary)
 */
export const api = {
  /**
   * Synchronously loads initial log entries from Fixture through DTO mappers
   */
  getInitialLogs(): LogEntry[] {
    const dtos: LogEntryDTO[] = mockLogsFixture;
    return toLogEntryListDomain(dtos);
  },

  /**
   * Synchronously loads initial rule insights from Fixture through DTO mappers
   */
  getInitialInsights(): RuleInsight[] {
    const dtos: RuleInsightDTO[] = mockInsightsFixture;
    return toRuleInsightListDomain(dtos);
  },

  /**
   * Asynchronous fetch for logs through DTO transformation pipeline
   */
  async fetchLogs(): Promise<ApiResponseDTO<LogEntry[]>> {
    const dtos: LogEntryDTO[] = mockLogsFixture;
    const domainLogs = toLogEntryListDomain(dtos);
    return {
      success: true,
      data: domainLogs,
      total: domainLogs.length,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronous fetch for a single log entry by ID
   */
  async fetchLogById(id: string): Promise<ApiResponseDTO<LogEntry | null>> {
    const dtos: LogEntryDTO[] = mockLogsFixture;
    const foundDto = dtos.find((dto) => dto.id === id);
    return {
      success: true,
      data: foundDto ? toLogEntryDomain(foundDto) : null,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronously creates a log entry, transforming DTO input to Domain entity
   */
  async createLog(input: CreateLogDTO): Promise<ApiResponseDTO<LogEntry>> {
    const newDto: LogEntryDTO = {
      ...input,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const domainEntry = toLogEntryDomain(newDto);
    return {
      success: true,
      data: domainEntry,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronously updates a log entry with partial updates
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
    const domainEntry = toLogEntryDomain(updatedDto);
    return {
      success: true,
      data: domainEntry,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Asynchronous fetch for rule-based insights through DTO transformation pipeline
   */
  async fetchInsights(): Promise<ApiResponseDTO<RuleInsight[]>> {
    const dtos: RuleInsightDTO[] = mockInsightsFixture;
    const domainInsights = toRuleInsightListDomain(dtos);
    return {
      success: true,
      data: domainInsights,
      total: domainInsights.length,
      timestamp: new Date().toISOString(),
    };
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
