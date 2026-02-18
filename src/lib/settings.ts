import prisma from "./db";

const settingsCache = new Map<string, { value: string; ts: number }>();
const CACHE_TTL = 60_000; // 1 minute

export async function getSiteSetting(key: string): Promise<string | null> {
  const cached = settingsCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.value;
  }

  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  if (setting) {
    settingsCache.set(key, { value: setting.value, ts: Date.now() });
    return setting.value;
  }
  return null;
}

export async function getAdSetting(key: string): Promise<string | null> {
  const setting = await prisma.adSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

export async function getAllAdSettings(): Promise<Record<string, string>> {
  const settings = await prisma.adSetting.findMany();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function getSiteUrl(): Promise<string> {
  const url = await getSiteSetting("site.url");
  return url || "https://unitwise.online";
}
