"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useHisaabContext } from "@/context/hisaab-context";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { settings } = useHisaabContext();

  return (
    <div className={`relative flex min-h-screen w-full overflow-hidden ${settings.darkMode ? 'bg-[#09090b]' : 'bg-slate-50'}`}>
      {/* Background Blobs */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 blur-[120px]" />
      
      <Sidebar />
      <div className="relative flex w-full flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/40 hover:scale-110 active:scale-95 transition-all duration-300">
          <Link href="/add">
            <Plus className="h-7 w-7 text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
