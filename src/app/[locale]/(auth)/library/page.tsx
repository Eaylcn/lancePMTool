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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("title")}
            {games && games.length > 0 && (
              <span className="ml-2 text-base font-normal text-muted-foreground">
                {games.length}
              </span>
            )}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t("description")}</p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} size="sm" className="gap-1.5 h-8">
          <Plus className="h-3.5 w-3.5" />
          {t("addGame")}
        </Button>
      </div>

      {/* Toolbar: Filters + View Toggle */}
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <GameFilters
              search={search} onSearchChange={setSearch}
              genre={genre} onGenreChange={setGenre}
              status={status} onStatusChange={setStatus}
              platform={platform} onPlatformChange={setPlatform}
              sort={sort} onSortChange={setSort}
            />
          </div>
          <div className="flex items-center rounded-md bg-muted p-0.5 shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded transition-colors duration-150 ${viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors duration-150 ${viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
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
