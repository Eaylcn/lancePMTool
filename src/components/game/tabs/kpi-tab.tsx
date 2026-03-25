"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line,
} from "recharts";

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
  }));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">
                {k.period || "—"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              {k.downloads != null && <p>Downloads: <strong>{k.downloads.toLocaleString()}</strong></p>}
              {k.revenue != null && <p>Revenue: <strong>${Number(k.revenue).toLocaleString()}</strong></p>}
              {k.dau != null && <p>DAU: <strong>{k.dau.toLocaleString()}</strong></p>}
              {k.mau != null && <p>MAU: <strong>{k.mau.toLocaleString()}</strong></p>}
              {k.rating != null && <p>Rating: <strong>{Number(k.rating).toFixed(1)}</strong></p>}
              {k.chartPosition != null && <p>Chart: <strong>#{k.chartPosition}</strong></p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      {chartData.length > 1 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("downloadsRevenue")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="downloads" fill="hsl(var(--primary))" name="Downloads" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenue" fill="hsl(var(--accent))" name="Revenue" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">DAU / MAU</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="dau" stroke="hsl(var(--primary))" name="DAU" strokeWidth={2} />
                    <Line type="monotone" dataKey="mau" stroke="hsl(var(--accent))" name="MAU" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
