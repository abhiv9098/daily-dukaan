"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHisaab } from "@/hooks/use-hisaab";

type LocalUser = {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
};

const HisaabContext = createContext<(ReturnType<typeof useHisaab> & { user: LocalUser | null }) | null>(null);

export function HisaabProvider({ children }: { children: React.ReactNode }) {
  return <HisaabProviderInner>{children}</HisaabProviderInner>;
}

function HisaabProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // Mock user for local development
    const mockUser: LocalUser = {
      id: "local-user",
      email: "guest@example.com",
      user_metadata: {
        full_name: "Local User",
      },
    };
    setUser(mockUser);
    setIsUserLoading(false);
  }, []);

  const hisaab = useHisaab(user?.id);

  if (isUserLoading || !hisaab.isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-muted-foreground">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]" />
          <p className="text-sm font-medium uppercase tracking-[0.2em] animate-pulse">Loading your hisaab...</p>
        </div>
      </div>
    );
  }

  return (
    <HisaabContext.Provider value={{ ...hisaab, user }}>{children}</HisaabContext.Provider>
  );
}

export function useHisaabContext() {
  const context = useContext(HisaabContext);
  if (!context) {
    throw new Error("useHisaabContext must be used within a HisaabProvider");
  }
  return context;
}
