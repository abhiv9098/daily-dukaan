"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BarChart3, User, Plus, Search, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "./language-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: Plus, label: "Add", href: "/add", isFab: true },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row overflow-hidden bg-background text-foreground">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
            <Store className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">Hisaab</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {navItems.filter(i => !i.isFab).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium",
                pathname === item.href 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4">
           <Button asChild className="w-full rounded-xl h-12 font-semibold shadow-sm">
             <Link href="/add">
               <Plus className="h-5 w-5 mr-2" /> New Entry
             </Link>
           </Button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <header className="shrink-0 h-14 glass-nav flex items-center justify-between px-4 z-30 md:px-8">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Store className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Hisaab</span>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder={t("searchPlaceholder")}
                className="w-full bg-muted border-none rounded-full h-10 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <LanguageToggle />
            <Link href="/profile" className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
               <User className="h-4 w-4 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 pb-[84px] md:p-8 md:pb-8 scroll-smooth">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-5xl mx-auto"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[68px] bg-background/90 backdrop-blur-xl border-t border-border flex items-center justify-around px-2 z-50 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.02)]">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.isFab) {
              return (
                <div key={item.href} className="relative -top-5">
                  <Link href={item.href} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                    <item.icon className="h-6 w-6" />
                  </Link>
                </div>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-full gap-1 transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("p-1 rounded-full transition-colors", isActive && "bg-secondary")}>
                   <item.icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
