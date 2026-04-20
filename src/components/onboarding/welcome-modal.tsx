"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Sparkles,
  Gamepad2,
  Brain,
  TrendingUp,
  Crown,
  Mail,
  Check,
  ArrowRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "lance_welcomed_v1";
const PREMIUM_EMAIL = "eaylcn@gmail.com";

export function WelcomeModal() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const t = useTranslations("welcome");

  useEffect(() => {
    try {
      const flag = localStorage.getItem(STORAGE_KEY);
      if (!flag) {
        const timer = setTimeout(() => setOpen(true), 400);
        return () => clearTimeout(timer);
      }
    } catch {
      // localStorage unavailable — skip
    }
  }, []);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PREMIUM_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-lg">
              <Sparkles className="h-5 w-5" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-background animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-lg">{t("title")}</DialogTitle>
              <DialogDescription>{t("subtitle")}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t("intro")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <FeatureTile icon={Gamepad2} label={t("feature.analyze")} />
            <FeatureTile icon={Brain} label={t("feature.ai")} />
            <FeatureTile icon={TrendingUp} label={t("feature.growth")} />
          </div>

          <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent p-4">
            <div className="absolute -top-6 -right-6 h-20 w-20 rounded-full bg-amber-400/20 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-semibold">{t("premium.title")}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                {t("premium.description")}
              </p>
              <button
                onClick={copyEmail}
                className="group flex items-center gap-2 w-full rounded-lg border border-border/60 bg-background/60 backdrop-blur px-3 py-2 text-xs font-mono hover:bg-background transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span className="flex-1 text-left truncate">{PREMIUM_EMAIL}</span>
                {copied ? (
                  <span className="flex items-center gap-1 text-emerald-500 text-[11px]">
                    <Check className="h-3 w-3" />
                    {t("premium.copied")}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-[11px] group-hover:text-foreground transition-colors">
                    {t("premium.copy")}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={close} className="w-full gap-2" size="lg">
            {t("cta")}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FeatureTile({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 p-3 text-center">
      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <p className="text-[11px] font-medium leading-tight">{label}</p>
    </div>
  );
}
