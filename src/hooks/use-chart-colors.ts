"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const COLORS = {
  light: {
    mutedFg: "oklch(0.493 0.013 285.823)",
    border: "oklch(0.865 0.014 285.823)",
    cardBg: "oklch(0.998 0 0)",
    cardFg: "oklch(0.141 0.005 285.823)",
  },
  dark: {
    mutedFg: "oklch(0.705 0.015 286)",
    border: "oklch(1 0 0 / 10%)",
    cardBg: "oklch(0.21 0.006 285.823)",
    cardFg: "oklch(0.985 0 0)",
  },
} as const;

export function useChartColors() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const palette = isDark ? COLORS.dark : COLORS.light;

  return {
    mounted,
    isDark,
    mutedFg: palette.mutedFg,
    borderColor: palette.border,
    cardBg: palette.cardBg,
    cardFg: palette.cardFg,
    themeKey: mounted ? resolvedTheme : "light",
  };
}
