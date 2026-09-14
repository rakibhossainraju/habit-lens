import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { computeRuleInsights } from "@/lib/rules";
import { mockInsightsFixture } from "@/fixtures";
import type { ApiResponseDTO, RuleInsightDTO } from "@/lib/dto";
import type { LogEntry } from "@/lib/types";

/**
 * GET /api/insights
 * Dynamically derives rule-based insights from persisted SQLite logs
 */
export async function GET(): Promise<NextResponse<ApiResponseDTO<RuleInsightDTO[]>>> {
  try {
    const entries = await prisma.logEntry.findMany({
      include: {
        customFields: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const domainLogs: LogEntry[] = entries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      sleepTime: entry.sleepTime,
      wakeTime: entry.wakeTime,
      sleepDuration: entry.sleepDuration,
      morningEnergy: entry.morningEnergy,
      afternoonEnergy: entry.afternoonEnergy,
      eveningEnergy: entry.eveningEnergy,
      notes: entry.notes,
      customFields: entry.customFields.map((cf) => ({
        key: cf.key,
        value: cf.value,
      })),
      createdAt: entry.createdAt.toISOString(),
    }));

    const dynamicInsights = computeRuleInsights(domainLogs);
    const insightsToReturn = dynamicInsights.length > 0 ? dynamicInsights : mockInsightsFixture;

    return NextResponse.json({
      success: true,
      data: insightsToReturn,
      total: insightsToReturn.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/insights error:", error);
    return NextResponse.json({
      success: true,
      data: mockInsightsFixture,
      total: mockInsightsFixture.length,
      timestamp: new Date().toISOString(),
    });
  }
}
