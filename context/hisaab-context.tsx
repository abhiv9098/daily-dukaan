"use client";

import React, { createContext, useContext } from "react";
import { useHisaab } from "@/hooks/use-hisaab";

const HisaabContext = createContext<ReturnType<typeof useHisaab> | null>(null);

export function HisaabProvider({ children }: { children: React.ReactNode }) {
  const hisaab = useHisaab("default-user");

  if (!hisaab.isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <HisaabContext.Provider value={hisaab}>{children}</HisaabContext.Provider>
  );
}

export function useHisaabContext() {
  const context = useContext(HisaabContext);
  if (!context) {
    throw new Error("useHisaabContext must be used within a HisaabProvider");
  }
  return context;
}
