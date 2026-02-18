import prisma from "@/lib/db";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminFaqsPage() {
  const faqs = await prisma.fAQ.findMany({
    include: { category: true },
    orderBy: [{ category: { sortOrder: "asc" } }, { sortOrder: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">FAQ Manager</h1>
        <Badge variant="secondary">{faqs.length} total</Badge>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{faq.question}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                <div className="flex gap-2 mt-2">
                  {faq.category && (
                    <Badge variant="secondary">{faq.category.name}</Badge>
                  )}
                  {faq.conversionSlug && (
                    <Badge variant="outline">{faq.conversionSlug}</Badge>
                  )}
                  {!faq.published && (
                    <Badge variant="destructive">Draft</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
