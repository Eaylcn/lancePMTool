"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { useCreateSurvey } from "@/hooks/use-surveys";
import { useGames } from "@/hooks/use-games";
import type { SurveyTemplate, SurveyQuestion, QuestionType } from "@/lib/types/survey";

interface SurveyCreateDialogProps {
  open: boolean;
  onClose: () => void;
  template?: SurveyTemplate | null;
  onCreated?: (surveyId: string, shareToken: string) => void;
}

export function SurveyCreateDialog({ open, onClose, template, onCreated }: SurveyCreateDialogProps) {
  const t = useTranslations("surveys");
  const locale = useLocale() as "tr" | "en";
  const createSurvey = useCreateSurvey();
  const { data: gamesData = [] } = useGames();

  const [title, setTitle] = useState(template ? template.title[locale] : "");
  const [description, setDescription] = useState(template ? template.description[locale] : "");
  const [gameId, setGameId] = useState<string>("");
  const [expiresAt, setExpiresAt] = useState("");
  const [maxResponses, setMaxResponses] = useState<string>("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>(
    template ? [...template.questions] : []
  );
  const [step, setStep] = useState<"details" | "questions">("details");

  const gamesList = (gamesData as { id: string; title: string }[]) || [];

  const handleAddQuestion = () => {
    const newQ: SurveyQuestion = {
      id: `custom_${Date.now()}`,
      type: "single",
      question: { tr: "", en: "" },
      options: [
        { value: "a", label: { tr: "", en: "" } },
        { value: "b", label: { tr: "", en: "" } },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, value: string) => {
    const updated = [...questions];
    if (field === "text") {
      updated[index] = { ...updated[index], question: { ...updated[index].question, [locale]: value } };
    } else if (field === "type") {
      const newType = value as QuestionType;
      updated[index] = {
        ...updated[index],
        type: newType,
        options: newType === "single" || newType === "multiple"
          ? updated[index].options || [
              { value: "a", label: { tr: "", en: "" } },
              { value: "b", label: { tr: "", en: "" } },
            ]
          : undefined,
        scaleMin: newType === "scale" ? 1 : undefined,
        scaleMax: newType === "scale" ? 5 : undefined,
        scaleLabels: newType === "scale"
          ? { min: { tr: "Min", en: "Min" }, max: { tr: "Max", en: "Max" } }
          : undefined,
      };
    }
    setQuestions(updated);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    opts[oIndex] = { ...opts[oIndex], label: { ...opts[oIndex].label, [locale]: value } };
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  const handleAddOption = (qIndex: number) => {
    const updated = [...questions];
    const opts = [...(updated[qIndex].options || [])];
    const nextVal = String.fromCharCode(97 + opts.length);
    opts.push({ value: nextVal, label: { tr: "", en: "" } });
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  const handleSubmit = async () => {
    if (!title.trim() || questions.length === 0) return;

    try {
      const result = await createSurvey.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        gameId: gameId || null,
        templateType: template?.type || null,
        questions,
        settings: {
          allowAnonymous: true,
          showProgressBar: true,
          ...(maxResponses ? { maxResponses: parseInt(maxResponses) } : {}),
        },
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      });
      onCreated?.(result.id, result.shareToken);
      onClose();
    } catch {
      // error handled by mutation
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-border bg-background p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">
            {template ? t("create.fromTemplate") : t("create.manual")}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {step === "details" ? (
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-sm font-medium">{t("create.title")}</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("create.titlePlaceholder")}
                className="mt-1"
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-sm font-medium">{t("create.description")}</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("create.descriptionPlaceholder")}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Game selector */}
            <div>
              <label className="text-sm font-medium">{t("create.game")}</label>
              <select
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t("create.noGame")}</option>
                {gamesList.map((g) => (
                  <option key={g.id} value={g.id}>{g.title}</option>
                ))}
              </select>
            </div>

            {/* Expiration */}
            <div>
              <label className="text-sm font-medium">{t("create.expiresAt")}</label>
              <Input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Max responses */}
            <div>
              <label className="text-sm font-medium">{t("create.maxResponses")}</label>
              <Input
                type="number"
                value={maxResponses}
                onChange={(e) => setMaxResponses(e.target.value)}
                placeholder={t("create.unlimited")}
                className="mt-1"
                min={1}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>{t("create.cancel")}</Button>
              <Button onClick={() => setStep("questions")}>{t("create.nextQuestions")}</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Questions editor */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {questions.length} {t("templates.questions")}
              </p>
              <Button variant="outline" size="sm" onClick={handleAddQuestion} className="gap-1">
                <Plus className="h-3.5 w-3.5" />
                {t("create.addQuestion")}
              </Button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
              {questions.map((q, i) => (
                <div key={q.id} className="rounded-lg border border-border bg-card p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-medium text-muted-foreground">#{i + 1}</span>
                    <div className="flex items-center gap-2">
                      <select
                        value={q.type}
                        onChange={(e) => handleQuestionChange(i, "type", e.target.value)}
                        className="text-xs rounded border border-border bg-background px-2 py-1"
                      >
                        <option value="single">{t("create.typeSingle")}</option>
                        <option value="multiple">{t("create.typeMultiple")}</option>
                        <option value="scale">{t("create.typeScale")}</option>
                        <option value="text">{t("create.typeText")}</option>
                      </select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveQuestion(i)}
                        className="h-6 w-6 p-0 text-red-500"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <Input
                    value={q.question[locale] || ""}
                    onChange={(e) => handleQuestionChange(i, "text", e.target.value)}
                    placeholder={t("create.questionPlaceholder")}
                    className="text-sm"
                  />

                  {(q.type === "single" || q.type === "multiple") && q.options && (
                    <div className="space-y-1.5 pl-2">
                      {q.options.map((opt, oi) => (
                        <Input
                          key={opt.value}
                          value={opt.label[locale] || ""}
                          onChange={(e) => handleOptionChange(i, oi, e.target.value)}
                          placeholder={`${t("create.option")} ${oi + 1}`}
                          className="text-xs h-8"
                        />
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddOption(i)}
                        className="text-xs h-6"
                      >
                        + {t("create.addOption")}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep("details")}>
                {t("create.back")}
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createSurvey.isPending || !title.trim() || questions.length === 0}
                className="gap-1.5"
              >
                {createSurvey.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : null}
                {t("create.createSurvey")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
