import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminInternalLinksPage() {
  const linkBlocks = await prisma.internalLinkBlock.findMany({
    orderBy: [{ pageSlug: "asc" }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Internal Links Manager</h1>
        <Badge variant="secondary">{linkBlocks.length} blocks</Badge>
      </div>

      {linkBlocks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No internal link blocks configured yet. Internal links are auto-generated from related conversions on each page.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">Page Slug</th>
                <th className="py-2 pr-4 font-medium">Block Type</th>
                <th className="py-2 font-medium">Links</th>
              </tr>
            </thead>
            <tbody>
              {linkBlocks.map((block) => (
                <tr key={block.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-2 pr-4 font-mono text-xs">{block.pageSlug}</td>
                  <td className="py-2 pr-4">
                    <Badge variant="secondary">{block.blockType}</Badge>
                  </td>
                  <td className="py-2 text-xs text-muted-foreground truncate max-w-xs">
                    {block.linksJson}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
