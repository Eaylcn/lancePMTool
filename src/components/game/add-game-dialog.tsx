"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenreSelect } from "@/components/shared/genre-select";
import { useCreateGame } from "@/hooks/use-games";
import {
  Gamepad2,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Monitor,
  Layers,
  Loader2,
} from "lucide-react";

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PLATFORMS = [
  { value: "ios", label: "iOS", icon: Smartphone },
  { value: "android", label: "Android", icon: Monitor },
  { value: "both", labelKey: "bothPlatforms", icon: Layers },
] as const;

const STATUSES = ["playing", "completed", "dropped"] as const;

const statusColors: Record<string, string> = {
  playing: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  completed: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
  dropped: "border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400",
};

export function AddGameDialog({ open, onOpenChange }: AddGameDialogProps) {
  const t = useTranslations("library");
  const createGame = useCreateGame();

  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [studio, setStudio] = useState("");
  const [genre, setGenre] = useState<string[]>([]);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("playing");

  const resetForm = () => {
    setStep(1);
    setTitle("");
    setStudio("");
    setGenre([]);
    setPlatform("");
    setStatus("playing");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return;
    await createGame.mutateAsync({
      title: title.trim(),
      studio: studio.trim() || undefined,
      genre,
      platform: platform || undefined,
      status,
    });
    resetForm();
    onOpenChange(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) resetForm();
    onOpenChange(o);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg overflow-hidden p-0">
        {/* Progress header */}
        <div className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-transparent px-6 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              {t("addGame")}
            </DialogTitle>
          </DialogHeader>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className="flex-1 h-1 rounded-full overflow-hidden bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{step}/2</span>
          </div>
        </div>

        {/* Step content */}
        <div className="px-6 py-4 min-h-[260px]">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">{t("step1Description") || "Oyun hakkında temel bilgileri gir."}</p>

              <div className="space-y-2">
                <Label htmlFor="title">{t("gameTitle")} *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("gameTitlePlaceholder")}
                  className="h-11"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studio">{t("studio")}</Label>
                <Input
                  id="studio"
                  value={studio}
                  onChange={(e) => setStudio(e.target.value)}
                  placeholder={t("studioPlaceholder")}
                  className="h-11"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-xs text-muted-foreground">{t("step2Description") || "Tür, platform ve durumu seç."}</p>

              {/* Genre */}
              <div className="space-y-2">
                <Label>{t("genre")}</Label>
                <GenreSelect value={genre} onChange={setGenre} />
              </div>

              {/* Platform — visual buttons */}
              <div className="space-y-2">
                <Label>{t("platform")}</Label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((p) => {
                    const Icon = p.icon;
                    const displayLabel = "labelKey" in p ? t(p.labelKey) : p.label;
                    return (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-lg border py-3 text-xs font-medium transition-all ${
                        platform === p.value
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/30 text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {displayLabel}
                    </button>
                    );
                  })}
                </div>
              </div>

              {/* Status — visual chips */}
              <div className="space-y-2">
                <Label>{t("gameStatus")}</Label>
                <div className="flex gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      className={`flex-1 rounded-lg border py-2.5 text-xs font-medium transition-all ${
                        status === s
                          ? statusColors[s]
                          : "border-border hover:border-primary/20 text-muted-foreground"
                      }`}
                    >
                      {t(`status.${s}`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 pb-5 gap-2">
          {step === 1 ? (
            <>
              <Button variant="outline" size="sm" onClick={() => handleClose(false)}>
                {t("cancel")}
              </Button>
              <Button
                size="sm"
                onClick={() => setStep(2)}
                disabled={!title.trim()}
                className="gap-1.5"
              >
                {t("next") || "İleri"}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("back") || "Geri"}
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={createGame.isPending}
                className="gap-1.5"
              >
                {createGame.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Gamepad2 className="h-3.5 w-3.5" />
                )}
                {t("addGame")}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
