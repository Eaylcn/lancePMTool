import {
  Gamepad2,
  Sparkles,
  TrendingUp,
  Star,
  Brain,
  Check,
} from "lucide-react";

export function LandingHeroPreview() {
  return (
    <div className="relative mx-auto max-w-md lg:max-w-none">
      {/* Floating background orbs */}
      <div className="pointer-events-none absolute -top-10 -right-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-10 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />

      {/* Main card */}
      <div className="relative rounded-2xl border bg-background/80 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-purple-500 to-amber-400" />

        {/* Header */}
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 text-white">
              <Gamepad2 className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-semibold leading-tight">Clash Royale</p>
              <p className="text-[11px] text-muted-foreground">Supercell · PvP Strategy</p>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2 py-0.5">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">8.5</span>
          </div>
        </div>

        {/* Category bars */}
        <div className="p-4 space-y-2.5">
          <CategoryBar label="FTUE" value={85} color="bg-emerald-500" />
          <CategoryBar label="Core Loop" value={92} color="bg-blue-500" />
          <CategoryBar label="Monetization" value={68} color="bg-amber-500" />
          <CategoryBar label="Retention" value={78} color="bg-purple-500" />
        </div>

        {/* AI insight footer */}
        <div className="p-4 border-t border-border/60 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="flex items-start gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
              <Brain className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-medium text-primary mb-0.5 uppercase tracking-wide">
                AI Insight
              </p>
              <p className="text-xs text-foreground/80 leading-relaxed">
                Core loop derinliği mükemmel. Elixir yönetimi PM seviyesini
                ortaya çıkaran kritik bir mekanik.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating mini-cards */}
      <div className="absolute -left-4 sm:-left-8 top-20 hidden sm:flex items-center gap-2 rounded-xl border bg-background/90 backdrop-blur-xl shadow-xl px-3 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-500">
          <TrendingUp className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground leading-tight">PM Level</p>
          <p className="text-xs font-bold">Mid PM</p>
        </div>
      </div>

      <div className="absolute -right-4 sm:-right-8 bottom-8 hidden sm:flex items-center gap-2 rounded-xl border bg-background/90 backdrop-blur-xl shadow-xl px-3 py-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground leading-tight">Analizler</p>
          <p className="text-xs font-bold">12 oyun</p>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 hidden sm:flex items-center gap-1.5 rounded-full border bg-background/90 backdrop-blur-xl shadow-lg px-3 py-1.5">
        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-2.5 w-2.5 text-emerald-500" />
        </div>
        <span className="text-[10px] font-medium">AI Analiz Tamamlandı</span>
      </div>
    </div>
  );
}

function CategoryBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <span className="text-[11px] font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
