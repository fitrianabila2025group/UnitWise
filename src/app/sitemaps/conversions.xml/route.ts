import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSiteUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = await getSiteUrl();

  const conversions = await prisma.conversionRule.findMany({
    select: { slug: true, updatedAt: true },
    orderBy: { slug: "asc" },
  });

  const urls = conversions.map(
    (c) =>
      `  <url>
    <loc>${siteUrl}/convert/${c.slug}</loc>
    <lastmod>${c.updatedAt.toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
