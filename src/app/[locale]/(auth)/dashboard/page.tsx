import { getTranslations, setRequestLocale } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2, BarChart3, Star, TrendingUp } from "lucide-react";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const stats = [
    { icon: Gamepad2, label: t("totalGames"), value: "0", color: "text-primary" },
    { icon: BarChart3, label: t("totalAnalyses"), value: "0", color: "text-accent" },
    { icon: Star, label: t("avgScore"), value: "—", color: "text-yellow-500" },
    { icon: TrendingUp, label: t("pmLevel"), value: "Beginner", color: "text-emerald-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          {t("welcome", { name: "" })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Gamepad2 className="h-12 w-12 text-muted-foreground/40 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("noGames")}</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            {t("noGamesDescription")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
