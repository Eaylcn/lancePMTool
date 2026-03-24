"use client";

import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GAME_GENRES } from "@/lib/constants/genres";

interface GameFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  genre: string;
  onGenreChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  platform: string;
  onPlatformChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
}

export function GameFilters({
  search, onSearchChange,
  genre, onGenreChange,
  status, onStatusChange,
  platform, onPlatformChange,
  sort, onSortChange,
}: GameFiltersProps) {
  const t = useTranslations("library");
  const tGenre = useTranslations("genres");

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Genre */}
      <Select value={genre} onValueChange={onGenreChange}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={t("allGenres")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allGenres")}</SelectItem>
          {GAME_GENRES.map((g) => (
            <SelectItem key={g} value={g}>{tGenre(g)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t("allStatuses")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="playing">{t("status.playing")}</SelectItem>
          <SelectItem value="completed">{t("status.completed")}</SelectItem>
          <SelectItem value="dropped">{t("status.dropped")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Platform */}
      <Select value={platform} onValueChange={onPlatformChange}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t("allPlatforms")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allPlatforms")}</SelectItem>
          <SelectItem value="ios">iOS</SelectItem>
          <SelectItem value="android">Android</SelectItem>
          <SelectItem value="both">{t("bothPlatforms")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("sortBy")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at:desc">{t("sort.newest")}</SelectItem>
          <SelectItem value="created_at:asc">{t("sort.oldest")}</SelectItem>
          <SelectItem value="title:asc">{t("sort.titleAZ")}</SelectItem>
          <SelectItem value="title:desc">{t("sort.titleZA")}</SelectItem>
          <SelectItem value="overall_rating:desc">{t("sort.ratingHigh")}</SelectItem>
          <SelectItem value="overall_rating:asc">{t("sort.ratingLow")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
