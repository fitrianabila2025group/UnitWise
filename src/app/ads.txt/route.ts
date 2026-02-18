import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  let lines: string[] = [];

  try {
    // Get ads.txt content from DB
    const adsTxt = await prisma.adSetting.findUnique({
      where: { key: "ads.adsTxtContent" },
    });

    if (adsTxt?.value) {
      lines.push(adsTxt.value);
    }

    // Auto-generate AdSense line if pubId exists
    const pubId = await prisma.adSetting.findUnique({
      where: { key: "ads.adsense.pubId" },
    });
    const provider = await prisma.adSetting.findUnique({
      where: { key: "ads.provider" },
    });

    if (
      provider?.value === "adsense" &&
      pubId?.value &&
      !lines.join("\n").includes(pubId.value)
    ) {
      lines.push(
        `google.com, ${pubId.value}, DIRECT, f08c47fec0942fa0`
      );
    }
  } catch {
    // DB not available
  }

  const content = lines.filter(Boolean).join("\n") || "# No ads.txt entries configured";

  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
