"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";
import { cn } from "@/lib/utils";

export function ThemeModeButtons() {
  const { settings, updateSettings } = useHisaabContext();

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        className={cn(!settings.darkMode && "btn-active")}
        onClick={() => updateSettings({ darkMode: false })}
        aria-pressed={!settings.darkMode}
        aria-label="Light mode"
      >
        <Sun className="h-4 w-4" />
        Light
      </Button>
      <Button
        type="button"
        size="sm"
        className={cn(settings.darkMode && "btn-active")}
        onClick={() => updateSettings({ darkMode: true })}
        aria-pressed={settings.darkMode}
        aria-label="Night mode"
      >
        <Moon className="h-4 w-4" />
        Night
      </Button>
    </div>
  );
}
