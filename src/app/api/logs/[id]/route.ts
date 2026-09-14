import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponseDTO, LogEntryDTO, UpdateLogDTO } from "@/lib/dto";

/**
 * GET /api/logs/[id]
 * Fetches a single log entry by its ID
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO | null>>> {
  try {
    const { id } = await params;
    const entry = await prisma.logEntry.findUnique({
      where: { id },
      include: {
        customFields: true,
      },
    });

    if (!entry) {
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

    const dto: LogEntryDTO = {
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
    };

    return NextResponse.json({
      success: true,
      data: dto,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/logs/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to fetch log entry",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/logs/[id]
 * Updates a log entry and re-syncs custom fields
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO | null>>> {
  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateLogDTO;

    const existing = await prisma.logEntry.findUnique({
      where: { id },
    });

    if (!existing) {
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

    if (body.customFields) {
      await prisma.customField.deleteMany({
        where: { logId: id },
      });
      if (body.customFields.length > 0) {
        await prisma.customField.createMany({
          data: body.customFields.map((cf) => ({
            key: cf.key.trim(),
            value: cf.value.trim(),
            logId: id,
          })),
        });
      }
    }

    const updated = await prisma.logEntry.update({
      where: { id },
      data: {
        ...(body.date !== undefined && { date: body.date }),
        ...(body.sleepTime !== undefined && { sleepTime: body.sleepTime }),
        ...(body.wakeTime !== undefined && { wakeTime: body.wakeTime }),
        ...(body.sleepDuration !== undefined && { sleepDuration: Number(body.sleepDuration) }),
        ...(body.morningEnergy !== undefined && { morningEnergy: Math.round(Number(body.morningEnergy)) }),
        ...(body.afternoonEnergy !== undefined && { afternoonEnergy: Math.round(Number(body.afternoonEnergy)) }),
        ...(body.eveningEnergy !== undefined && { eveningEnergy: Math.round(Number(body.eveningEnergy)) }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
      include: {
        customFields: true,
      },
    });

    const dto: LogEntryDTO = {
      id: updated.id,
      date: updated.date,
      sleepTime: updated.sleepTime,
      wakeTime: updated.wakeTime,
      sleepDuration: updated.sleepDuration,
      morningEnergy: updated.morningEnergy,
      afternoonEnergy: updated.afternoonEnergy,
      eveningEnergy: updated.eveningEnergy,
      notes: updated.notes,
      customFields: updated.customFields.map((cf) => ({
        key: cf.key,
        value: cf.value,
      })),
      createdAt: updated.createdAt.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: dto,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("PUT /api/logs/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Failed to update log entry in database",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/logs/[id]
 * Deletes a log entry (custom fields cascade deleted)
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponseDTO<boolean>>> {
  try {
    const { id } = await params;
    await prisma.logEntry.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      data: true,
      message: `Log entry ${id} deleted successfully`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("DELETE /api/logs/[id] error:", error);
    return NextResponse.json(
      {
        success: false,
        data: false,
        message: "Failed to delete log entry from database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
