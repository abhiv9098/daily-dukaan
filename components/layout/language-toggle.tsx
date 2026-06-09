"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl h-10 w-10 border border-white/5 bg-white/5 hover:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
        >
          <Languages className="h-5 w-5 text-muted-foreground" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-xl border-white/10 bg-[#09090b]/80 backdrop-blur-2xl">
        <DropdownMenuItem
          onClick={() => setLanguage("en")}
          className={cn(
            "rounded-lg transition-colors cursor-pointer",
            language === "en" ? "bg-purple-500/10 text-purple-500 font-bold" : "text-muted-foreground"
          )}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage("hi")}
          className={cn(
            "rounded-lg transition-colors cursor-pointer",
            language === "hi" ? "bg-purple-500/10 text-purple-500 font-bold" : "text-muted-foreground"
          )}
        >
          हिन्दी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
