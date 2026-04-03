"use client";

import { use, useState } from "react";
import { useLocale } from "next-intl";
import { Loader2, ClipboardList, CheckCircle, XCircle } from "lucide-react";
import { usePublicSurvey, useSubmitPublicSurvey } from "@/hooks/use-public-survey";
import { PublicSurveyForm } from "@/components/surveys/public-survey-form";
import type { SurveyQuestion } from "@/lib/types/survey";

export default function PublicSurveyTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const locale = useLocale() as "tr" | "en";
  const { data, isLoading, error } = usePublicSurvey(token);
  const submitSurvey = useSubmitPublicSurvey(token);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (
    responses: Record<string, unknown>,
    metadata: { completionTimeSeconds: number; locale: string }
  ) => {
    try {
      await submitSurvey.mutateAsync({
        responses,
        metadata: {
          ...metadata,
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
        },
      });
      setSubmitted(true);
    } catch {
      // error displayed below
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Not found
  if (error || !data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold">
            {locale === "tr" ? "Anket Bulunamadı" : "Survey Not Found"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "tr"
              ? "Bu anket mevcut değil veya kaldırılmış olabilir."
              : "This survey doesn't exist or may have been removed."}
          </p>
        </div>
      </div>
    );
  }

  // Expired / Closed
  if (data.expired) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10">
            <ClipboardList className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-2xl font-bold">{data.survey.title}</h1>
          <p className="text-muted-foreground">
            {locale === "tr"
              ? "Bu anket artık yanıt kabul etmiyor."
              : "This survey is no longer accepting responses."}
          </p>
        </div>
      </div>
    );
  }

  // Submitted — Thank you
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold">
            {locale === "tr" ? "Teşekkürler!" : "Thank You!"}
          </h1>
          <p className="text-muted-foreground">
            {locale === "tr"
              ? "Yanıtınız başarıyla kaydedildi. Katkınız için teşekkür ederiz."
              : "Your response has been recorded successfully. Thank you for your contribution."}
          </p>
        </div>
      </div>
    );
  }

  // Active survey form
  const survey = data.survey;
  const questions = (survey.questions || []) as SurveyQuestion[];
  const settings = (survey.settings || {}) as { showProgressBar?: boolean };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* Survey header */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-primary/10">
          <ClipboardList className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">{survey.title}</h1>
        {survey.description && (
          <p className="text-sm text-muted-foreground max-w-md mx-auto">{survey.description}</p>
        )}
      </div>

      {/* Error message */}
      {submitSurvey.isError && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3 mb-4">
          <p className="text-sm text-red-500">
            {submitSurvey.error?.message ||
              (locale === "tr" ? "Bir hata oluştu. Lütfen tekrar deneyin." : "An error occurred. Please try again.")}
          </p>
        </div>
      )}

      {/* Form */}
      <PublicSurveyForm
        questions={questions}
        showProgressBar={settings.showProgressBar !== false}
        onSubmit={handleSubmit}
        isSubmitting={submitSurvey.isPending}
      />
    </div>
  );
}
