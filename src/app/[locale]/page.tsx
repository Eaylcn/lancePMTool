import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LandingPremiumCard } from "@/components/landing/landing-premium-card";
import {
  Zap,
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
} from "lucide-react";

const features = [
  { icon: Gamepad2, key: "analysis", accent: "from-blue-500/10 to-blue-500/0 text-blue-500 border-blue-500/20" },
  { icon: Brain, key: "ai", accent: "from-purple-500/10 to-purple-500/0 text-purple-500 border-purple-500/20" },
  { icon: TrendingUp, key: "growth", accent: "from-emerald-500/10 to-emerald-500/0 text-emerald-500 border-emerald-500/20" },
  { icon: MessageSquare, key: "interview", accent: "from-orange-500/10 to-orange-500/0 text-orange-500 border-orange-500/20" },
  { icon: BarChart3, key: "metrics", accent: "from-pink-500/10 to-pink-500/0 text-pink-500 border-pink-500/20" },
  { icon: User, key: "portfolio", accent: "from-indigo-500/10 to-indigo-500/0 text-indigo-500 border-indigo-500/20" },
] as const;

const stats = [
  { value: "28", key: "surveyQuestions", icon: ClipboardList },
  { value: "7", key: "interviewTopics", icon: MessageSquare },
  { value: "8", key: "guideChapters", icon: BookOpen },
  { value: "50+", key: "analysisFields", icon: Gamepad2 },
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
      {/* Ambient background */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] bg-gradient-to-b from-primary/10 via-purple-500/5 to-transparent blur-3xl" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl sticky top-0">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-500 shadow">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Lance</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/#premium" className="hidden sm:inline-flex">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <Crown className="h-3.5 w-3.5 text-amber-500" />
                {t("nav.premium")}
              </Button>
            </Link>
            <Link href="/survey">
              <Button variant="ghost" size="sm">{t("nav.survey")}</Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-1.5">
                {t("hero.cta")}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative">
        <div className="relative mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary mb-6 backdrop-blur">
            <Sparkles className="h-3 w-3" />
            AI-Powered Gaming PM Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/60 bg-clip-text text-transparent">
              {t("hero.title")}
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/survey">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8 h-12 bg-background/80 backdrop-blur">
                <ClipboardList className="h-4 w-4" />
                {t("hero.trySurvey")}
              </Button>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            {t("hero.freeNotice")}
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary uppercase tracking-widest mb-2">
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
              <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${accent.split(" ")[0]} ${accent.split(" ")[1]} opacity-50`} />
              <CardContent className="relative pt-6">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${accent.split(" ").slice(2).join(" ")} bg-background mb-4 transition-transform group-hover:scale-110`}>
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

      {/* Stats */}
      <section className="relative border-y border-border/40 bg-muted/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, key, icon: Icon }) => (
              <div key={key} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 mb-1">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent">
                  {value}
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t(`stats.${key}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section id="premium" className="relative mx-auto max-w-5xl px-4 py-20">
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
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("finalCta.title")}
          </h2>
          <p className="text-muted-foreground mt-3 mb-8 max-w-xl mx-auto">
            {t("finalCta.subtitle")}
          </p>
          <Link href="/login">
            <Button size="lg" className="gap-2 text-base px-8 h-12 shadow-lg shadow-primary/20">
              {t("hero.cta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-border/40 py-8 bg-background/50 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-primary to-purple-500">
                <Zap className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-foreground">Lance</span>
              <span className="text-muted-foreground/50">·</span>
              <span>{t("footer.tagline")}</span>
            </div>
            <p>{t("footer.builtWith")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
