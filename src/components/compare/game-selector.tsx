"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Gamepad2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Game {
  id: string;
  title: string;
  genre: string[];
  platform: string | null;
  studio: string | null;
  coverImageUrl: string | null;
}

interface GameSelectorProps {
  label: string;
  games: Game[];
  selectedGameId: string | null;
  onSelect: (gameId: string | null) => void;
  disabledGameId?: string | null;
  placeholder: string;
  searchPlaceholder: string;
  noGamesText: string;
}

export function GameSelector({
  label,
  games,
  selectedGameId,
  onSelect,
  disabledGameId,
  placeholder,
  searchPlaceholder,
  noGamesText,
}: GameSelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedGame = games.find(g => g.id === selectedGameId);

  return (
    <div className="flex-1 min-w-0">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          className={cn(
            "flex items-center justify-between w-full h-12 px-3 text-left text-sm font-normal",
            "rounded-md border border-border/50 bg-background",
            "hover:border-border hover:bg-muted/50 transition-colors",
            !selectedGameId && "text-muted-foreground"
          )}
        >
          {selectedGame ? (
            <div className="flex items-center gap-2 truncate">
              <Gamepad2 className="h-4 w-4 text-primary shrink-0" />
              <span className="truncate font-medium text-foreground">{selectedGame.title}</span>
              {selectedGame.studio && (
                <span className="text-xs text-muted-foreground truncate">
                  {selectedGame.studio}
                </span>
              )}
            </div>
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{noGamesText}</CommandEmpty>
              <CommandGroup>
                {games.map(game => (
                  <CommandItem
                    key={game.id}
                    value={`${game.title} ${game.studio || ""}`}
                    disabled={game.id === disabledGameId}
                    onSelect={() => {
                      onSelect(game.id === selectedGameId ? null : game.id);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedGameId === game.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{game.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {game.studio || ""}
                        {game.genre?.length > 0 && ` · ${(game.genre as string[]).slice(0, 2).join(", ")}`}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
