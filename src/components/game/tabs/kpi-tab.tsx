"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, Area, AreaChart,
} from "recharts";
import { Download, DollarSign, Users, Star, TrendingUp, Hash } from "lucide-react";

interface KpiTabProps {
  kpis: Array<{
    id: string;
    period: string | null;
    downloads: number | null;
    revenue: string | null;
    dau: number | null;
    mau: number | null;
    rating: string | null;
    chartPosition: number | null;
  }>;
}

function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-4 w-4" />
        </div>
        {trend && (
          <TrendingUp
            className={`h-3.5 w-3.5 ${
              trend === "up" ? "text-emerald-500" : trend === "down" ? "text-red-500 rotate-180" : "text-muted-foreground"
            }`}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <p className="text-xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

function getTrend(values: (number | null)[]): "up" | "down" | "neutral" {
  const nums = values.filter((v): v is number => v != null && v > 0);
  if (nums.length < 2) return "neutral";
  return nums[nums.length - 1] > nums[0] ? "up" : nums[nums.length - 1] < nums[0] ? "down" : "neutral";
}

export function KpiTab({ kpis }: KpiTabProps) {
  const t = useTranslations("game");

  if (!kpis || kpis.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">{t("noKpis")}</p>
      </div>
    );
  }

  const chartData = kpis.map((k) => ({
    period: k.period || "—",
    downloads: k.downloads || 0,
    revenue: Number(k.revenue) || 0,
    dau: k.dau || 0,
    mau: k.mau || 0,
    rating: Number(k.rating) || 0,
    chartPosition: k.chartPosition || 0,
  }));

  // Latest KPI for summary cards
  const latest = kpis[kpis.length - 1];

  const summaryCards = [
    latest.downloads != null && {
      icon: Download,
      label: t("kpiDownloads"),
      value: latest.downloads.toLocaleString(),
      trend: getTrend(kpis.map((k) => k.downloads)),
      color: "bg-blue-500/10 text-blue-500",
    },
    latest.revenue != null && {
      icon: DollarSign,
      label: t("kpiRevenue"),
      value: `$${Number(latest.revenue).toLocaleString()}`,
      trend: getTrend(kpis.map((k) => Number(k.revenue) || null)),
      color: "bg-emerald-500/10 text-emerald-500",
    },
    latest.dau != null && {
      icon: Users,
      label: "DAU",
      value: latest.dau.toLocaleString(),
      trend: getTrend(kpis.map((k) => k.dau)),
      color: "bg-violet-500/10 text-violet-500",
    },
    latest.mau != null && {
      icon: Users,
      label: "MAU",
      value: latest.mau.toLocaleString(),
      trend: getTrend(kpis.map((k) => k.mau)),
      color: "bg-orange-500/10 text-orange-500",
    },
    latest.rating != null && {
      icon: Star,
      label: t("kpiRating"),
      value: Number(latest.rating).toFixed(1),
      trend: getTrend(kpis.map((k) => Number(k.rating) || null)),
      color: "bg-yellow-500/10 text-yellow-500",
    },
    latest.chartPosition != null && {
      icon: Hash,
      label: t("kpiChartPosition"),
      value: `#${latest.chartPosition}`,
      trend: getTrend(kpis.map((k) => k.chartPosition ? -k.chartPosition : null)),
      color: "bg-pink-500/10 text-pink-500",
    },
  ].filter(Boolean) as Array<{
    icon: React.ElementType;
    label: string;
    value: string;
    trend: "up" | "down" | "neutral";
    color: string;
  }>;

  return (
    <div className="space-y-6">
      {/* Summary metric cards */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <MetricCard key={card.label} {...card} />
        ))}
      </div>

      {/* Period breakdown */}
      {kpis.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => (
            <div key={k.id} className="rounded-xl border border-border p-4 space-y-2">
              <p className="text-sm font-semibold">{k.period || "—"}</p>
              <div className="space-y-1">
                {k.downloads != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("kpiDownloads")}</span>
                    <span className="font-medium">{k.downloads.toLocaleString()}</span>
                  </div>
                )}
                {k.revenue != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("kpiRevenue")}</span>
                    <span className="font-medium">${Number(k.revenue).toLocaleString()}</span>
                  </div>
                )}
                {k.dau != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">DAU</span>
                    <span className="font-medium">{k.dau.toLocaleString()}</span>
                  </div>
                )}
                {k.mau != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">MAU</span>
                    <span className="font-medium">{k.mau.toLocaleString()}</span>
                  </div>
                )}
                {k.rating != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("kpiRating")}</span>
                    <span className="font-medium flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {Number(k.rating).toFixed(1)}
                    </span>
                  </div>
                )}
                {k.chartPosition != null && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{t("kpiChartPosition")}</span>
                    <span className="font-medium">#{k.chartPosition}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {chartData.length > 1 && (
        <>
          {/* Downloads & Revenue */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                {t("downloadsRevenue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="downloads" fill="hsl(var(--primary))" name={t("kpiDownloads")} radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill="hsl(142 71% 45%)" name={t("kpiRevenue")} radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* DAU/MAU Area Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                DAU / MAU
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="dauGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="mauGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(25 95% 53%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(25 95% 53%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="dau" stroke="hsl(var(--primary))" fill="url(#dauGrad)" name="DAU" strokeWidth={2} />
                    <Area type="monotone" dataKey="mau" stroke="hsl(25 95% 53%)" fill="url(#mauGrad)" name="MAU" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
