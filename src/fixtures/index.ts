import rawFixture from "./mock-data.fixture.json";
import type { LogEntryDTO, RuleInsightDTO } from "@/lib/dto";

/**
 * Fixture Layer:
 * Directly exposes raw mock data fixtures as typed DTO structures.
 */

export interface MockDataFixture {
  logs: LogEntryDTO[];
  insights: RuleInsightDTO[];
}

export const mockDataFixture: MockDataFixture = {
  logs: (rawFixture.logs as LogEntryDTO[]) || [],
  insights: (rawFixture.insights as RuleInsightDTO[]) || [],
};

export const mockLogsFixture: LogEntryDTO[] = mockDataFixture.logs;
export const mockInsightsFixture: RuleInsightDTO[] = mockDataFixture.insights;
