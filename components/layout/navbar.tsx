"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Store,
  LayoutDashboard,
  BarChart3,
  Plus,
  Search,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Navbar() {
  const pathname = usePathname();
  const { settings } = useHisaabContext();
  const { filters, setSearch } = useFilterContext();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-background/60 px-4 backdrop-blur-2xl lg:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="shrink-0 rounded-xl md:hidden text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r border-white/10 bg-[#09090b]/80 backdrop-blur-2xl p-0">
          <div className="flex h-16 items-center px-8 border-b border-white/5 mb-6">
             <Link href="/" className="flex items-center gap-3 font-bold group">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Store className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-black uppercase">
                mera hisaab
              </span>
            </Link>
          </div>
          <nav className="grid gap-2 px-4 text-sm font-medium">
            {menuItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                    pathname === item.href 
                      ? "bg-purple-500/10 text-purple-500 border border-purple-500/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-bold uppercase tracking-wider">
                    {t(item.label.toLowerCase() as any)}
                  </span>
                </Link>
              </SheetClose>
            ))}
            <div className="mt-6 px-2">
              <SheetClose asChild>
                <Button asChild className="w-full gap-2 rounded-xl h-12 font-bold bg-gradient-to-r from-purple-600 to-blue-600 border-none">
                  <Link href="/add">
                    <Plus className="h-5 w-5" />
                    {t("newEntry")}
                  </Link>
                </Button>
              </SheetClose>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1 flex justify-center">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within:text-purple-500 z-10" />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            className="w-full h-10 rounded-xl border border-white/10 bg-black/5 dark:bg-white/5 pl-11 pr-4 text-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground focus:border-purple-500/50 focus:bg-background focus:ring-4 focus:ring-purple-500/10"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 border border-white/5 bg-white/5 hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
             <User className="h-5 w-5 text-muted-foreground group-hover:text-purple-500 transition-colors" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
