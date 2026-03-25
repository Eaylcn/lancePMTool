"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Gamepad2 } from "lucide-react";

interface GameCardProps {
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
  playing: "text-emerald-500",
  completed: "text-blue-500",
  dropped: "text-red-500",
};

const statusDots: Record<string, string> = {
  playing: "bg-emerald-500",
  completed: "bg-blue-500",
  dropped: "bg-red-500",
};

export function GameCard({ game }: GameCardProps) {
  const tGenre = useTranslations("genres");
  const tLib = useTranslations("library");
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : null;
  const ratingColor = rating !== null
    ? rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
    : "";

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group overflow-hidden rounded-lg border border-border bg-card cursor-pointer transition-colors duration-150 hover:border-primary/30 hover:bg-muted/50">
        {/* Cover image */}
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-muted">
              <Gamepad2 className="h-10 w-10 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-sm leading-tight line-clamp-1">
              {game.title}
            </h3>
            {rating !== null && (
              <span className={`text-sm font-semibold tabular-nums shrink-0 ${ratingColor}`}>
                {rating.toFixed(1)}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground truncate">
            {[
              game.studio,
              genres.slice(0, 2).map((g) => { try { return tGenre(g); } catch { return g; } }).join(", "),
            ].filter(Boolean).join(" · ")}
          </p>

          {game.status && (
            <div className="flex items-center gap-1.5">
              <div className={`h-1.5 w-1.5 rounded-full ${statusDots[game.status] || "bg-gray-400"}`} />
              <span className={`text-xs ${statusColors[game.status] || "text-muted-foreground"}`}>
                {tLib(`status.${game.status}`)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
