"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Star } from "lucide-react";

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

const statusColors: Record<string, string> = {
  playing: "bg-emerald-500/10 text-emerald-500",
  completed: "bg-blue-500/10 text-blue-500",
  dropped: "bg-red-500/10 text-red-500",
};

export function GameListItem({ game }: GameListItemProps) {
  const t = useTranslations("genres");
  const tLib = useTranslations("library");
  const genres = Array.isArray(game.genre) ? game.genre : [];

  return (
    <Link href={`/game/${game.id}`}>
      <div className="flex items-center gap-4 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
        {/* Thumbnail */}
        <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center shrink-0">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover rounded-md" />
          ) : (
            <Gamepad2 className="h-5 w-5 text-muted-foreground/30" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-medium truncate">{game.title}</h3>
            {game.studio && (
              <span className="text-xs text-muted-foreground hidden sm:inline">• {game.studio}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">
                {t(genre)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Rating */}
        {game.overallRating && (
          <div className="flex items-center gap-1 shrink-0">
            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{parseFloat(game.overallRating).toFixed(1)}</span>
          </div>
        )}

        {/* Status */}
        {game.status && (
          <Badge variant="outline" className={`text-[10px] shrink-0 ${statusColors[game.status] || ""}`}>
            {tLib(`status.${game.status}`)}
          </Badge>
        )}
      </div>
    </Link>
  );
}
