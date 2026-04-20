import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingPremiumCard } from "@/components/landing/landing-premium-card";
import { LandingHeroPreview } from "@/components/landing/landing-hero-preview";
import {
  Gamepad2,
  Brain,
  TrendingUp,
  MessageSquare,
  BarChart3,
  User,
  ArrowRight,
  ClipboardList,
  BookOpen,
  Sparkles,
  Crown,
  Check,
  FileText,
  Rocket,
} from "lucide-react";

const features = [
  { icon: Gamepad2, key: "analysis", accent: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { icon: Brain, key: "ai", accent: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  { icon: TrendingUp, key: "growth", accent: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { icon: MessageSquare, key: "interview", accent: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  { icon: BarChart3, key: "metrics", accent: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
  { icon: User, key: "portfolio", accent: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
] as const;

const stats = [
  { value: "28", key: "surveyQuestions", icon: ClipboardList },
  { value: "7", key: "interviewTopics", icon: MessageSquare },
  { value: "8", key: "guideChapters", icon: BookOpen },
  { value: "50+", key: "analysisFields", icon: Gamepad2 },
] as const;

const howSteps = [
  { icon: FileText, key: "analyze" },
  { icon: Brain, key: "feedback" },
  { icon: Rocket, key: "grow" },
] as const;

const premiumFeatures = [
  "premiumFeat1",
  "premiumFeat2",
  "premiumFeat3",
  "premiumFeat4",
] as const;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <LandingContent />;
}

function LandingContent() {
  const t = useTranslations("landing");

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Ambient background layers */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[700px] bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] bg-gradient-to-b from-primary/8 via-transparent to-transparent blur-3xl" />

      {/* Grid pattern overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] dark:opacity-[0.025] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:64px_64px]" />

      {/* Floating pill nav */}
      <div className="sticky top-4 z-50 w-full px-4">
        <nav className="mx-auto max-w-3xl rounded-full border border-border/60 bg-background/70 backdrop-blur-xl shadow-lg shadow-black/5">
          <div className="flex items-center justify-between h-12 pl-4 pr-2">
            <Link href="/" className="flex items-center gap-2">
              <img src="/icon.svg" alt="Lance" className="h-6 w-6 shrink-0" />
              <span className="text-sm font-bold tracking-tight">Lance</span>
            </Link>

            <div className="flex items-center gap-1">
              <Link
                href="/#premium"
                className="hidden sm:inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                <Crown className="h-3 w-3 text-amber-500" />
                {t("nav.premium")}
              </Link>
              <Link
                href="/#how"
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {t("nav.how")}
              </Link>
              <Link
                href="/survey"
                className="hidden sm:inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
              >
                {t("nav.survey")}
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="rounded-full gap-1.5 h-8 px-3.5 text-xs shadow-sm"
                >
                  {t("hero.cta")}
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-24 sm:pt-20 sm:pb-32">
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-16 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary backdrop-blur mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                AI-Powered Gaming PM Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/50 bg-clip-text text-transparent">
                  {t("hero.title")}
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0">
                {t("hero.subtitle")}
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3">
                <Link href="/login">
                  <Button size="lg" className="gap-2 text-base px-7 h-12 shadow-xl shadow-primary/25">
                    {t("hero.cta")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/survey">
                  <Button variant="outline" size="lg" className="gap-2 text-base px-7 h-12 bg-background/80 backdrop-blur">
                    <ClipboardList className="h-4 w-4" />
                    {t("hero.trySurvey")}
                  </Button>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-xs text-muted-foreground">
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span>{t("hero.freeNotice")}</span>
              </div>
            </div>

            <div className="relative">
              <LandingHeroPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="relative">
        <div className="mx-auto max-w-4xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-widest mb-3">
            <span className="h-px w-6 bg-primary/40" />
            {t("how.tag")}
            <span className="h-px w-6 bg-primary/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("how.sectionTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            {t("how.sectionSubtitle")}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {howSteps.map(({ icon: Icon, key }, i) => (
            <div key={key} className="relative">
              <Card className="border-border/60 h-full">
                <CardContent className="pt-6 text-center">
                  <div className="relative inline-flex flex-col items-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-background border shadow-sm mb-4">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[11px] font-bold shadow">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="font-semibold text-base mb-1.5">
                    {t(`how.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`how.${key}.description`)}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-4 py-20 sm:py-24">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-widest mb-3">
            <span className="h-px w-6 bg-primary/40" />
            {t("features.tag")}
            <span className="h-px w-6 bg-primary/40" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("features.sectionTitle")}
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            {t("features.sectionSubtitle")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, key, accent }) => (
            <Card
              key={key}
              className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5 border-border/60"
            >
              <CardContent className="pt-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accent} mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2 text-base">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`features.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative">
        <div className="mx-auto max-w-5xl px-4">
          <div className="rounded-2xl border border-border/60 bg-muted/30 backdrop-blur">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border/60">
              {stats.map(({ value, key, icon: Icon }) => (
                <div key={key} className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-8 w-8 rounded-lg bg-primary/10 mb-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                    {value}
                  </div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mt-1">
                    {t(`stats.${key}`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="relative mx-auto max-w-5xl px-4 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-background p-8 sm:p-12">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-amber-400/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            <div className="lg:col-span-3 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-600 dark:text-amber-400">
                <Crown className="h-3 w-3" />
                {t("premium.badge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {t("premium.sectionTitle")}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("premium.sectionDescription")}
              </p>

              <ul className="space-y-2 pt-2">
                {premiumFeatures.map((key) => (
                  <li key={key} className="flex items-start gap-2.5">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm text-foreground/90">
                      {t(`premium.${key}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-2">
              <LandingPremiumCard />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative">
        <div className="relative mx-auto max-w-3xl px-4 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-6">
            <Sparkles className="h-3 w-3" />
            {t("finalCta.tag")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("finalCta.title")}
          </h2>
          <p className="text-muted-foreground mt-3 mb-8 max-w-xl mx-auto">
            {t("finalCta.subtitle")}
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-xl shadow-primary/25">
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 py-10 bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <img src="/icon.svg" alt="Lance" className="h-5 w-5 shrink-0" />
              <span className="font-medium text-foreground">Lance</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{t("footer.tagline")}</span>
            </div>
            <p className="text-xs">{t("footer.builtWith")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
