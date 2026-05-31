"use client";

import { useEffect } from "react";
import { useHisaabContext } from "@/context/hisaab-context";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useHisaabContext();

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [settings.darkMode]);

  return <>{children}</>;
}
