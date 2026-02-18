import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CookieConsent } from "@/components/cookie-consent";
import { AdsHead } from "@/components/ads-head";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  let siteUrl = "https://unitwise.online";
  let siteName = "UnitWise";
  let siteDesc = "Free, fast, and accurate online unit converter supporting hundreds of conversions across length, weight, temperature, area, volume, speed, time, data storage, and more.";

  try {
    const { prisma } = await import("@/lib/db");
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ["site.url", "site.name", "site.description"] } },
    });
    for (const s of settings) {
      if (s.key === "site.url") siteUrl = s.value;
      if (s.key === "site.name") siteName = s.value;
      if (s.key === "site.description") siteDesc = s.value;
    }
  } catch {
    // DB not available during build
  }

  const other: Record<string, string> = {};
  try {
    const { prisma } = await import("@/lib/db");
    const adsenseClient = await prisma.adSetting.findUnique({ where: { key: "ads.adsense.clientId" } });
    if (adsenseClient?.value) {
      other["google-adsense-account"] = adsenseClient.value;
    }
  } catch {
    // DB not available
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${siteName} - Free Online Unit Converter`,
      template: `%s | ${siteName}`,
    },
    description: siteDesc,
    openGraph: {
      type: "website",
      siteName,
      title: `${siteName} - Free Online Unit Converter`,
      description: siteDesc,
      url: siteUrl,
    },
    twitter: {
      card: "summary_large_image",
    },
    robots: {
      index: true,
      follow: true,
    },
    other,
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <AdsHead />
      </head>
      <body className="min-h-screen font-sans antialiased">
        {children}
        <Toaster />
        <CookieConsent />
      </body>
    </html>
  );
}
