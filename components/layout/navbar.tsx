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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 bg-background/60 px-4 backdrop-blur-2xl transition-all duration-500 dark:bg-[#020204]/60 lg:px-8">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col border-r border-border bg-background/80 backdrop-blur-xl transition-all duration-500 dark:bg-[#020204]/80">
          <nav className="grid gap-2 pt-10 text-lg font-medium">
            <SheetClose asChild>
              <Link
                href="/"
                className="mb-8 flex items-center gap-3 text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
              >
                Mera Hisab
              </Link>
            </SheetClose>
            <div className="flex flex-col gap-4">
              <SheetClose asChild>
                <Button asChild className="w-full gap-2 rounded-2xl h-12 font-bold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 border-none">
                  <Link href="/add">
                    <Plus className="h-5 w-5" />
                    Add Entry
                  </Link>
                </Button>
              </SheetClose>
            </div>
            {menuItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "nav-link gap-4 rounded-2xl px-4 py-3",
                    pathname === item.href && "nav-link-active"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1 flex justify-center">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-300 group-focus-within:text-purple-500 z-10" />
          <input
            type="search"
            placeholder="Search here..."
            className="w-full h-10 rounded-full border border-white/10 bg-black/5 dark:bg-white/5 pl-11 pr-4 text-sm outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-muted-foreground focus:border-purple-500/50 focus:bg-background focus:ring-2 focus:ring-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0)] focus:shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:bg-black/10 dark:hover:bg-white/10"
            value={filters.search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/profile">
          <Button variant="ghost" size="icon" className="rounded-full h-10 w-10 overflow-hidden border border-transparent hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_10px_rgba(168,85,247,0.4)]">
             <User className="h-5 w-5 text-muted-foreground hover:text-purple-500 transition-colors" />
          </Button>
        </Link>
      </div>
    </header>
  );
}
