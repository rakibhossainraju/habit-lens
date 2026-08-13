export interface CustomField {
  key: string;
  value: string;
}

export interface LogEntry {
  id: string;
  date: string;
  sleepTime: string;
  wakeTime: string;
  sleepDuration: number; // in hours
  morningEnergy: number; // 0-10
  afternoonEnergy: number; // 0-10
  eveningEnergy: number; // 0-10
  notes: string;
  customFields: CustomField[];
  createdAt: string;
}

export interface RuleInsight {
  id: string;
  title: string;
  description: string;
  confidence: "High" | "Medium" | "Low";
  logsAnalyzed: number;
  relatedMetric: string;
}

export interface MetricSummary {
  avgSleep: number;
  avgMorningEnergy: number;
  avgAfternoonEnergy: number;
  avgEveningEnergy: number;
  totalLogs: number;
  sleepConsistency: number; // percentage
}
