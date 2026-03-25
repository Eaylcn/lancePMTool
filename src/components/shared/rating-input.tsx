"use client";

import { cn } from "@/lib/utils";

interface RatingInputProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function RatingInput({ value, onChange, className }: RatingInputProps) {
  const color =
    value >= 7
      ? "text-emerald-500"
      : value >= 4
        ? "text-yellow-500"
        : "text-red-500";

  const trackColor =
    value >= 7
      ? "[&::-webkit-slider-runnable-track]:bg-emerald-500/20 [&::-moz-range-track]:bg-emerald-500/20"
      : value >= 4
        ? "[&::-webkit-slider-runnable-track]:bg-yellow-500/20 [&::-moz-range-track]:bg-yellow-500/20"
        : "[&::-webkit-slider-runnable-track]:bg-red-500/20 [&::-moz-range-track]:bg-red-500/20";

  const thumbColor =
    value >= 7
      ? "[&::-webkit-slider-thumb]:bg-emerald-500 [&::-moz-range-thumb]:bg-emerald-500"
      : value >= 4
        ? "[&::-webkit-slider-thumb]:bg-yellow-500 [&::-moz-range-thumb]:bg-yellow-500"
        : "[&::-webkit-slider-thumb]:bg-red-500 [&::-moz-range-thumb]:bg-red-500";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <input
        type="range"
        min={0}
        max={10}
        step={0.5}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={cn(
          "flex-1 h-1.5 appearance-none rounded-full cursor-pointer",
          trackColor,
          thumbColor,
          "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:-mt-[3px] [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-background [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-md",
          "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full",
          "[&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:ring-2 [&::-moz-range-thumb]:ring-background",
        )}
      />
      <span className={cn("text-sm font-bold tabular-nums w-8 text-right", color)}>
        {value.toFixed(1)}
      </span>
    </div>
  );
}
