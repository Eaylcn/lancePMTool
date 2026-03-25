"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { BarChart3, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PortfolioLayoutProps {
  children: React.ReactNode;
}

export function PortfolioLayout({ children }: PortfolioLayoutProps) {
  const t = useTranslations("portfolio");
  const locale = useLocale();

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href={`/${locale}/login`} className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">GameLens</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href={`/${locale}/login`}>
              <Button variant="outline" size="sm">
                <LogIn className="h-3.5 w-3.5 mr-1.5" />
                {t("signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            {t("poweredBy")}
          </p>
        </div>
      </footer>
    </div>
  );
}
