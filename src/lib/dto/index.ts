/**
 * Data Transfer Object (DTO) Layer
 * 
 * Defines network/wire-format schemas and serialization contracts
 * between Fixtures, APIs, and the Domain layer.
 */

export interface CustomFieldDTO {
  key: string;
  value: string;
}

export interface LogEntryDTO {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  sleepDuration: number; // Duration in decimal hours (e.g. 8.25)
  morningEnergy: number; // 0-10
  afternoonEnergy: number; // 0-10
  eveningEnergy: number; // 0-10
  notes?: string | null;
  customFields?: CustomFieldDTO[];
  createdAt?: string;
}

export interface CreateLogDTO {
  date: string;
  sleepTime: string;
  wakeTime: string;
  sleepDuration: number;
  morningEnergy: number;
  afternoonEnergy: number;
  eveningEnergy: number;
  notes?: string;
  customFields?: CustomFieldDTO[];
}

export interface UpdateLogDTO {
  date?: string;
  sleepTime?: string;
  wakeTime?: string;
  sleepDuration?: number;
  morningEnergy?: number;
  afternoonEnergy?: number;
  eveningEnergy?: number;
  notes?: string;
  customFields?: CustomFieldDTO[];
}

export interface RuleInsightDTO {
  id: string;
  title: string;
  description: string;
  confidence: "High" | "Medium" | "Low";
  logsAnalyzed: number;
  relatedMetric: string;
}

export interface ApiResponseDTO<T> {
  success: boolean;
  data: T;
  total?: number;
  message?: string;
  timestamp?: string;
}

export * from "./mappers";
