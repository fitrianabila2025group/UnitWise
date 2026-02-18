import prisma from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightLeft, Tags, FileText, HelpCircle, Users } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [conversionCount, categoryCount, unitCount, faqCount, userCount] =
    await Promise.all([
      prisma.conversionRule.count(),
      prisma.category.count(),
      prisma.unit.count(),
      prisma.fAQ.count(),
      prisma.user.count(),
    ]);

  const stats = [
    { label: "Conversions", value: conversionCount, icon: ArrowRightLeft },
    { label: "Categories", value: categoryCount, icon: Tags },
    { label: "Units", value: unitCount, icon: FileText },
    { label: "FAQs", value: faqCount, icon: HelpCircle },
    { label: "Users", value: userCount, icon: Users },
  ];

  const recentLogs = await prisma.auditLog.findMany({
    include: { user: { select: { email: true } } },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentLogs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 text-sm">
                  <span className="text-muted-foreground text-xs whitespace-nowrap">
                    {log.createdAt.toLocaleDateString()}
                  </span>
                  <span className="font-medium">{log.user.email}</span>
                  <span className="text-muted-foreground">{log.action}</span>
                  <span>{log.entity}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
