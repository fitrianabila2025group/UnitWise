import { SiteSettingsClient } from "./settings-client";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminSiteSettingsPage() {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  });
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return <SiteSettingsClient initialSettings={settingsMap} />;
}
