import prisma from "@/lib/db";
import { AdsScripts } from "@/components/ads-scripts";

export async function AdsHead() {
  let headHtml = "";
  let provider = "";

  try {
    const [globalHead, providerSetting] = await Promise.all([
      prisma.adSetting.findUnique({ where: { key: "ads.globalHeadHtml" } }),
      prisma.adSetting.findUnique({ where: { key: "ads.provider" } }),
    ]);
    headHtml = globalHead?.value || "";
    provider = providerSetting?.value || "";
  } catch {
    // DB not available
  }

  if (!headHtml && !provider) return null;

  // Extract <script src="..."> URLs from custom head HTML
  const scriptSrcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*><\/script>/gi;
  const scriptSrcs: string[] = [];
  let match;
  while ((match = scriptSrcRegex.exec(headHtml)) !== null) {
    scriptSrcs.push(match[1]);
  }

  // Extract inline script content (non-src scripts)
  const inlineRegex = /<script[^>]*>([^<]+)<\/script>/gi;
  let inlineCode = "";
  let inlineMatch;
  while ((inlineMatch = inlineRegex.exec(headHtml)) !== null) {
    if (!inlineMatch[0].includes("src=")) {
      inlineCode += inlineMatch[1] + "\n";
    }
  }

  return (
    <AdsScripts
      scriptSrcs={scriptSrcs}
      inlineCode={inlineCode.trim()}
      provider={provider}
    />
  );
}
