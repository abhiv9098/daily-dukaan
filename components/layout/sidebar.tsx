"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BarChart3,
  Store,
  PlusCircle,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: User, label: "Profile", href: "/profile" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useHisaabContext();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-white/5 backdrop-blur-3xl md:block lg:w-72 dark:bg-black/20">
      <div className="flex h-full max-h-screen flex-col gap-4">
        <div className="flex h-16 items-center px-8 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 font-bold group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
              <Store className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent font-black uppercase">
              mera hisaab
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <div className="px-6 mb-8">
            <Button asChild className="w-full gap-2 rounded-2xl h-12 font-bold shadow-lg shadow-purple-500/20 bg-gradient-to-r from-purple-600 to-blue-600 border-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/add">
                <PlusCircle className="h-5 w-5" />
                New Entry
              </Link>
            </Button>
          </div>
          <nav className="grid items-start gap-2 px-4 text-sm font-medium">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200",
                    pathname === item.href 
                      ? "bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-purple-500" : "text-muted-foreground")} />
                  <span className="text-[14px] font-bold uppercase tracking-wider">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
