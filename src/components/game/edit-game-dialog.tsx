"use client";

import { useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenreSelect } from "@/components/shared/genre-select";
import { useUpdateGame } from "@/hooks/use-games";

interface EditGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  game: {
    id: string;
    title: string;
    studio: string | null;
    genre: string[];
    platform: string | null;
    status: string | null;
  };
}

export function EditGameDialog({ open, onOpenChange, game }: EditGameDialogProps) {
  const t = useTranslations("library");
  const updateGame = useUpdateGame();

  const [title, setTitle] = useState(game.title);
  const [studio, setStudio] = useState(game.studio || "");
  const [genre, setGenre] = useState<string[]>(Array.isArray(game.genre) ? game.genre : []);
  const [platform, setPlatform] = useState(game.platform || "");
  const [status, setStatus] = useState(game.status || "playing");

  useEffect(() => {
    if (open) {
      setTitle(game.title);
      setStudio(game.studio || "");
      setGenre(Array.isArray(game.genre) ? game.genre : []);
      setPlatform(game.platform || "");
      setStatus(game.status || "playing");
    }
  }, [open, game]);

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await updateGame.mutateAsync({
      id: game.id,
      title: title.trim(),
      studio: studio.trim() || undefined,
      genre,
      platform: platform || undefined,
      status,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("editGame")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">{t("gameTitle")} *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("gameTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-studio">{t("studio")}</Label>
            <Input
              id="edit-studio"
              value={studio}
              onChange={(e) => setStudio(e.target.value)}
              placeholder={t("studioPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("genre")}</Label>
            <GenreSelect value={genre} onChange={setGenre} />
          </div>

          <div className="space-y-2">
            <Label>{t("platform")}</Label>
            <Select value={platform} onValueChange={(v) => setPlatform(v ?? "")}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectPlatform")}>
                  {(v: string | null) => {
                    if (!v) return t("selectPlatform");
                    const labels: Record<string, string> = { ios: "iOS", android: "Android", both: t("bothPlatforms") };
                    return labels[v] ?? t("selectPlatform");
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ios">iOS</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="both">{t("bothPlatforms")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t("gameStatus")}</Label>
            <Select value={status} onValueChange={(v) => setStatus(v ?? "playing")}>
              <SelectTrigger>
                <SelectValue>
                  {(v: string | null) => {
                    const labels: Record<string, string> = { playing: t("status.playing"), completed: t("status.completed"), dropped: t("status.dropped") };
                    return labels[v ?? "playing"] ?? t("status.playing");
                  }}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="playing">{t("status.playing")}</SelectItem>
                <SelectItem value="completed">{t("status.completed")}</SelectItem>
                <SelectItem value="dropped">{t("status.dropped")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={!title.trim() || updateGame.isPending}>
            {updateGame.isPending ? "..." : t("editGame")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
