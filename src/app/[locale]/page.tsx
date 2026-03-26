import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Download,
  GraduationCap,
  Briefcase,
  Repeat,
} from "lucide-react";

const features = [
  { icon: Gamepad2, key: "analysis" },
  { icon: Brain, key: "ai" },
  { icon: TrendingUp, key: "growth" },
  { icon: MessageSquare, key: "interview" },
  { icon: BarChart3, key: "metrics" },
  { icon: User, key: "portfolio" },
] as const;

const stats = [
  { value: "28", key: "surveyQuestions", icon: ClipboardList },
  { value: "7", key: "interviewTopics", icon: MessageSquare },
  { value: "8", key: "guideChapters", icon: BookOpen },
  { value: "50+", key: "analysisFields", icon: Gamepad2 },
] as const;

const useCases = [
  { key: "candidate", icon: GraduationCap },
  { key: "switcher", icon: Repeat },
  { key: "interviewer", icon: Briefcase },
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
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-6xl flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">Lance</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/survey">
              <Button variant="ghost" size="sm">{t("nav.survey")}</Button>
            </Link>
            <Link href="/login">
              <Button size="sm">{t("hero.cta")}</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-accent/3 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(var(--primary-rgb,59,130,246),0.08),transparent_50%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-24 sm:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm text-primary mb-6">
            <Zap className="h-3.5 w-3.5" />
            AI-Powered Gaming PM Platform
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            {t("hero.title")}
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base px-8">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/survey">
              <Button variant="outline" size="lg" className="gap-2 text-base px-8">
                <ClipboardList className="h-4 w-4" />
                {t("hero.trySurvey")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">{t("features.sectionTitle")}</h2>
          <p className="text-muted-foreground mt-2">{t("features.sectionSubtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, key }) => (
            <Card
              key={key}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
            >
              <CardContent className="pt-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold mb-2">
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
      <section className="border-y border-border/40 bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ value, key, icon: Icon }) => (
              <div key={key} className="text-center space-y-2">
                <div className="inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 mb-1">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{value}</div>
                <p className="text-sm text-muted-foreground">{t(`stats.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">{t("useCases.sectionTitle")}</h2>
          <p className="text-muted-foreground mt-2">{t("useCases.sectionSubtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {useCases.map(({ key, icon: Icon }) => (
            <Card key={key} className="border-border/60">
              <CardContent className="pt-6 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{t(`useCases.${key}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`useCases.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-accent/3 to-transparent" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">{t("finalCta.title")}</h2>
          <p className="text-muted-foreground mt-3 mb-8">{t("finalCta.subtitle")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="gap-2 text-base px-8">
                {t("hero.cta")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="font-medium">Lance</span>
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
