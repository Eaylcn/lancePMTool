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

const statusColors: Record<string, string> = {
  playing: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  dropped: "bg-red-500/10 text-red-500 border-red-500/20",
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

  const handleDelete = async () => {
    await deleteGame.mutateAsync(game.id);
    router.push("/library");
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Cover */}
        <div className="h-40 w-40 rounded-xl bg-muted flex items-center justify-center shrink-0">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover rounded-xl" />
          ) : (
            <Gamepad2 className="h-16 w-16 text-muted-foreground/20" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{game.title}</h1>
              {game.studio && (
                <p className="text-muted-foreground mt-1">{game.studio}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
                <Pencil className="h-3.5 w-3.5" />
                {t("edit")}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="h-3.5 w-3.5" />
                {t("delete")}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {genres.map((genre) => (
              <Badge key={genre} variant="secondary">{tGenre(genre)}</Badge>
            ))}
            {game.platform && (
              <Badge variant="outline">{game.platform === "both" ? "iOS & Android" : game.platform.toUpperCase()}</Badge>
            )}
            {game.status && (
              <Badge variant="outline" className={statusColors[game.status] || ""}>
                {tLib(`status.${game.status}`)}
              </Badge>
            )}
          </div>

          {game.overallRating && (
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="text-2xl font-bold">{parseFloat(game.overallRating).toFixed(1)}</span>
              <span className="text-muted-foreground">/ 10</span>
            </div>
          )}
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
