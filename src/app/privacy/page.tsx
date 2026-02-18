import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Last updated:</strong> February 2026</p>
          <p>UnitWise (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website at unitwise.online.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Information We Collect</h2>
          <p>We do not require you to create an account or provide personal information to use our conversion tools. We may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Usage data (pages visited, time spent, browser type) via analytics</li>
            <li>Cookies and similar technologies for functionality and advertising</li>
            <li>Information you voluntarily provide through our contact form</li>
          </ul>
          <h2 className="text-lg font-semibold text-foreground mt-6">Advertising</h2>
          <p>We may display advertisements from third-party networks including Google AdSense and others. These networks may use cookies to serve ads based on your browsing history. You can manage your ad preferences through our cookie consent banner.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Data Security</h2>
          <p>We implement appropriate security measures to protect your information. However, no method of transmission over the Internet is 100% secure.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Your Rights</h2>
          <p>Under GDPR and similar regulations, you have the right to access, correct, or delete your personal data. Contact us at contact@unitwise.online for any privacy-related requests.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Changes</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
