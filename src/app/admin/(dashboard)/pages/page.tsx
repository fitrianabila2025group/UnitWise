import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const seoPages = await prisma.seoPage.findMany({
    include: {
      conversionRule: {
        include: { fromUnit: true, toUnit: true },
      },
      category: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 50,
  });

  const templates = await prisma.seoTemplate.findMany({
    orderBy: [{ categorySlug: "asc" }, { templateType: "asc" }],
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">SEO Pages Manager</h1>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">SEO Templates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">Category</th>
                <th className="py-2 pr-4 font-medium">Type</th>
                <th className="py-2 font-medium">Template</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <tr key={tpl.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-2 pr-4">
                    <Badge variant="secondary">
                      {tpl.categorySlug === "__global__" ? "Global" : tpl.categorySlug}
                    </Badge>
                  </td>
                  <td className="py-2 pr-4 font-medium">{tpl.templateType}</td>
                  <td className="py-2 text-xs text-muted-foreground max-w-md truncate">
                    {tpl.template}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-4">Page Overrides ({seoPages.length})</h2>
        {seoPages.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No custom page overrides yet. Conversion pages will use the default templates above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 pr-4 font-medium">Page</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Custom Title</th>
                  <th className="py-2 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {seoPages.map((page) => (
                  <tr key={page.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-2 pr-4">
                      {page.conversionRule
                        ? `${page.conversionRule.fromUnit.name} → ${page.conversionRule.toUnit.name}`
                        : page.category?.name || "Unknown"}
                    </td>
                    <td className="py-2 pr-4">
                      <Badge variant="secondary">{page.pageType}</Badge>
                    </td>
                    <td className="py-2 pr-4 text-xs text-muted-foreground truncate max-w-xs">
                      {page.customTitle || "—"}
                    </td>
                    <td className="py-2 text-xs text-muted-foreground">
                      {page.updatedAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
