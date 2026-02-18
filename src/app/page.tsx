import Link from "next/link";
import prisma from "@/lib/db";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import {
  Ruler,
  Weight,
  Thermometer,
  Square,
  Beaker,
  Gauge,
  Clock,
  HardDrive,
  ArrowDownUp,
  Zap,
  Activity,
  Fuel,
  ArrowRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

const iconMap: Record<string, React.ReactNode> = {
  Ruler: <Ruler className="h-8 w-8" />,
  Weight: <Weight className="h-8 w-8" />,
  Thermometer: <Thermometer className="h-8 w-8" />,
  Square: <Square className="h-8 w-8" />,
  Beaker: <Beaker className="h-8 w-8" />,
  Gauge: <Gauge className="h-8 w-8" />,
  Clock: <Clock className="h-8 w-8" />,
  HardDrive: <HardDrive className="h-8 w-8" />,
  ArrowDownUp: <ArrowDownUp className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  Activity: <Activity className="h-8 w-8" />,
  Fuel: <Fuel className="h-8 w-8" />,
};

export default async function HomePage() {
  const categories = await prisma.category.findMany({
    where: { featured: true },
    orderBy: { sortOrder: "asc" },
  });

  const popularConversions = await prisma.conversionRule.findMany({
    where: { isPopular: true },
    include: { fromUnit: true, toUnit: true },
    take: 16,
  });

  const totalConversions = await prisma.conversionRule.count();

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
          <div className="container max-w-5xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Unit Converter Hub
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
              Free, fast, and accurate online conversions for {totalConversions}+ unit pairs across {categories.length}+ categories. Trusted by millions worldwide.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/convert"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
              >
                Start Converting <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/categories/length"
                className="inline-flex h-11 items-center gap-2 rounded-lg border bg-background px-6 text-sm font-medium shadow-sm hover:bg-accent transition-colors"
              >
                Browse Categories
              </Link>
            </div>
          </div>
        </section>

        <AdSlot slot="top" className="container my-4" />

        {/* Categories */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Conversion Categories
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/categories/${cat.slug}`}>
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {iconMap[cat.icon || ""] || <ArrowDownUp className="h-8 w-8" />}
                        </div>
                        <CardTitle className="text-lg">{cat.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {cat.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <AdSlot slot="inContent" className="container my-4" />

        {/* Popular Conversions */}
        <section className="bg-muted/50 py-12 md:py-16">
          <div className="container max-w-6xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Popular Conversions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {popularConversions.map((conv) => (
                <Link key={conv.id} href={`/convert/${conv.slug}`}>
                  <Card className="transition-shadow hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {conv.fromUnit.name} to {conv.toUnit.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {conv.fromUnit.symbol} → {conv.toUnit.symbol}
                        </p>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        <ArrowRight className="h-3 w-3" />
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/convert"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all {totalConversions} conversions →
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-12 md:py-16">
          <div className="container max-w-5xl">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Why UnitWise?
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Instant Results</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Real-time calculations as you type. No page reloads, no waiting.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Precision Guaranteed</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Scientifically accurate formulas tested against standard references.
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <HardDrive className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">All Categories</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Length, weight, temperature, area, volume, speed, time, data, and more.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AdSlot slot="footer" className="container my-4" />
      </main>
      <Footer />
    </>
  );
}
