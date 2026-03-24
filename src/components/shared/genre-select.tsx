"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X, ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { GAME_GENRES } from "@/lib/constants/genres";

interface GenreSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function GenreSelect({ value, onChange, placeholder }: GenreSelectProps) {
  const t = useTranslations("genres");
  const [open, setOpen] = useState(false);
  const [customGenre, setCustomGenre] = useState("");
  const showOtherInput = value.includes("other");

  const toggle = (genre: string) => {
    if (value.includes(genre)) {
      onChange(value.filter((v) => v !== genre));
    } else {
      onChange([...value, genre]);
    }
  };

  const removeCustom = (custom: string) => {
    onChange(value.filter((v) => v !== custom));
  };

  const addCustomGenre = () => {
    const trimmed = customGenre.trim().toLowerCase().replace(/\s+/g, "_");
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomGenre("");
    }
  };

  // Separate standard genres from custom ones
  const standardGenres = value.filter((v) => (GAME_GENRES as readonly string[]).includes(v));
  const customGenres = value.filter((v) => !(GAME_GENRES as readonly string[]).includes(v) && v !== "other");

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between font-normal"
            >
              {value.length > 0
                ? `${value.length} selected`
                : placeholder || "Select genres..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search genres..." />
            <CommandList>
              <CommandEmpty>No genre found.</CommandEmpty>
              <CommandGroup>
                {GAME_GENRES.map((genre) => (
                  <CommandItem key={genre} value={genre} onSelect={() => toggle(genre)}>
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value.includes(genre) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {t(genre)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {standardGenres.map((genre) => (
            <Badge key={genre} variant="secondary" className="gap-1 pr-1">
              {t(genre)}
              <button
                onClick={() => toggle(genre)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {customGenres.map((genre) => (
            <Badge key={genre} variant="outline" className="gap-1 pr-1">
              {genre.replace(/_/g, " ")}
              <button
                onClick={() => removeCustom(genre)}
                className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Custom genre input when "other" is selected */}
      {showOtherInput && (
        <div className="flex gap-2">
          <Input
            placeholder={t("customPlaceholder")}
            value={customGenre}
            onChange={(e) => setCustomGenre(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomGenre())}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={addCustomGenre} disabled={!customGenre.trim()}>
            +
          </Button>
        </div>
      )}
    </div>
  );
}
