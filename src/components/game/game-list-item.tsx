"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
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

const statusDotColors: Record<string, string> = {
  playing: "bg-emerald-400",
  completed: "bg-blue-400",
  dropped: "bg-red-400",
};

export function GameListItem({ game }: GameListItemProps) {
  const tGenre = useTranslations("genres");
  const tLib = useTranslations("library");
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : null;
  const ratingColor = rating !== null
    ? rating >= 7 ? "text-emerald-500 bg-emerald-500/10" : rating >= 4 ? "text-yellow-500 bg-yellow-500/10" : "text-red-500 bg-red-500/10"
    : "";

  return (
    <Link href={`/game/${game.id}`}>
      <div className="flex items-center gap-4 rounded-xl border border-border/50 p-3 transition-all duration-200 hover:bg-muted/40 hover:border-primary/20 cursor-pointer group">
        {/* Thumbnail */}
        <div className="h-14 w-20 rounded-lg bg-muted overflow-hidden shrink-0 relative">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-accent/10 flex items-center justify-center">
              <Gamepad2 className="h-5 w-5 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {game.status && (
              <div className={`h-2 w-2 rounded-full shrink-0 ${statusDotColors[game.status] || "bg-gray-400"}`} />
            )}
            <h3 className="font-medium truncate group-hover:text-primary transition-colors">{game.title}</h3>
            {game.studio && (
              <span className="text-xs text-muted-foreground hidden sm:inline">• {game.studio}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                {tGenre(genre)}
              </Badge>
            ))}
            {genres.length > 3 && (
              <span className="text-[10px] text-muted-foreground">+{genres.length - 3}</span>
            )}
          </div>
        </div>

        {/* Rating */}
        {rating !== null && (
          <div className={`shrink-0 flex items-center justify-center h-8 px-2.5 rounded-lg text-xs font-bold ${ratingColor}`}>
            {rating.toFixed(1)}
          </div>
        )}

        {/* Status text */}
        {game.status && (
          <span className="text-[11px] text-muted-foreground shrink-0 hidden md:inline">
            {tLib(`status.${game.status}`)}
          </span>
        )}
      </div>
    </Link>
  );
}
