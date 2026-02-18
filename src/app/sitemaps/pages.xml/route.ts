import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = await getSiteUrl();
  const today = new Date().toISOString().split("T")[0];

  const staticPages = [
    { path: "/", priority: "1.0", freq: "daily" },
    { path: "/convert", priority: "0.9", freq: "daily" },
    { path: "/about", priority: "0.5", freq: "monthly" },
    { path: "/contact", priority: "0.4", freq: "monthly" },
    { path: "/privacy", priority: "0.3", freq: "yearly" },
    { path: "/terms", priority: "0.3", freq: "yearly" },
    { path: "/cookie-policy", priority: "0.3", freq: "yearly" },
    { path: "/ads-policy", priority: "0.3", freq: "yearly" },
  ];

  const urls = staticPages.map(
    (p) =>
      `  <url>
    <loc>${siteUrl}${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
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
