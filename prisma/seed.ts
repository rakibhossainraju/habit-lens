import { prisma } from "../src/lib/prisma";
import { mockLogsFixture } from "../src/fixtures";

async function main() {
  console.log("Seeding SQLite database with initial fixture logs...");

  // Clear existing entries
  await prisma.customField.deleteMany();
  await prisma.logEntry.deleteMany();

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

  const count = await prisma.logEntry.count();
  console.log(`Successfully seeded ${count} log entries into SQLite database!`);
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    // disconnected
  });
