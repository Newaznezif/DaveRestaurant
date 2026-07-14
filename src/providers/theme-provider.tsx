"use client";

import { useEffect } from "react";
import { useUIStore } from "@/stores/ui.store";

type Theme = "light" | "dark" | "system";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const currentTheme = theme === "system" ? (isSystemDark ? "dark" : "light") : theme;

    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);
  }, [theme]);

  return <>{children}</>;
}