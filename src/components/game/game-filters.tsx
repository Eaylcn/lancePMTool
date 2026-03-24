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
      <Select value={genre} onValueChange={(v) => onGenreChange(v ?? "all")}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder={t("allGenres")}>
            {(v: string | null) => v && v !== "all" ? tGenre(v) : t("allGenres")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allGenres")}</SelectItem>
          {GAME_GENRES.map((g) => (
            <SelectItem key={g} value={g}>{tGenre(g)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={status} onValueChange={(v) => onStatusChange(v ?? "all")}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder={t("allStatuses")}>
            {(v: string | null) => {
              const labels: Record<string, string> = { all: t("allStatuses"), playing: t("status.playing"), completed: t("status.completed"), dropped: t("status.dropped") };
              return labels[v ?? "all"] ?? t("allStatuses");
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allStatuses")}</SelectItem>
          <SelectItem value="playing">{t("status.playing")}</SelectItem>
          <SelectItem value="completed">{t("status.completed")}</SelectItem>
          <SelectItem value="dropped">{t("status.dropped")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Platform */}
      <Select value={platform} onValueChange={(v) => onPlatformChange(v ?? "all")}>
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={t("allPlatforms")}>
            {(v: string | null) => {
              const labels: Record<string, string> = { all: t("allPlatforms"), ios: "iOS", android: "Android", both: t("bothPlatforms") };
              return labels[v ?? "all"] ?? t("allPlatforms");
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">{t("allPlatforms")}</SelectItem>
          <SelectItem value="ios">iOS</SelectItem>
          <SelectItem value="android">Android</SelectItem>
          <SelectItem value="both">{t("bothPlatforms")}</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select value={sort} onValueChange={(v) => onSortChange(v ?? "created_at:desc")}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder={t("sortBy")}>
            {(v: string | null) => {
              const labels: Record<string, string> = { "created_at:desc": t("sort.newest"), "created_at:asc": t("sort.oldest"), "title:asc": t("sort.titleAZ"), "title:desc": t("sort.titleZA"), "overall_rating:desc": t("sort.ratingHigh"), "overall_rating:asc": t("sort.ratingLow") };
              return labels[v ?? "created_at:desc"] ?? t("sortBy");
            }}
          </SelectValue>
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
