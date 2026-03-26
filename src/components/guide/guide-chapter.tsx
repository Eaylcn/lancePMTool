"use client";

import { useLocale } from "next-intl";
import { BookOpen } from "lucide-react";
import type { GuideChapter } from "@/lib/constants/pm-guide";
import { GuideQuizCard } from "./guide-quiz";

interface GuideChapterViewProps {
  chapter: GuideChapter;
}

export function GuideChapterView({ chapter }: GuideChapterViewProps) {
  const locale = useLocale() as "tr" | "en";

  return (
    <div className="space-y-8">
      {/* Chapter title */}
      <div>
        <h2 className="text-xl font-bold tracking-tight">{chapter.title[locale]}</h2>
      </div>

      {/* Sections */}
      {chapter.sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h3 className="text-base font-semibold text-primary">{section.title[locale]}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
            {section.content[locale]}
          </p>

          {/* Key Terms */}
          {section.keyTerms.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {section.keyTerms.map((kt, i) => (
                <div key={i} className="rounded-lg border border-border bg-muted/30 px-3 py-2">
                  <span className="text-xs font-semibold text-primary">{kt.term[locale]}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{kt.definition[locale]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Quiz */}
      {chapter.quiz.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">
              {locale === "tr" ? "Bilgi Testi" : "Knowledge Check"}
            </h3>
          </div>
          {chapter.quiz.map((q, i) => (
            <GuideQuizCard key={i} quiz={q} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
