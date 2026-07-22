import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma2x?: PrismaClient };
export const db = g.prisma2x ?? new PrismaClient({ log: ["error", "warn"] });
if (process.env.NODE_ENV !== "production") g.prisma2x = db;
