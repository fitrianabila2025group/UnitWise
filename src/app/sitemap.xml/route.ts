import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSiteUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = await getSiteUrl();

  const sitemaps = [
    `${siteUrl}/sitemaps/conversions.xml`,
    `${siteUrl}/sitemaps/categories.xml`,
    `${siteUrl}/sitemaps/pages.xml`,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((url) => `  <sitemap><loc>${url}</loc><lastmod>${new Date().toISOString().split("T")[0]}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
