import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, unauthorizedResponse } from "@/lib/auth";

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) return unauthorizedResponse();

  const body = await request.json();

  const ops = Object.entries(body).map(([key, value]) =>
    prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  );

  await prisma.$transaction(ops);

  await prisma.auditLog.create({
    data: {
      userId: session.user.id!,
      action: "UPDATE_SITE_SETTINGS",
      entity: "SiteSetting",
      details: JSON.stringify(Object.keys(body)),
    },
  });

  return NextResponse.json({ ok: true });
}
