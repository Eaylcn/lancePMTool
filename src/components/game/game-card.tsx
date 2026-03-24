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

const statusDotColors: Record<string, string> = {
  playing: "bg-emerald-400 shadow-emerald-400/50",
  completed: "bg-blue-400 shadow-blue-400/50",
  dropped: "bg-red-400 shadow-red-400/50",
};

export function GameCard({ game }: GameCardProps) {
  const tGenre = useTranslations("genres");
  const genres = Array.isArray(game.genre) ? game.genre : [];
  const rating = game.overallRating ? parseFloat(game.overallRating) : null;
  const ratingColor = rating !== null
    ? rating >= 7 ? "bg-emerald-500" : rating >= 4 ? "bg-yellow-500" : "bg-red-500"
    : "";

  return (
    <Link href={`/game/${game.id}`}>
      <div className="group relative aspect-[16/10] overflow-hidden rounded-xl border border-border/50 bg-muted cursor-pointer transition-all duration-300 ease-out hover:shadow-xl hover:shadow-primary/10 hover:ring-1 hover:ring-primary/30 hover:-translate-y-1">
        {/* Cover image */}
        <div className="absolute inset-0 transition-transform duration-300 ease-out group-hover:scale-[1.05]">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-primary/10 via-muted to-accent/10 flex items-center justify-center">
              <Gamepad2 className="h-12 w-12 text-muted-foreground/20" />
            </div>
          )}
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Status dot — top left */}
        {game.status && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
            <div className={`h-2.5 w-2.5 rounded-full shadow-[0_0_8px] ${statusDotColors[game.status] || "bg-gray-400"}`} />
          </div>
        )}

        {/* Rating badge — top right */}
        {rating !== null && (
          <div className={`absolute top-3 right-3 z-10 flex items-center justify-center h-8 w-8 rounded-full ${ratingColor} text-white text-xs font-bold shadow-lg`}>
            {rating.toFixed(1)}
          </div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute inset-x-0 bottom-0 z-10 p-3.5 space-y-1.5">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1 drop-shadow-md">
            {game.title}
          </h3>
          {game.studio && (
            <p className="text-[11px] text-white/70 truncate drop-shadow-sm">
              {game.studio}
            </p>
          )}
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/90"
              >
                {tGenre(genre)}
              </span>
            ))}
            {genres.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-white/15 backdrop-blur-sm px-2 py-0.5 text-[10px] font-medium text-white/90">
                +{genres.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
