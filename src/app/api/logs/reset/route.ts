import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { mockLogsFixture } from "@/fixtures";
import type { ApiResponseDTO, LogEntryDTO } from "@/lib/dto";

/**
 * POST /api/logs/reset
 * Resets database to default mock fixtures or clears all data
 */
export async function POST(request: Request): Promise<NextResponse<ApiResponseDTO<LogEntryDTO[]>>> {
  try {
    const body = await request.json().catch(() => ({ action: "reset" }));
    const action = body.action || "reset";

    await prisma.customField.deleteMany();
    await prisma.logEntry.deleteMany();

    if (action === "clear") {
      return NextResponse.json({
        success: true,
        data: [],
        total: 0,
        message: "All log entries cleared",
        timestamp: new Date().toISOString(),
      });
    }

    // Reset with fixture data
    for (const log of mockLogsFixture) {
      await prisma.logEntry.create({
        data: {
          id: log.id,
          date: log.date,
          sleepTime: log.sleepTime,
          wakeTime: log.wakeTime,
          sleepDuration: log.sleepDuration,
          morningEnergy: log.morningEnergy,
          afternoonEnergy: log.afternoonEnergy,
          eveningEnergy: log.eveningEnergy,
          notes: log.notes ?? "",
          createdAt: log.createdAt ? new Date(log.createdAt) : new Date(),
          customFields: {
            create: (log.customFields || []).map((cf) => ({
              key: cf.key,
              value: cf.value,
            })),
          },
        },
      });
    }

    const seeded = await prisma.logEntry.findMany({
      include: { customFields: true },
      orderBy: { date: "desc" },
    });

    const dtos: LogEntryDTO[] = seeded.map((entry) => ({
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
      message: "Database reset to sample dataset",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Reset API error:", error);
    return NextResponse.json(
      {
        success: false,
        data: [],
        total: 0,
        message: "Failed to reset database",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
