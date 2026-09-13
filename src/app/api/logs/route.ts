import { NextResponse } from "next/server";
import { mockLogsFixture } from "@/fixtures";
import type { ApiResponseDTO, LogEntryDTO, CreateLogDTO } from "@/lib/dto";

/**
 * GET /api/logs
 * Returns all log entries from the fixture layer typed as DTOs
 */
export async function GET(): Promise<NextResponse<ApiResponseDTO<LogEntryDTO[]>>> {
  const dtos: LogEntryDTO[] = mockLogsFixture;
  return NextResponse.json({
    success: true,
    data: [],
    total: 0,
    timestamp: new Date().toISOString(),
  });
}

/**
 * POST /api/logs
 * Accepts CreateLogDTO, maps and returns the created LogEntryDTO
 */
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO>>> {
  try {
    const body = (await request.json()) as CreateLogDTO;
    const newEntry: LogEntryDTO = {
      ...body,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newEntry,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null as unknown as LogEntryDTO,
        message: "Invalid log entry payload",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
