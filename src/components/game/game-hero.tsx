"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gamepad2, Star, Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EditGameDialog } from "@/components/game/edit-game-dialog";
import { useDeleteGame } from "@/hooks/use-games";

interface GameHeroProps {
  game: {
    id: string;
    title: string;
    studio: string | null;
    genre: string[];
    platform: string | null;
    status: string | null;
    overallRating: string | null;
    coverImageUrl: string | null;
  };
}

const statusStyles: Record<string, { dot: string; text: string }> = {
  playing: { dot: "bg-emerald-400 shadow-emerald-400/50", text: "text-emerald-500" },
  completed: { dot: "bg-blue-400 shadow-blue-400/50", text: "text-blue-500" },
  dropped: { dot: "bg-red-400 shadow-red-400/50", text: "text-red-500" },
};

export function GameHero({ game }: GameHeroProps) {
  const t = useTranslations("game");
  const tGenre = useTranslations("genres");
  const tLib = useTranslations("library");
  const router = useRouter();
  const deleteGame = useDeleteGame();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : null;
  const ratingColor = rating !== null
    ? rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
    : "";

  const handleDelete = async () => {
    await deleteGame.mutateAsync(game.id);
    router.push("/library");
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/8 via-accent/5 to-transparent p-6 sm:p-8">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex flex-col sm:flex-row gap-6">
          {/* Cover */}
          <div className="h-52 w-40 rounded-xl bg-muted overflow-hidden shrink-0 shadow-xl shadow-primary/10 border border-white/10">
            {game.coverImageUrl ? (
              <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-primary/15 via-muted to-accent/15 flex items-center justify-center">
                <Gamepad2 className="h-14 w-14 text-muted-foreground/20" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">{game.title}</h1>
                {game.studio && (
                  <p className="text-muted-foreground">{game.studio}</p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
                  <Pencil className="h-3.5 w-3.5" />
                  {t("edit")}
                </Button>
                <Button variant="ghost" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                  <Trash2 className="h-3.5 w-3.5" />
                  {t("delete")}
                </Button>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {genres.map((genre) => (
                <Badge key={genre} className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15">
                  {tGenre(genre)}
                </Badge>
              ))}
              {game.platform && (
                <Badge variant="outline" className="border-border">
                  {game.platform === "both" ? "iOS & Android" : game.platform.toUpperCase()}
                </Badge>
              )}
              {game.status && (
                <div className="flex items-center gap-1.5">
                  <div className={`h-2 w-2 rounded-full shadow-[0_0_6px] ${statusStyles[game.status]?.dot || ""}`} />
                  <span className={`text-sm font-medium ${statusStyles[game.status]?.text || ""}`}>
                    {tLib(`status.${game.status}`)}
                  </span>
                </div>
              )}
            </div>

            {/* Rating */}
            {rating !== null && (
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-14 w-14 rounded-full border-2 border-current">
                  <span className={`text-xl font-bold ${ratingColor}`}>{rating.toFixed(1)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(rating / 2)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{t("overallRating")}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditGameDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        game={game}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={t("deleteConfirmTitle")}
        description={t("deleteConfirmDescription")}
        confirmLabel={t("delete")}
        onConfirm={handleDelete}
        loading={deleteGame.isPending}
      />
    </>
  );
}
