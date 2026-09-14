import path from "node:path";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@/generated/prisma/client";

function getDatabaseUrl() {
  const envUrl = process.env.DATABASE_URL || "file:./dev.db";
  if (envUrl.startsWith("file:./")) {
    const relativePath = envUrl.replace("file:./", "");
    const absolutePath = path.resolve(/*turbopackIgnore: true*/ process.cwd(), relativePath);
    return `file:${absolutePath}`;
  }
  return envUrl;
}

const adapter = new PrismaLibSql({
  url: getDatabaseUrl(),
});

const globalForPrisma = globalThis as unknown as {
  prisma: InstanceType<typeof PrismaClient> | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
