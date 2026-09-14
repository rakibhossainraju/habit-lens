import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { ApiResponseDTO, LogEntryDTO, CreateLogDTO } from "@/lib/dto";

/**
 * GET /api/logs
 * Fetches all log entries from SQLite database ordered by date descending
 */
export async function GET(): Promise<NextResponse<ApiResponseDTO<LogEntryDTO[]>>> {
  try {
    const entries = await prisma.logEntry.findMany({
      include: {
        customFields: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    const dtos: LogEntryDTO[] = entries.map((entry) => ({
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

    return NextResponse.json({
      success: true,
      data: dtos,
      total: dtos.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/logs error:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        message: "Failed to fetch log entries from database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/logs
 * Persists a new log entry and its custom fields to the SQLite database
 */
export async function POST(
  request: Request
): Promise<NextResponse<ApiResponseDTO<LogEntryDTO>>> {
  try {
    const body = (await request.json()) as CreateLogDTO;

    const entry = await prisma.logEntry.create({
      data: {
        date: body.date,
        sleepTime: body.sleepTime,
        wakeTime: body.wakeTime,
        sleepDuration: Number(body.sleepDuration) || 0,
        morningEnergy: Math.round(Number(body.morningEnergy)) || 5,
        afternoonEnergy: Math.round(Number(body.afternoonEnergy)) || 5,
        eveningEnergy: Math.round(Number(body.eveningEnergy)) || 5,
        notes: body.notes ?? "",
        customFields: {
          create: (body.customFields || []).map((cf) => ({
            key: cf.key.trim(),
            value: cf.value.trim(),
          })),
        },
      },
      include: {
        customFields: true,
      },
    });

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

    return NextResponse.json(
      {
        success: true,
        data: dto,
        timestamp: new Date().toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/logs error:", error);
    return NextResponse.json(
      {
        success: false,
        data: null as unknown as LogEntryDTO,
        message: "Failed to create log entry in database",
        timestamp: new Date().toISOString(),
      },
      { status: 400 }
    );
  }
}
