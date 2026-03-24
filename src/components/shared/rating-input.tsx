"use client";

import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function RatingInput({ value, onChange, className }: RatingInputProps) {
  const color = value >= 7 ? "text-emerald-500" : value >= 4 ? "text-yellow-500" : "text-red-500";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Slider
        value={[value]}
        onValueChange={([v]) => onChange(Math.round(v * 10) / 10)}
        min={0}
        max={10}
        step={0.5}
        className="flex-1"
      />
      <span className={cn("text-sm font-bold tabular-nums w-8 text-right", color)}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}
