"use client";

import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { BenchmarkComparison } from "@/lib/metrics/types";

interface MetricBenchmarksProps {
  comparisons: BenchmarkComparison[];
  genre: string;
}

const METRIC_LABELS: Record<string, string> = {
  d1Retention: "D1 Retention",
  d7Retention: "D7 Retention",
  d30Retention: "D30 Retention",
  stickiness: "Stickiness",
  arpdau: "ARPDAU",
  sessionLength: "Session Length",
  sessionsPerDay: "Sessions/Day",
  cpi: "CPI",
};

export function MetricBenchmarks({ comparisons, genre }: MetricBenchmarksProps) {
  const t = useTranslations("metrics.benchmarks");

  if (comparisons.length === 0) {
    return (
      <Card className="p-6 text-center">
        <BarChart3 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">{t("noBenchmarks")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-sm">
          {t("title")} ({genre})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-2 px-2 font-medium text-muted-foreground">
                {t("metric")}
              </th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                {t("yourValue")}
              </th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                {t("genreBenchmark")}
              </th>
              <th className="text-center py-2 px-2 font-medium text-muted-foreground">
                {t("status")}
              </th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.metric} className="border-b border-border/30">
                <td className="py-2 px-2 font-medium">
                  {METRIC_LABELS[c.metric] || c.metric}
                </td>
                <td className="py-2 px-2 text-center font-mono">
                  {formatValue(c.metric, c.value)}
                </td>
                <td className="py-2 px-2 text-center text-xs text-muted-foreground">
                  <span className="text-red-400">{formatBenchmark(c.metric, c.benchmark.low)}</span>
                  {" / "}
                  <span className="text-yellow-400">{formatBenchmark(c.metric, c.benchmark.mid)}</span>
                  {" / "}
                  <span className="text-emerald-400">{formatBenchmark(c.metric, c.benchmark.high)}</span>
                </td>
                <td className="py-2 px-2 text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === "above"
                        ? "bg-emerald-500/20 text-emerald-500"
                        : c.status === "at"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {t(c.status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function formatValue(metric: string, value: number): string {
  if (metric === "arpdau" || metric === "cpi") return `$${value}`;
  if (metric === "sessionLength") return `${value}s`;
  if (metric.includes("Retention") || metric === "stickiness") return `${value}%`;
  return String(value);
}

function formatBenchmark(metric: string, value: number): string {
  if (metric === "arpdau" || metric === "cpi") return `$${value}`;
  if (metric === "sessionLength") return `${value}s`;
  if (metric.includes("Retention") || metric === "stickiness") return `${value}%`;
  return String(value);
}
