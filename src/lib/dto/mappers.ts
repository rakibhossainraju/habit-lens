import type { LogEntry, RuleInsight, CustomField } from "@/lib/types";
import type { LogEntryDTO, RuleInsightDTO, CustomFieldDTO } from "./index";

/**
 * Mappers to transform between DTO layer and Domain entities
 */

export function toCustomFieldDomain(dto: CustomFieldDTO): CustomField {
  return {
    key: dto.key.trim(),
    value: dto.value.trim(),
  };
}

export function toCustomFieldDTO(domain: CustomField): CustomFieldDTO {
  return {
    key: domain.key,
    value: domain.value,
  };
}

export function toLogEntryDomain(dto: LogEntryDTO): LogEntry {
  return {
    id: dto.id,
    date: dto.date,
    sleepTime: dto.sleepTime,
    wakeTime: dto.wakeTime,
    sleepDuration: typeof dto.sleepDuration === "number" ? dto.sleepDuration : 0,
    morningEnergy: typeof dto.morningEnergy === "number" ? dto.morningEnergy : 5,
    afternoonEnergy: typeof dto.afternoonEnergy === "number" ? dto.afternoonEnergy : 5,
    eveningEnergy: typeof dto.eveningEnergy === "number" ? dto.eveningEnergy : 5,
    notes: dto.notes ?? "",
    customFields: Array.isArray(dto.customFields)
      ? dto.customFields.map(toCustomFieldDomain)
      : [],
    createdAt: dto.createdAt ?? new Date().toISOString(),
  };
}

export function toLogEntryDTO(domain: LogEntry): LogEntryDTO {
  return {
    id: domain.id,
    date: domain.date,
    sleepTime: domain.sleepTime,
    wakeTime: domain.wakeTime,
    sleepDuration: domain.sleepDuration,
    morningEnergy: domain.morningEnergy,
    afternoonEnergy: domain.afternoonEnergy,
    eveningEnergy: domain.eveningEnergy,
    notes: domain.notes,
    customFields: domain.customFields.map(toCustomFieldDTO),
    createdAt: domain.createdAt,
  };
}

export function toLogEntryListDomain(dtos: LogEntryDTO[]): LogEntry[] {
  return (dtos || []).map(toLogEntryDomain);
}

export function toLogEntryListDTO(domains: LogEntry[]): LogEntryDTO[] {
  return (domains || []).map(toLogEntryDTO);
}

export function toRuleInsightDomain(dto: RuleInsightDTO): RuleInsight {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    confidence: dto.confidence,
    logsAnalyzed: dto.logsAnalyzed,
    relatedMetric: dto.relatedMetric,
  };
}

export function toRuleInsightDTO(domain: RuleInsight): RuleInsightDTO {
  return {
    id: domain.id,
    title: domain.title,
    description: domain.description,
    confidence: domain.confidence,
    logsAnalyzed: domain.logsAnalyzed,
    relatedMetric: domain.relatedMetric,
  };
}

export function toRuleInsightListDomain(dtos: RuleInsightDTO[]): RuleInsight[] {
  return (dtos || []).map(toRuleInsightDomain);
}

export function toRuleInsightListDTO(domains: RuleInsight[]): RuleInsightDTO[] {
  return (domains || []).map(toRuleInsightDTO);
}
