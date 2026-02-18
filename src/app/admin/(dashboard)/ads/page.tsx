import { AdsManagerClient } from "./ads-client";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminAdsPage() {
  const settings = await prisma.adSetting.findMany();
  const settingsMap: Record<string, string> = {};
  for (const s of settings) {
    settingsMap[s.key] = s.value;
  }

  return <AdsManagerClient initialSettings={settingsMap} />;
}
