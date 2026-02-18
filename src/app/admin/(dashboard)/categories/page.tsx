import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { units: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories Manager</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Slug</th>
              <th className="py-2 pr-4 font-medium">Units</th>
              <th className="py-2 pr-4 font-medium">Featured</th>
              <th className="py-2 pr-4 font-medium">Icon</th>
              <th className="py-2 font-medium">Order</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="py-2 pr-4 font-medium">{cat.name}</td>
                <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{cat.slug}</td>
                <td className="py-2 pr-4">
                  <Badge variant="secondary">{cat._count.units}</Badge>
                </td>
                <td className="py-2 pr-4">
                  {cat.featured && <Badge>Featured</Badge>}
                </td>
                <td className="py-2 pr-4 text-muted-foreground">{cat.icon}</td>
                <td className="py-2 tabular-nums">{cat.sortOrder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
