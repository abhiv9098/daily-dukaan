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
            <Settings className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-2xl shadow-xl flex items-center justify-between h-14 px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              
              if (item.isFab) {
                return (
                  <div key={item.href} className="relative flex justify-center -mt-8">
                    <Link 
                      href={item.href} 
                      className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 active:scale-95 transition-all duration-300 border-4 border-white dark:border-slate-900"
                    >
                      <Plus className="h-7 w-7" />
                    </Link>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 relative",
                    isActive ? "text-primary" : "text-slate-400 hover:text-primary"
                  )}
                >
                  <motion.div 
                    animate={isActive ? { scale: 1.1, y: -1 } : { scale: 1, y: 0 }}
                    className={cn("p-1 transition-colors", isActive && "text-primary")}
                  >
                     <item.icon className={cn("h-5 w-5")} strokeWidth={isActive ? 2.5 : 2} />
                  </motion.div>
                  {isActive && (
                    <motion.div 
                      layoutId="nav-dot"
                      className="absolute bottom-1 h-1 w-1 bg-primary rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

