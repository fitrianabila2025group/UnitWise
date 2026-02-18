import prisma from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminConversionsPage() {
  const conversions = await prisma.conversionRule.findMany({
    include: {
      fromUnit: { include: { category: true } },
      toUnit: true,
    },
    orderBy: [{ fromUnit: { category: { sortOrder: "asc" } } }, { slug: "asc" }],
  });

  const grouped = conversions.reduce(
    (acc, conv) => {
      const cat = conv.fromUnit.category.name;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(conv);
      return acc;
    },
    {} as Record<string, typeof conversions>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Conversions Manager</h1>
        <Badge variant="secondary">{conversions.length} total</Badge>
      </div>

      {Object.entries(grouped).map(([category, convs]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">{category}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-medium">From</th>
                  <th className="py-2 pr-4 font-medium">To</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Factor</th>
                  <th className="py-2 pr-4 font-medium">Offset</th>
                  <th className="py-2 pr-4 font-medium">Popular</th>
                  <th className="py-2 font-medium">Slug</th>
                </tr>
              </thead>
              <tbody>
                {convs.map((conv) => (
                  <tr key={conv.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 pr-4">
                      {conv.fromUnit.name} ({conv.fromUnit.symbol})
                    </td>
                    <td className="py-2 pr-4">
                      {conv.toUnit.name} ({conv.toUnit.symbol})
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant={conv.type === "AFFINE" ? "default" : "secondary"}>
                        {conv.type}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4 tabular-nums">{conv.factor}</td>
                    <td className="py-2 pr-4 tabular-nums">{conv.offset}</td>
                    <td className="py-2 pr-4">
                      {conv.isPopular && <Badge>Popular</Badge>}
                    </td>
                    <td className="py-2 text-xs text-muted-foreground font-mono">
                      {conv.slug}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
