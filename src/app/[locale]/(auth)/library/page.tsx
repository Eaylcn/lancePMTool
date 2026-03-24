"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Plus, LayoutGrid, List, Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGames } from "@/hooks/use-games";
import { GameCard } from "@/components/game/game-card";
import { GameListItem } from "@/components/game/game-list-item";
import { GameFilters } from "@/components/game/game-filters";
import { AddGameDialog } from "@/components/game/add-game-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { GridSkeleton, ListSkeleton } from "@/components/shared/loading-skeleton";

export default function LibraryPage() {
  const t = useTranslations("library");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("all");
  const [status, setStatus] = useState("all");
  const [platform, setPlatform] = useState("all");
  const [sort, setSort] = useState("created_at:desc");

  const [sortField, sortOrder] = sort.split(":");

  const filters = useMemo(() => ({
    ...(genre !== "all" && { genre }),
    ...(status !== "all" && { status }),
    ...(platform !== "all" && { platform }),
    ...(search && { search }),
    sort: sortField,
    order: sortOrder,
  }), [genre, status, platform, search, sortField, sortOrder]);

  const { data: games, isLoading } = useGames(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-muted-foreground mt-1">
              {t("description")}
              {games && games.length > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
                  {games.length} {t("gamesCount")}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg bg-muted p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-all duration-200 ${viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          <Button onClick={() => setAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            {t("addGame")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-muted/30 p-4 border border-border/50">
        <GameFilters
          search={search} onSearchChange={setSearch}
          genre={genre} onGenreChange={setGenre}
          status={status} onStatusChange={setStatus}
          platform={platform} onPlatformChange={setPlatform}
          sort={sort} onSortChange={setSort}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        viewMode === "grid" ? <GridSkeleton /> : <ListSkeleton />
      ) : !games || games.length === 0 ? (
        <EmptyState
          icon={Library}
          title={t("noGames")}
          description={t("noGamesDescription")}
          action={{ label: t("addGame"), onClick: () => setAddDialogOpen(true) }}
        />
      ) : viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game: Record<string, unknown>) => (
            <GameCard key={game.id as string} game={game as GameCardProps} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {games.map((game: Record<string, unknown>) => (
            <GameListItem key={game.id as string} game={game as GameListItemProps} />
          ))}
        </div>
      )}

      {/* Add Game Dialog */}
      <AddGameDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
    </div>
  );
}

// Type helpers for the component props
type GameCardProps = Parameters<typeof GameCard>[0]["game"];
type GameListItemProps = Parameters<typeof GameListItem>[0]["game"];
