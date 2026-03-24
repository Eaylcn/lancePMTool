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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GenreSelect } from "@/components/shared/genre-select";
import { useCreateGame } from "@/hooks/use-games";

interface AddGameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddGameDialog({ open, onOpenChange }: AddGameDialogProps) {
  const t = useTranslations("library");
  const createGame = useCreateGame();

  const [title, setTitle] = useState("");
  const [studio, setStudio] = useState("");
  const [genre, setGenre] = useState<string[]>([]);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("playing");

  const handleSubmit = async () => {
    if (!title.trim()) return;

    await createGame.mutateAsync({
      title: title.trim(),
      studio: studio.trim() || undefined,
      genre,
      platform: platform || undefined,
      status,
    });

    // Reset & close
    setTitle("");
    setStudio("");
    setGenre([]);
    setPlatform("");
    setStatus("playing");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("addGame")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("gameTitle")} *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("gameTitlePlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studio">{t("studio")}</Label>
            <Input
              id="studio"
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
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder={t("selectPlatform")} />
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
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
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
          <Button onClick={handleSubmit} disabled={!title.trim() || createGame.isPending}>
            {createGame.isPending ? "..." : t("addGame")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
