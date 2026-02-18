import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ConverterWidget } from "@/components/converter-widget";

export const dynamic = "force-dynamic";
import { AdSlot } from "@/components/ad-slot";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { generateExamples } from "@/lib/conversion";
import { getSiteUrl } from "@/lib/settings";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getConversion(slug: string) {
  const rule = await prisma.conversionRule.findUnique({
    where: { slug },
    include: {
      fromUnit: { include: { category: true } },
      toUnit: { include: { category: true } },
      seoPage: true,
    },
  });
  return rule;
}

async function getSeoTemplate(categorySlug: string, type: string) {
  const specific = await prisma.seoTemplate.findUnique({
    where: { categorySlug_templateType: { categorySlug, templateType: type } },
  });
  if (specific) return specific.template;

  const global = await prisma.seoTemplate.findUnique({
    where: { categorySlug_templateType: { categorySlug: "__global__", templateType: type } },
  });
  return global?.template || "";
}

function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), val);
  }
  return result;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const rule = await getConversion(slug);
  if (!rule) return { title: "Not Found" };

  const siteUrl = await getSiteUrl();
  const vars = {
    fromName: rule.fromUnit.name,
    toName: rule.toUnit.name,
    fromSymbol: rule.fromUnit.symbol,
    toSymbol: rule.toUnit.symbol,
    categoryName: rule.fromUnit.category.name,
  };

  const titleTpl = await getSeoTemplate(rule.fromUnit.category.slug, "title");
  const metaTpl = await getSeoTemplate(rule.fromUnit.category.slug, "meta");

  const title = rule.seoPage?.customTitle || fillTemplate(titleTpl, vars);
  const description = rule.seoPage?.customMeta || fillTemplate(metaTpl, vars);

  return {
    title,
    description,
    alternates: { canonical: `${siteUrl}/convert/${slug}` },
  };
}

export default async function ConverterPage({ params }: Props) {
  const { slug } = await params;
  const rule = await getConversion(slug);
  if (!rule) notFound();

  const siteUrl = await getSiteUrl();
  const vars = {
    fromName: rule.fromUnit.name,
    toName: rule.toUnit.name,
    fromSymbol: rule.fromUnit.symbol,
    toSymbol: rule.toUnit.symbol,
    categoryName: rule.fromUnit.category.name,
  };

  const h1Tpl = await getSeoTemplate(rule.fromUnit.category.slug, "h1");
  const introTpl = await getSeoTemplate(rule.fromUnit.category.slug, "intro");

  const h1 = fillTemplate(h1Tpl || "Convert {fromName} to {toName}", vars);
  const intro = rule.seoPage?.customIntro || fillTemplate(introTpl || "", vars);

  // Examples
  const examples = generateExamples(
    { type: rule.type, factor: rule.factor, offset: rule.offset },
    rule.fromUnit.symbol,
    rule.toUnit.symbol
  );

  // FAQs
  const faqs = await prisma.fAQ.findMany({
    where: {
      OR: [
        { conversionSlug: slug },
        { categoryId: rule.fromUnit.categoryId, conversionSlug: null },
      ],
      published: true,
    },
    orderBy: { sortOrder: "asc" },
    take: 10,
  });

  // Related conversions
  const relatedConversions = await prisma.conversionRule.findMany({
    where: {
      id: { not: rule.id },
      OR: [
        { fromUnitId: rule.fromUnitId },
        { toUnitId: rule.toUnitId },
        { fromUnitId: rule.toUnitId },
        { toUnitId: rule.fromUnitId },
      ],
    },
    include: { fromUnit: true, toUnit: true },
    take: 12,
  });

  // Reverse conversion
  const reverseSlug = `${rule.toUnit.slug}-to-${rule.fromUnit.slug}`;

  // JSON-LD
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Convert", item: `${siteUrl}/convert` },
      {
        "@type": "ListItem",
        position: 3,
        name: rule.fromUnit.category.name,
        item: `${siteUrl}/categories/${rule.fromUnit.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: `${rule.fromUnit.name} to ${rule.toUnit.name}`,
        item: `${siteUrl}/convert/${slug}`,
      },
    ],
  };

  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: h1,
    url: `${siteUrl}/convert/${slug}`,
    description: intro,
    isPartOf: { "@type": "WebSite", name: "UnitWise", url: siteUrl },
  };

  const softwareLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${rule.fromUnit.name} to ${rule.toUnit.name} Converter`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };

  const faqLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <Header />
      <main className="container max-w-6xl py-8">
        {/* JSON-LD */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareLd) }} />
        {faqLd && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        )}

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/convert" className="hover:text-foreground">Convert</Link>
          <span className="mx-2">/</span>
          <Link href={`/categories/${rule.fromUnit.category.slug}`} className="hover:text-foreground">
            {rule.fromUnit.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">
            {rule.fromUnit.name} to {rule.toUnit.name}
          </span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{h1}</h1>

            {/* Converter Widget */}
            <ConverterWidget
              fromUnit={{
                id: rule.fromUnitId,
                name: rule.fromUnit.name,
                symbol: rule.fromUnit.symbol,
                slug: rule.fromUnit.slug,
              }}
              toUnit={{
                id: rule.toUnitId,
                name: rule.toUnit.name,
                symbol: rule.toUnit.symbol,
                slug: rule.toUnit.slug,
              }}
              conversionType={rule.type}
              factor={rule.factor}
              offset={rule.offset}
              precision={rule.precision}
              reverseSlug={reverseSlug}
            />

            <AdSlot slot="inContent" className="my-6" />

            {/* Intro */}
            {intro && (
              <section className="mb-8">
                <p className="text-muted-foreground leading-relaxed">{intro}</p>
              </section>
            )}

            {/* Formula */}
            {rule.formulaText && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Conversion Formula</h2>
                <Card>
                  <CardContent className="p-4">
                    <code className="text-lg font-mono tabular-nums">{rule.formulaText}</code>
                  </CardContent>
                </Card>
              </section>
            )}

            {/* Examples */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Conversion Examples</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 pr-4 text-left font-medium">
                        {rule.fromUnit.name} ({rule.fromUnit.symbol})
                      </th>
                      <th className="py-2 text-left font-medium">
                        {rule.toUnit.name} ({rule.toUnit.symbol})
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {examples.map((ex, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 pr-4 tabular-nums">
                          {ex.input} {rule.fromUnit.symbol}
                        </td>
                        <td className="py-2 tabular-nums">
                          {ex.text.split("= ")[1]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ */}
            {faqs.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={faq.id} value={`faq-${i}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-muted-foreground">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <AdSlot slot="sidebar" />

            {/* Related Conversions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Related Conversions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {relatedConversions.map((rc) => (
                  <Link
                    key={rc.id}
                    href={`/convert/${rc.slug}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                  >
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span className="truncate">
                      {rc.fromUnit.name} to {rc.toUnit.name}
                    </span>
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Category link */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Browse Category</h3>
                <Link
                  href={`/categories/${rule.fromUnit.category.slug}`}
                  className="text-sm text-primary hover:underline"
                >
                  All {rule.fromUnit.category.name} Conversions →
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>

        <AdSlot slot="footer" className="mt-8" />
      </main>
      <Footer />
    </>
  );
}
