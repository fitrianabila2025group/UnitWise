import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let siteUrl = "https://unitwise.online";
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { key: "site.url" } });
    if (setting) siteUrl = setting.value;
  } catch {}

  const content = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;

  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
