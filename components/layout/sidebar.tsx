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
    <aside className="hidden w-64 shrink-0 border-r border-white/20 bg-white/40 backdrop-blur-xl md:block lg:w-72 dark:border-white/10 dark:bg-black/20">
      <div className="flex h-full max-h-screen flex-col gap-4">
        <div className="flex h-14 items-center border-b border-border px-8 lg:h-[64px]">
          <Link href="/" className="flex items-center gap-3 font-bold">
            <span className="text-2xl tracking-tight truncate bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent font-extrabold">
              Mera Hisab
            </span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <div className="px-6 mb-6">
            <Button asChild className="w-full gap-2 rounded-2xl h-12 font-bold shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
              <Link href="/add">
                <PlusCircle className="h-5 w-5" />
                Add Entry
              </Link>
            </Button>
          </div>
          <nav className="grid items-start gap-2 px-6 text-sm font-medium">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                whileHover={{ x: 6 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "nav-link gap-4 rounded-2xl px-4 py-3.5 transition-all duration-300 border border-purple-500/20 hover:border-purple-500/50",
                    pathname === item.href && "nav-link-active border-purple-500/60"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[15px]">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
