"use client";

import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-[#020617]">
      {/* Background Blobs */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-[120px]" />
      
      <Sidebar />
      <div className="relative flex w-full flex-col">
        <Navbar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <Button asChild size="icon" className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/40 hover:scale-110 active:scale-95 transition-all duration-300">
          <Link href="/add">
            <Plus className="h-7 w-7 text-white" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
