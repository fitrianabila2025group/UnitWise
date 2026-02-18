import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Advertising Policy" };

export default function AdsPolicyPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Advertising Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Last updated:</strong> February 2026</p>
          <p>UnitWise is a free service supported by advertising. We work with reputable ad networks to display relevant advertisements while maintaining a good user experience.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Ad Networks</h2>
          <p>We may partner with the following advertising networks: Google AdSense, Adsterra, Monetag, HilltopAds, and other networks as appropriate.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Personalized Ads</h2>
          <p>By default, ads are non-personalized. If you consent to personalized advertising through our cookie consent banner, ad networks may use your browsing data to show you more relevant ads.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Ad Placement</h2>
          <p>We place ads in designated areas of our pages to avoid disrupting your experience. Ads are clearly distinguishable from our content.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
