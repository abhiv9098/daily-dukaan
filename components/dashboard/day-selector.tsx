"use client";

import { format, addDays, subDays, isToday, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilterContext } from "@/context/filter-context";

export function DaySelector() {
  const { filters, setFilters } = useFilterContext();
  
  // Use dateFrom as the current selected day if it's set, otherwise use today
  const currentDay = filters.dateFrom ? parseISO(filters.dateFrom) : new Date();

  const handlePrevDay = () => {
    const prev = subDays(currentDay, 1);
    const dateStr = format(prev, "yyyy-MM-dd");
    setFilters(prevFilters => ({
      ...prevFilters,
      dateFrom: dateStr,
      dateTo: dateStr
    }));
  };

  const handleNextDay = () => {
    const next = addDays(currentDay, 1);
    const dateStr = format(next, "yyyy-MM-dd");
    setFilters(prevFilters => ({
      ...prevFilters,
      dateFrom: dateStr,
      dateTo: dateStr
    }));
  };

  const handleToday = () => {
    const today = new Date();
    const dateStr = format(today, "yyyy-MM-dd");
    setFilters(prevFilters => ({
      ...prevFilters,
      dateFrom: dateStr,
      dateTo: dateStr
    }));
  };

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-full p-1.5 shadow-sm max-w-sm mx-auto">
      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-9 w-9" 
        onClick={handlePrevDay}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex flex-col items-center px-4">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          {isToday(currentDay) ? "Today" : format(currentDay, "EEEE")}
        </span>
        <span className="text-sm font-bold">
          {format(currentDay, "dd MMM yyyy")}
        </span>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-9 w-9" 
        onClick={handleNextDay}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
