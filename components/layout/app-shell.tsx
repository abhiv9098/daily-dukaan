"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  User, 
  Plus, 
  Store, 
  Users, 
  Target,
  FileText,
  Settings,
  Bell,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageToggle } from "./language-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();


  const navItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: Users, label: "Customers", href: "/khata" },
    { icon: Plus, label: "Add Entry", href: "/add", isFab: true },
    { icon: BarChart3, label: "Reports", href: "/reports" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const sidebarItems = [
    { icon: LayoutDashboard, label: "Home", href: "/" },
    { icon: Users, label: "Customers", href: "/khata" },
    { icon: BarChart3, label: "Reports & Analytics", href: "/reports" },
    { icon: Target, label: "Savings Goals", href: "/savings" },
    { icon: FileText, label: "Invoices", href: "/invoice" },
    { icon: User, label: "My Profile", href: "/profile" },
  ];

  return (
    <div className="flex h-[100dvh] w-full flex-col md:flex-row overflow-hidden bg-background text-foreground font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-72 border-r border-border bg-card/50 backdrop-blur-xl">
        <div className="p-8 flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl premium-gradient flex items-center justify-center animate-float">
            <Store className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight block">Dukaan</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Premium Finance</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-medium group",
                pathname === item.href 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", pathname === item.href ? "text-white" : "text-primary")} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-border mt-auto">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center border border-border">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Abhishek</p>
              <p className="text-[10px] text-muted-foreground truncate">Premium Member</p>
            </div>
            <Link href="/settings" aria-label="Settings">
              <Settings className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <header className="shrink-0 h-14 md:h-20 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-2 md:hidden">
            <div className="h-8 w-8 rounded-lg premium-gradient flex items-center justify-center">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-bold tracking-tight">Dukaan</span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 flex-1">
             <h1 className="text-2xl font-bold tracking-tight">
               {sidebarItems.find(i => i.href === pathname)?.label || "Dashboard"}
             </h1>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-secondary hover:bg-muted transition-colors cursor-pointer border border-border">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <LanguageToggle />
            <Link href="/profile" className="md:hidden h-9 w-9 rounded-xl bg-secondary flex items-center justify-center overflow-hidden border border-border">
               <User className="h-5 w-5 text-muted-foreground" />
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto px-4 pb-32 pt-2 md:px-8 md:pb-8 scroll-smooth scrollbar-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="w-full max-w-6xl mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50">
          <div className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] grid grid-cols-5 items-center justify-items-center h-16 px-1">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              
              if (item.isFab) {
                return (
                  <div key={item.href} className="relative flex items-center justify-center w-full h-full">
                    <Link 
                      href={item.href} 
                      className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6D5DF6] text-white shadow-[0_8px_20px_rgba(109,93,246,0.35)] active:scale-95 hover:scale-105 transition-all duration-200 border-4 border-white dark:border-slate-950 absolute -top-6 z-10"
                      aria-label="Add Entry"
                    >
                      <Plus className="h-6 w-6" strokeWidth={3} />
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center w-full h-full transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center relative">
                    <div className={cn(
                      "flex items-center justify-center h-8 w-12 rounded-full transition-all duration-200",
                      isActive 
                        ? "bg-[#6D5DF6]/10 text-[#6D5DF6] dark:bg-[#6D5DF6]/20 shadow-[0_0_12px_rgba(109,93,246,0.15)]" 
                        : "text-slate-400 dark:text-slate-500 hover:text-[#6D5DF6]/70 dark:hover:text-[#6D5DF6]/70"
                    )}>
                      <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
                    </div>
                    <span className={cn(
                      "text-[9px] font-bold mt-1 tracking-tight transition-colors duration-200 uppercase",
                      isActive 
                        ? "text-[#6D5DF6] dark:text-[#6D5DF6]/90" 
                        : "text-slate-400 dark:text-slate-500"
                    )}>
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

