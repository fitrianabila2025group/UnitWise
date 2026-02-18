import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";
import { AdSlot } from "@/components/ad-slot";
import { ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/settings";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Not Found" };

  const siteUrl = await getSiteUrl();
  return {
    title: `${category.name} Unit Converter - Convert ${category.name} Units Online`,
    description: category.description || `Convert between ${category.name} units online. Free, fast, and accurate.`,
    alternates: { canonical: `${siteUrl}/categories/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      units: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!category) notFound();

  // Get all conversions for this category
  const unitIds = category.units.map((u) => u.id);
  const conversions = await prisma.conversionRule.findMany({
    where: { fromUnitId: { in: unitIds } },
    include: { fromUnit: true, toUnit: true },
    orderBy: [{ isPopular: "desc" }, { slug: "asc" }],
  });

  const siteUrl = await getSiteUrl();

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Convert", item: `${siteUrl}/convert` },
      {
        "@type": "ListItem",
        position: 3,
        name: category.name,
        item: `${siteUrl}/categories/${slug}`,
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />

        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/convert" className="hover:text-foreground">Convert</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>

        <h1 className="text-3xl font-bold mb-2">{category.name} Converter</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">{category.description}</p>

        <AdSlot slot="top" className="mb-6" />

        {/* Units in this category */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Units</h2>
          <div className="flex flex-wrap gap-2">
            {category.units.map((unit) => (
              <span
                key={unit.id}
                className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-sm"
              >
                {unit.name} ({unit.symbol})
              </span>
            ))}
          </div>
        </section>

        {/* All conversions */}
        <section>
          <h2 className="text-xl font-semibold mb-4">
            All {category.name} Conversions ({conversions.length})
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {conversions.map((conv) => (
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
        </section>

        <AdSlot slot="footer" className="mt-8" />
      </main>
      <Footer />
    </>
  );
}
