"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { settings, updateSettings } = useHisaabContext();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => updateSettings({ darkMode: !settings.darkMode })}
      className="relative h-10 w-10 rounded-full border border-border bg-background hover:bg-accent transition-all duration-300"
      aria-label="Toggle dark mode"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={settings.darkMode ? "dark" : "light"}
          initial={{ y: -20, opacity: 0, rotate: -90 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: 20, opacity: 0, rotate: 90 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex items-center justify-center"
        >
          {settings.darkMode ? (
            <Sun className="h-5 w-5 text-[#a855f7] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          ) : (
            <Moon className="h-5 w-5 text-slate-700" />
          )}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
}
