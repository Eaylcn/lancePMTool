"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { BookOpen, ChevronRight, CheckCircle } from "lucide-react";
import { PM_GUIDE } from "@/lib/constants/pm-guide";
import { GuideChapterView } from "@/components/guide/guide-chapter";

const STORAGE_KEY = "gamelens_guide_progress";

function getProgress(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function markRead(chapterId: string) {
  const progress = getProgress();
  if (!progress.includes(chapterId)) {
    progress.push(chapterId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
  return progress;
}

export default function GuidePage() {
  const t = useTranslations("guide");
  const locale = useLocale() as "tr" | "en";
  const [activeChapter, setActiveChapter] = useState(0);
  const [readChapters, setReadChapters] = useState<string[]>([]);

  useEffect(() => {
    setReadChapters(getProgress());
  }, []);

  // Mark chapter as read when viewing
  useEffect(() => {
    const chapter = PM_GUIDE[activeChapter];
    if (chapter) {
      const updated = markRead(chapter.id);
      setReadChapters(updated);
    }
  }, [activeChapter]);

  const progressPercent = Math.round((readChapters.length / PM_GUIDE.length) * 100);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb,59,130,246),0.08),transparent_60%)]" />
        <div className="relative px-6 py-8 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
              <p className="text-sm text-muted-foreground mt-1">{t("subtitle")}</p>
              {/* Progress bar */}
              <div className="mt-4 max-w-xs">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{t("progress", { current: readChapters.length, total: PM_GUIDE.length })}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar — chapter list */}
        <div className="lg:w-64 shrink-0">
          <div className="lg:sticky lg:top-4 space-y-1">
            {PM_GUIDE.map((chapter, i) => {
              const isActive = i === activeChapter;
              const isRead = readChapters.includes(chapter.id);
              return (
                <button
                  key={chapter.id}
                  onClick={() => setActiveChapter(i)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  {isRead ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <div className="h-3.5 w-3.5 rounded-full border border-muted-foreground/30 shrink-0" />
                  )}
                  <span className="truncate">{chapter.title[locale]}</span>
                  {isActive && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <GuideChapterView chapter={PM_GUIDE[activeChapter]} />
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setActiveChapter((i) => Math.max(0, i - 1))}
              disabled={activeChapter === 0}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-default transition-colors"
            >
              ← {activeChapter > 0 ? PM_GUIDE[activeChapter - 1].title[locale] : ""}
            </button>
            <button
              onClick={() => setActiveChapter((i) => Math.min(PM_GUIDE.length - 1, i + 1))}
              disabled={activeChapter === PM_GUIDE.length - 1}
              className="text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-default transition-colors"
            >
              {activeChapter < PM_GUIDE.length - 1 ? PM_GUIDE[activeChapter + 1].title[locale] : ""} →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
