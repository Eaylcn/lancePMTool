"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Mail, Check, Copy, ExternalLink } from "lucide-react";

const PREMIUM_EMAIL = "eaylcn@gmail.com";

export function LandingPremiumCard() {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("landing.premium");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PREMIUM_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const subject = encodeURIComponent(t("mailSubject"));
  const body = encodeURIComponent(t("mailBody"));
  const mailto = `mailto:${PREMIUM_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-background/60 backdrop-blur-xl p-5 shadow-xl">
      <div className="absolute -top-8 -right-8 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />

      <div className="relative space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
            <Mail className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              {t("contactLabel")}
            </p>
            <p className="text-sm font-semibold">{t("contactTitle")}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {t("contactDescription")}
        </p>

        <button
          onClick={copy}
          className="group flex items-center gap-2 w-full rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 text-xs font-mono hover:bg-muted/50 transition-colors"
        >
          <Mail className="h-3.5 w-3.5 text-amber-500 shrink-0" />
          <span className="flex-1 text-left truncate">{PREMIUM_EMAIL}</span>
          {copied ? (
            <span className="flex items-center gap-1 text-emerald-500 text-[11px] font-sans">
              <Check className="h-3 w-3" />
              {t("copied")}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-muted-foreground text-[11px] font-sans group-hover:text-foreground transition-colors">
              <Copy className="h-3 w-3" />
              {t("copy")}
            </span>
          )}
        </button>

        <a
          href={mailto}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-white text-sm font-medium px-4 py-2.5 transition-opacity shadow"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("sendMail")}
        </a>
      </div>
    </div>
  );
}
