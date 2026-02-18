import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy" };

export default function CookiePolicyPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        <div className="space-y-4 text-sm text-muted-foreground">
          <p><strong className="text-foreground">Last updated:</strong> February 2026</p>
          <p>UnitWise uses cookies and similar technologies to improve your experience and serve relevant advertisements.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">What Are Cookies</h2>
          <p>Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and provide a better experience.</p>
          <h2 className="text-lg font-semibold text-foreground mt-6">Types of Cookies We Use</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-foreground">Essential cookies:</strong> Required for the website to function properly.</li>
            <li><strong className="text-foreground">Analytics cookies:</strong> Help us understand how visitors use our site.</li>
            <li><strong className="text-foreground">Advertising cookies:</strong> Used by ad networks to deliver relevant advertisements.</li>
          </ul>
          <h2 className="text-lg font-semibold text-foreground mt-6">Managing Cookies</h2>
          <p>You can manage your cookie preferences through our cookie consent banner or through your browser settings. Note that disabling cookies may affect the functionality of our website.</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
