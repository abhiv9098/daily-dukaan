"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BarChart3, 
  User, 
  Plus, 
  Menu, 
  X, 
  Store, 
  ChevronLeft,
  Bell,
  Search,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { LanguageToggle } from "./language-toggle";

interface AppShellProps {
  children: React.ReactNode;
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "dashboard", href: "/" },
  { icon: BarChart3, label: "reports", href: "/reports" },
  { icon: User, label: "profile", href: "/profile" },
];

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen h-[100dvh] w-full overflow-hidden bg-background text-foreground transition-colors duration-500">
      {/* Sidebar - Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col sticky top-0 h-full border-r border-white/10 bg-card/40 backdrop-blur-2xl transition-all duration-300 z-40",
          isSidebarCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Store className="h-5 w-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-black uppercase tracking-tight text-gradient whitespace-nowrap"
              >
                mera hisaab
              </motion.span>
            )}
          </Link>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group relative",
                pathname === item.href 
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                  : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="font-bold uppercase tracking-wider text-xs">{t(item.label as any)}</span>
              )}
              {isSidebarCollapsed && pathname === item.href && (
                <div className="absolute left-0 w-1 h-6 bg-white rounded-full" />
              )}
            </Link>
          ))}
        </nav>

        <div className="p-4 space-y-2 border-t border-white/5">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 rounded-2xl h-12 text-muted-foreground hover:text-foreground hover:bg-white/5"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-transform duration-300", isSidebarCollapsed && "rotate-180")} />
            {!isSidebarCollapsed && <span className="font-bold uppercase tracking-wider text-xs">Collapse</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Navbar */}
        <header className="shrink-0 h-16 glass-nav flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4 md:hidden">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
            <span className="text-xl font-black uppercase tracking-tight text-gradient">mera hisaab</span>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
              <input 
                type="text" 
                placeholder={t("searchPlaceholder")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-10 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-purple-500 rounded-full border-2 border-background" />
            </Button>
            <div className="h-8 w-px bg-white/10 mx-2 hidden sm:block" />
            <Link href="/profile" className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-colors">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-purple-500/10">
                JD
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold leading-none">John Doe</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Premium Plan</p>
              </div>
            </Link>
          </div>
        </header>

        {/* Content Area - STRICT SCROLLING */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10 scroll-smooth">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full pb-20 md:pb-0"
          >
            {children}
          </motion.div>
        </main>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
              />
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-[#09090b] z-[60] p-6 flex flex-col md:hidden"
              >
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white shadow-lg">
                      <Store className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-black uppercase tracking-tight text-gradient">mera hisaab</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                <nav className="space-y-4 flex-1">
                  {sidebarItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-2xl text-lg font-bold uppercase tracking-wider transition-all",
                        pathname === item.href 
                          ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" 
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-6 w-6" />
                      {t(item.label as any)}
                    </Link>
                  ))}
                </nav>

                <div className="pt-6 border-t border-white/10 space-y-4">
                  <Link href="/add" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold shadow-lg shadow-purple-600/20">
                    <Plus className="h-6 w-6" />
                    {t("newEntry")}
                  </Link>
                  <button className="flex items-center gap-4 p-4 w-full text-muted-foreground font-bold">
                    <LogOut className="h-6 w-6" />
                    Logout
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Floating Add Button for Mobile */}
        <div className="fixed bottom-6 right-6 md:hidden z-30">
          <Link href="/add">
            <Button size="icon" className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl shadow-purple-600/40 border-none scale-110 active:scale-95 transition-transform">
              <Plus className="h-7 w-7 text-white" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
