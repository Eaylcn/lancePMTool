"use client";

import { useTranslations } from "next-intl";
import {
  ArrowDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
  RefreshCw,
  Trophy,
  Clock,
  Wifi,
  WifiOff,
  Battery,
  Gauge,
  HardDrive,
} from "lucide-react";

// ============================================
// FTUE — Funnel Visualization
// ============================================
const FTUE_STEPS = [
  { key: "download", color: "bg-blue-500" },
  { key: "firstOpen", color: "bg-indigo-500" },
  { key: "tutorial", color: "bg-violet-500" },
  { key: "completion", color: "bg-emerald-500" },
];

export function FtueVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.ftue");
  const duration = analysis.ftueDuration ? String(analysis.ftueDuration) : null;
  const frictionPoints = analysis.ftueFrictionPoints ? String(analysis.ftueFrictionPoints) : null;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>

      {/* Funnel */}
      <div className="flex items-center gap-2">
        {FTUE_STEPS.map((step, i) => (
          <div key={step.key} className="flex items-center gap-2 flex-1">
            <div className="flex-1 space-y-1">
              <div
                className={`${step.color} rounded-md h-8 flex items-center justify-center`}
                style={{ opacity: 1 - i * 0.15 }}
              >
                <span className="text-[10px] font-medium text-white">{t(step.key)}</span>
              </div>
            </div>
            {i < FTUE_STEPS.length - 1 && (
              <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 rotate-[-90deg]" />
            )}
          </div>
        ))}
      </div>

      {/* Duration + Friction */}
      <div className="grid grid-cols-2 gap-3">
        {duration && (
          <div className="rounded-lg bg-muted/30 px-3 py-2">
            <p className="text-[10px] text-muted-foreground uppercase">{t("duration")}</p>
            <p className="text-sm font-medium mt-0.5">{duration}</p>
          </div>
        )}
        {frictionPoints && (
          <div className="rounded-lg bg-red-500/5 border border-red-500/10 px-3 py-2">
            <p className="text-[10px] text-red-500 uppercase">{t("frictionPoints")}</p>
            <p className="text-xs mt-0.5 text-muted-foreground">{frictionPoints}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Core Loop — Cycle Diagram
// ============================================
export function CoreLoopVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.coreLoop");
  const loopDef = analysis.coreLoopDefinition ? String(analysis.coreLoopDefinition) : "";
  const sessionLength = analysis.coreLoopSessionLength ? String(analysis.coreLoopSessionLength) : null;

  // Extract loop steps from definition (split by → or , or ;)
  const steps = loopDef
    .split(/[→➜\->]+|,\s*(?=[A-ZÇĞİÖŞÜa-z])/)
    .map(s => s.trim())
    .filter(s => s.length > 0 && s.length < 50)
    .slice(0, 6);

  const loopColors = [
    "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
    "border-violet-500/40 bg-violet-500/10 text-violet-600 dark:text-violet-400",
    "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
    "border-cyan-500/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>

      {steps.length > 1 ? (
        <div className="flex flex-wrap items-center gap-2">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className={`rounded-lg border px-3 py-2 text-xs font-medium ${loopColors[i % loopColors.length]}`}>
                {step}
              </div>
              {i < steps.length - 1 && (
                <RefreshCw className="h-3 w-3 text-muted-foreground/40" />
              )}
              {i === steps.length - 1 && steps.length > 2 && (
                <div className="text-xs text-muted-foreground/40">↻</div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{loopDef}</p>
      )}

      {sessionLength && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">{t("sessionLength")}</p>
            <p className="text-sm font-medium">{sessionLength}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Monetization — Channel Bars
// ============================================
const MONETIZATION_CHANNELS = [
  { key: "monetizationIap", labelKey: "iap", color: "bg-emerald-500" },
  { key: "monetizationAds", labelKey: "ads", color: "bg-blue-500" },
  { key: "monetizationBattlePass", labelKey: "battlePass", color: "bg-violet-500" },
  { key: "monetizationVip", labelKey: "vip", color: "bg-amber-500" },
];

export function MonetizationVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.monetization");
  const model = analysis.monetizationModel ? String(analysis.monetizationModel) : null;

  // Score channels by content length as a rough importance proxy
  const channels = MONETIZATION_CHANNELS.map(ch => ({
    ...ch,
    value: analysis[ch.key] ? String(analysis[ch.key]) : "",
    hasContent: !!analysis[ch.key] && String(analysis[ch.key]).length > 5,
  })).filter(ch => ch.hasContent);

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>
        {model && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
            {model.length > 30 ? model.slice(0, 30) + "…" : model}
          </span>
        )}
      </div>

      {channels.length > 0 ? (
        <div className="space-y-3">
          {channels.map((ch) => (
            <div key={ch.key} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{t(ch.labelKey)}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${ch.color} transition-all`}
                  style={{ width: `${Math.min(100, 40 + ch.value.length / 3)}%` }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2">{ch.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("noData")}</p>
      )}
    </div>
  );
}

// ============================================
// Retention — Mechanics Checklist
// ============================================
const RETENTION_MECHANICS = [
  { key: "retentionRewards", labelKey: "dailyRewards", icon: Trophy },
  { key: "retentionStreak", labelKey: "streaks", icon: Zap },
  { key: "retentionSocial", labelKey: "social", icon: RefreshCw },
  { key: "retentionFomo", labelKey: "fomo", icon: AlertTriangle },
  { key: "retentionEnergy", labelKey: "energy", icon: Battery },
  { key: "retentionNotifications", labelKey: "notifications", icon: Clock },
];

export function RetentionVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.retention");

  const mechanics = RETENTION_MECHANICS.map(m => ({
    ...m,
    value: analysis[m.key] ? String(analysis[m.key]) : "",
    active: !!analysis[m.key] && String(analysis[m.key]).length > 5,
  }));

  const activeCount = mechanics.filter(m => m.active).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>
        <span className="text-xs text-muted-foreground">{activeCount}/{mechanics.length} {t("active")}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {mechanics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className={`rounded-lg border p-3 text-center space-y-1.5 transition-colors ${
                m.active
                  ? "border-emerald-500/30 bg-emerald-500/5"
                  : "border-border bg-muted/20 opacity-50"
              }`}
            >
              <Icon className={`h-4 w-4 mx-auto ${m.active ? "text-emerald-500" : "text-muted-foreground/40"}`} />
              <p className="text-[10px] font-medium">{t(m.labelKey)}</p>
              {m.active && (
                <CheckCircle2 className="h-3 w-3 mx-auto text-emerald-500" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// UX/UI — Checklist Score Cards
// ============================================
const UX_AREAS = [
  { key: "uxMenu", labelKey: "menu" },
  { key: "uxButtons", labelKey: "buttons" },
  { key: "uxHud", labelKey: "hud" },
  { key: "uxLoading", labelKey: "loading" },
  { key: "uxAccessibility", labelKey: "accessibility" },
];

export function UxVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.ux");
  const rating = Number(analysis.uxRating) || 0;

  const areas = UX_AREAS.map(a => ({
    ...a,
    value: analysis[a.key] ? String(analysis[a.key]) : "",
    filled: !!analysis[a.key] && String(analysis[a.key]).length > 5,
  }));

  const filledCount = areas.filter(a => a.filled).length;

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>
        {rating > 0 && (
          <div className="flex items-center gap-1.5">
            <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
            <span className={`text-sm font-bold tabular-nums ${
              rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
            }`}>
              {rating.toFixed(1)}/10
            </span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {areas.map((area) => (
          <div
            key={area.key}
            className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
          >
            {area.filled ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            ) : (
              <XCircle className="h-4 w-4 text-muted-foreground/30 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{t(area.labelKey)}</p>
              {area.filled && (
                <p className="text-[11px] text-muted-foreground line-clamp-1">{area.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <span className="text-xs text-muted-foreground">{filledCount}/{areas.length} {t("reviewed")}</span>
      </div>
    </div>
  );
}

// ============================================
// Meta Game — Progress Axes
// ============================================
export function MetaVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.meta");
  const systems = analysis.metaSystems ? String(analysis.metaSystems) : "";
  const longTerm = analysis.metaLongTerm ? String(analysis.metaLongTerm) : "";
  const rating = Number(analysis.metaRating) || 0;

  // Try to extract progression axes from systems text
  const axes = systems
    .split(/[,;•\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 3 && s.length < 60)
    .slice(0, 5);

  const axisColors = [
    "bg-blue-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>

      {axes.length > 1 ? (
        <div className="space-y-2.5">
          {axes.map((axis, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{axis}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${axisColors[i % axisColors.length]} transition-all`}
                  style={{ width: `${60 + Math.random() * 30}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : systems ? (
        <p className="text-sm text-muted-foreground">{systems}</p>
      ) : null}

      {longTerm && (
        <div className="rounded-lg bg-muted/30 px-3 py-2">
          <p className="text-[10px] text-muted-foreground uppercase">{t("longTermMotivation")}</p>
          <p className="text-xs mt-0.5">{longTerm}</p>
        </div>
      )}

      {rating > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <Trophy className={`h-4 w-4 ${rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"}`} />
          <span className={`text-sm font-bold tabular-nums ${
            rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
          }`}>
            {rating.toFixed(1)}/10
          </span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Technical — Performance Gauges
// ============================================
const TECH_METRICS = [
  { key: "techLoadTime", labelKey: "loadTime", icon: Clock },
  { key: "techFps", labelKey: "fps", icon: Gauge },
  { key: "techBattery", labelKey: "battery", icon: Battery },
  { key: "techSize", labelKey: "appSize", icon: HardDrive },
];

export function TechVisual({ analysis }: { analysis: Record<string, unknown> }) {
  const t = useTranslations("game.visuals.tech");
  const offline = analysis.techOffline ? String(analysis.techOffline) : null;
  const rating = Number(analysis.techRating) || 0;

  const metrics = TECH_METRICS.map(m => ({
    ...m,
    value: analysis[m.key] ? String(analysis[m.key]) : "",
    filled: !!analysis[m.key] && String(analysis[m.key]).length > 2,
  }));

  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t("title")}</h4>
        {rating > 0 && (
          <span className={`text-sm font-bold tabular-nums ${
            rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
          }`}>
            {rating.toFixed(1)}/10
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.key}
              className={`rounded-lg border p-3 space-y-1.5 ${
                m.filled ? "border-border" : "border-border/50 opacity-50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase">{t(m.labelKey)}</span>
              </div>
              <p className="text-sm font-medium line-clamp-2">{m.filled ? m.value : "—"}</p>
            </div>
          );
        })}
      </div>

      {/* Offline support */}
      {offline && (
        <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
          {offline.toLowerCase().includes("yok") || offline.toLowerCase().includes("no")
            ? <WifiOff className="h-3.5 w-3.5 text-red-500" />
            : <Wifi className="h-3.5 w-3.5 text-emerald-500" />
          }
          <div>
            <p className="text-[10px] text-muted-foreground uppercase">{t("offline")}</p>
            <p className="text-xs">{offline}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Visual Renderer — picks the right visual by categoryKey
// ============================================
export function CategoryVisual({ categoryKey, analysis }: { categoryKey: string; analysis: Record<string, unknown> }) {
  switch (categoryKey) {
    case "ftue":
      return <FtueVisual analysis={analysis} />;
    case "coreLoop":
      return <CoreLoopVisual analysis={analysis} />;
    case "monetization":
      return <MonetizationVisual analysis={analysis} />;
    case "retention":
      return <RetentionVisual analysis={analysis} />;
    case "ux":
      return <UxVisual analysis={analysis} />;
    case "meta":
      return <MetaVisual analysis={analysis} />;
    case "tech":
      return <TechVisual analysis={analysis} />;
    case "metaTech":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <MetaVisual analysis={analysis} />
          <TechVisual analysis={analysis} />
        </div>
      );
    default:
      return null;
  }
}
