"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Star } from "lucide-react";

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
  playing: "bg-emerald-500/10 text-emerald-500",
  completed: "bg-blue-500/10 text-blue-500",
  dropped: "bg-red-500/10 text-red-500",
};

export function GameCard({ game }: GameCardProps) {
  const t = useTranslations("genres");
  const tLib = useTranslations("library");
  const genres = Array.isArray(game.genre) ? game.genre : [];

  return (
    <Link href={`/game/${game.id}`}>
      <Card className="group relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 cursor-pointer h-full">
        {/* Cover placeholder */}
        <div className="h-32 bg-muted flex items-center justify-center">
          {game.coverImageUrl ? (
            <img src={game.coverImageUrl} alt={game.title} className="h-full w-full object-cover" />
          ) : (
            <Gamepad2 className="h-10 w-10 text-muted-foreground/30" />
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{game.title}</h3>
              {game.studio && (
                <p className="text-xs text-muted-foreground truncate">{game.studio}</p>
              )}
            </div>
            {game.overallRating && (
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium">{parseFloat(game.overallRating).toFixed(1)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="secondary" className="text-[10px] px-1.5 py-0">
                {t(genre)}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                +{genres.length - 3}
              </Badge>
            )}
          </div>

          {game.status && (
            <Badge variant="outline" className={`text-[10px] ${statusColors[game.status] || ""}`}>
              {tLib(`status.${game.status}`)}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
