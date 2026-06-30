"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useHisaab } from "@/hooks/use-hisaab";
import { useRouter, usePathname } from "next/navigation";

type LocalUser = {
  id: string;
  email?: string;
  phone?: string;
  user_metadata: {
    full_name?: string;
  };
};

const HisaabContext = createContext<(ReturnType<typeof useHisaab> & { user: LocalUser | null; logout: () => void }) | null>(null);

export function HisaabProvider({ children }: { children: React.ReactNode }) {
  return <HisaabProviderInner>{children}</HisaabProviderInner>;
}

function HisaabProviderInner({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<LocalUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("hisaab_current_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
      if (pathname !== "/login") {
        router.push("/login");
      }
    }
    setIsUserLoading(false);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem("hisaab_current_user");
    setUser(null);
    router.push("/login");
  };

  const hisaab = useHisaab(user?.id || "guest-user");

  if (pathname !== "/login" && (isUserLoading || !user || !hisaab.isLoaded)) {
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
    <HisaabContext.Provider value={{ ...hisaab, user, logout }}>{children}</HisaabContext.Provider>
  );
}

export function useHisaabContext() {
  const context = useContext(HisaabContext);
  if (!context) {
    throw new Error("useHisaabContext must be used within a HisaabProvider");
  }
  return context;
}
