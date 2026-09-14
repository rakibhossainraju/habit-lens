import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";

const isStudio = process.argv.some((arg) => arg.includes("studio"));

// Prisma 7 Studio URL parser requires "file://" protocol with an absolute path,
// whereas Prisma schema/migrate engine expects "file:./dev.db".
function getDatasourceUrl(): string {
  const rawUrl = process.env["DATABASE_URL"] || "file:./dev.db";
  if (isStudio && rawUrl.startsWith("file:")) {
    const cleanPath = rawUrl.replace(/^file:(\/\/)?/, "");
    const absolutePath = path.resolve(process.cwd(), cleanPath);
    return `file://${absolutePath}`;
  }
  return rawUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatasourceUrl(),
  },
});
