import Link from "next/link";
import prisma from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";
import { AdSlot } from "@/components/ad-slot";
import { ArrowRight, Search } from "lucide-react";
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = await getSiteUrl();
  return {
    title: "Unit Converter - Convert Any Unit Online | UnitWise",
    description:
      "Browse all unit conversions available on UnitWise. Convert length, weight, temperature, area, volume, speed, time, data storage, and more.",
    alternates: { canonical: `${siteUrl}/convert` },
  };
}

export default async function ConvertHubPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      units: { orderBy: { sortOrder: "asc" } },
    },
  });

  const popularConversions = await prisma.conversionRule.findMany({
    where: { isPopular: true },
    include: { fromUnit: { include: { category: true } }, toUnit: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Convert</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">Unit Converter Hub</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Choose a conversion from our comprehensive collection. We support hundreds of unit pairs across all major categories.
        </p>

        <AdSlot slot="top" className="mb-6" />

        {/* Categories with conversions */}
        {categories.map((cat) => {
          const catConversions = popularConversions.filter(
            (c) => c.fromUnit.category.slug === cat.slug
          );
          if (catConversions.length === 0 && cat.units.length === 0) return null;

          return (
            <section key={cat.id} className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-xl font-semibold">
                  <Link href={`/categories/${cat.slug}`} className="hover:text-primary">
                    {cat.name}
                  </Link>
                </h2>
                <Badge variant="secondary">{cat.units.length} units</Badge>
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {catConversions.map((conv) => (
                  <Link key={conv.id} href={`/convert/${conv.slug}`}>
                    <Card className="transition-shadow hover:shadow-md">
                      <CardContent className="flex items-center gap-3 p-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conv.fromUnit.name} to {conv.toUnit.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {conv.fromUnit.symbol} → {conv.toUnit.symbol}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              <Link
                href={`/categories/${cat.slug}`}
                className="mt-2 inline-block text-sm text-primary hover:underline"
              >
                View all {cat.name} conversions →
              </Link>
            </section>
          );
        })}

        <AdSlot slot="footer" className="mt-6" />
      </main>
      <Footer />
    </>
  );
}
