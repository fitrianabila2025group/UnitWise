import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const body = await request.json();

  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const entries = Object.entries(body as Record<string, string>);

  for (const [key, value] of entries) {
    if (typeof key !== "string" || typeof value !== "string") continue;
    if (!key.startsWith("ads.")) continue;

    await prisma.adSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  // Audit log
  try {
    await prisma.auditLog.create({
      data: {
        userId: session.user.id!,
        action: "UPDATE",
        entity: "AdSettings",
        details: `Updated ${entries.length} ad settings`,
      },
    });
  } catch {
    // Non-critical
  }

  return NextResponse.json({ success: true });
}
