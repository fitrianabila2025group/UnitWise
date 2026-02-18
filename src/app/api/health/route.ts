import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  let db: "ok" | "down" = "down";
  try {
    const { prisma } = await import("@/lib/db");
    await prisma.$queryRaw`SELECT 1`;
    db = "ok";
  } catch {
    // DB unreachable – app itself is still alive
  }
  return NextResponse.json({ ok: true, db, timestamp: new Date().toISOString() });
}
