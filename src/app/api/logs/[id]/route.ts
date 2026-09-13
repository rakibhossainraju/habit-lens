import { NextResponse } from "next/server";
import { mockLogsFixture } from "@/fixtures";
import type { ApiResponseDTO, LogEntryDTO, UpdateLogDTO } from "@/lib/dto";

/**
 * GET /api/logs/[id]
 * Returns a single log entry by ID
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO | null>>> {
  const { id } = await params;
  const dtos: LogEntryDTO[] = mockLogsFixture;
  const found = dtos.find((d) => d.id === id);

  if (!found) {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Log entry not found",
        timestamp: new Date().toISOString(),
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: found,
    timestamp: new Date().toISOString(),
  });
}

/**
 * PUT /api/logs/[id]
 * Updates a log entry by ID
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO | null>>> {
  const { id } = await params;
  try {
    const body = (await request.json()) as UpdateLogDTO;
    return NextResponse.json({
      success: true,
      data: {
        ...body,
        id,
      } as LogEntryDTO,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Invalid payload",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/logs/[id]
 * Deletes a log entry by ID
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<boolean>>> {
  const { id } = await params;
  return NextResponse.json({
    success: true,
    data: true,
    message: `Log entry ${id} deleted successfully`,
    timestamp: new Date().toISOString(),
  });
}
