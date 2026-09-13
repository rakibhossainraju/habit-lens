import { api } from "./api";
import type { LogEntry, RuleInsight } from "./types";

/**
 * Re-exports initial domain entities sourced through the API layer (Fixture -> DTO -> API)
 */
export const INITIAL_LOG_ENTRIES: LogEntry[] = api.getInitialLogs();

export const INITIAL_RULE_INSIGHTS: RuleInsight[] = api.getInitialInsights();

// Demo fixture data used for isolated component preview/tests
export const DEMO_LOG_ENTRIES: LogEntry[] = INITIAL_LOG_ENTRIES.slice(0, 4);
export const DEMO_RULE_INSIGHTS: RuleInsight[] = INITIAL_RULE_INSIGHTS.slice(0, 2);
