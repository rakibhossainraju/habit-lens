import { NextResponse } from "next/server";
import { mockInsightsFixture } from "@/fixtures";
import type { ApiResponseDTO, RuleInsightDTO } from "@/lib/dto";

/**
 * GET /api/insights
 * Returns rule-based insights from fixture layer typed as DTOs
 */
export async function GET(): Promise<NextResponse<ApiResponseDTO<RuleInsightDTO[]>>> {
  const dtos: RuleInsightDTO[] = mockInsightsFixture;
  return NextResponse.json({
    success: true,
    data: [],
    total: 0,
    timestamp: new Date().toISOString(),
  });
}
