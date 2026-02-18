import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Last updated:</strong> February 2026</p>
          <p>By using UnitWise (unitwise.online), you agree to these Terms of Service. If you do not agree, please do not use the site.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Use of Service</h2>
          <p>UnitWise provides free online unit conversion tools. You may use these tools for personal and commercial purposes. While we strive for accuracy, we make no warranties regarding the accuracy of conversion results.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Disclaimer</h2>
          <p>The conversion results provided by UnitWise are for informational purposes only. Always verify critical conversions independently. We are not liable for any damages arising from the use of our service.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Intellectual Property</h2>
          <p>The content, design, and code of UnitWise are protected by copyright. You may not reproduce or redistribute our content without permission.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Modifications</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of the updated terms.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
