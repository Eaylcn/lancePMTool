"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Gamepad2 } from "lucide-react";

interface GameListItemProps {
  game: {
    id: string;
    title: string;
    studio: string | null;
    genre: string[];
    platform: string | null;
    status: string | null;
    overallRating: string | null;
    coverImageUrl: string | null;
    createdAt: string;
  };
}

const statusDots: Record<string, string> = {
  playing: "bg-emerald-500",
  completed: "bg-blue-500",
  dropped: "bg-red-500",
};

export function GameListItem({ game }: GameListItemProps) {
  const tGenre = useTranslations("genres");
  const tLib = useTranslations("library");
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : null;
  const ratingColor = rating !== null
    ? rating >= 7 ? "text-emerald-500" : rating >= 4 ? "text-yellow-500" : "text-red-500"
    : "";

  return (
    <Link href={`/game/${game.id}`}>
      <div className="flex items-center gap-3 rounded-lg border border-border p-2.5 transition-colors duration-150 hover:bg-muted/50 hover:border-primary/20 cursor-pointer">
        {/* Thumbnail */}
        <div className="h-12 w-16 rounded-md bg-muted overflow-hidden shrink-0">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <Gamepad2 className="h-4 w-4 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {game.status && (
              <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${statusDots[game.status] || "bg-gray-400"}`} />
            )}
            <h3 className="text-sm font-medium truncate">{game.title}</h3>
          </div>
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {[
              game.studio,
              genres.slice(0, 2).map((g) => { try { return tGenre(g); } catch { return g; } }).join(", "),
            ].filter(Boolean).join(" · ")}
          </p>
        </div>

        {/* Status */}
        {game.status && (
          <span className="text-xs text-muted-foreground shrink-0 hidden md:inline">
            {tLib(`status.${game.status}`)}
          </span>
        )}

        {/* Rating */}
        {rating !== null && (
          <span className={`text-sm font-semibold tabular-nums shrink-0 ${ratingColor}`}>
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    </Link>
  );
}
