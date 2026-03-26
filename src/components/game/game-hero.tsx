"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, Pencil, Trash2 } from "lucide-react";
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
    isTemplate?: boolean | null;
  };
  computedRating?: number | null;
}

const statusStyles: Record<string, { bg: string; text: string }> = {
  playing: { bg: "bg-emerald-500/15 border-emerald-500/30", text: "text-emerald-400" },
  completed: { bg: "bg-blue-500/15 border-blue-500/30", text: "text-blue-400" },
  dropped: { bg: "bg-red-500/15 border-red-500/30", text: "text-red-400" },
};

function CircularRating({ rating }: { rating: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const progress = (rating / 10) * circumference;
  const color =
    rating >= 7 ? "stroke-emerald-500" : rating >= 4 ? "stroke-yellow-500" : "stroke-red-500";
  const textColor =
    rating >= 7 ? "fill-emerald-500" : rating >= 4 ? "fill-yellow-500" : "fill-red-500";

  return (
    <svg className="h-16 w-16" viewBox="0 0 64 64">
      <circle
        cx="32" cy="32" r={radius}
        fill="none"
        className="stroke-muted"
        strokeWidth="4"
      />
      <circle
        cx="32" cy="32" r={radius}
        fill="none"
        className={color}
        strokeWidth="4"
        strokeDasharray={circumference}
        strokeDashoffset={circumference - progress}
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
        style={{ transition: "stroke-dashoffset 0.7s ease" }}
      />
      <text x="32" y="30" textAnchor="middle" dominantBaseline="middle" className={`${textColor} text-[15px] font-bold`}>
        {rating.toFixed(1)}
      </text>
      <text x="32" y="44" textAnchor="middle" className="fill-muted-foreground text-[8px]">
        /10
      </text>
    </svg>
  );
}

export function GameHero({ game, computedRating }: GameHeroProps) {
  const t = useTranslations("game");
  const tGenre = useTranslations("genres");
  const tLib = useTranslations("library");
  const router = useRouter();
  const deleteGame = useDeleteGame();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : (computedRating ?? null);

  const handleDelete = async () => {
    await deleteGame.mutateAsync(game.id);
    router.push("/library");
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10 bg-card">
        {/* Accent bar */}
        <div className="h-1 bg-gradient-to-r from-primary/80 via-accent/60 to-primary/80" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Cover */}
            <div className="h-52 w-36 sm:h-56 sm:w-40 rounded-lg overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/10 shrink-0">
              {game.coverImageUrl ? (
                <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-muted">
                  <Gamepad2 className="h-12 w-12 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col justify-between min-h-0">
              <div>
                {/* Title + actions */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{game.title}</h1>
                      {game.isTemplate && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-dashed border-primary/40 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          <BookOpen className="h-3 w-3" />
                          {tLib("templateBadge")}
                        </span>
                      )}
                    </div>
                    {game.studio && (
                      <p className="text-muted-foreground mt-1">{game.studio}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditOpen(true)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Tags row */}
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {game.status && (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[game.status]?.bg || ""} ${statusStyles[game.status]?.text || ""}`}>
                      {tLib(`status.${game.status}`)}
                    </span>
                  )}
                  {genres.map((g) => (
                    <span key={g} className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {(() => { try { return tGenre(g); } catch { return g; } })()}
                    </span>
                  ))}
                  {game.platform && (
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                      {game.platform === "both" ? "iOS & Android" : game.platform.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div className="mt-4 sm:mt-auto pt-4">
                {rating !== null && <CircularRating rating={rating} />}
              </div>
            </div>
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
