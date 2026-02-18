import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About UnitWise",
  description: "Learn about UnitWise, a free online unit converter hub used by millions worldwide.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-6">About UnitWise</h1>
        <div className="prose prose-sm max-w-none space-y-4 text-muted-foreground">
          <p>
            UnitWise is a free, fast, and accurate online unit converter designed to help you convert between
            hundreds of different units across multiple categories. Whether you need to convert length,
            weight, temperature, area, volume, speed, time, or data storage units, UnitWise has you covered.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Our Mission</h2>
          <p>
            We believe that unit conversion should be simple, free, and accessible to everyone. Our goal is
            to provide the most comprehensive and user-friendly conversion tool on the web, supporting all
            major unit systems used worldwide.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Accuracy</h2>
          <p>
            All conversion formulas used by UnitWise are based on internationally recognized standards and
            are regularly verified for accuracy. Our conversions support both linear and affine transformations,
            ensuring precise results even for complex conversions like temperature.
          </p>
          <h2 className="text-xl font-semibold text-foreground mt-8">Contact</h2>
          <p>
            If you have questions, suggestions, or find an issue with any conversion, please visit our{" "}
            <a href="/contact" className="text-primary hover:underline">contact page</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
