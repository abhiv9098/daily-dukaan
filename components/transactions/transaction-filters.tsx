"use client";

import { useState } from "react";
import { Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFilterContext } from "@/context/filter-context";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_MODES } from "@/lib/constants";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: Category[] = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export function TransactionFiltersBar({ showSearch = true }: { showSearch?: boolean }) {
  const { filters, setFilters, resetFilters } = useFilterContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = [
    filters.type !== "all",
    filters.category !== "all",
    filters.paymentMode !== "all",
    filters.dateFrom !== "",
    filters.dateTo !== "",
  ].filter(Boolean).length;

  return (
    <div className="w-full relative z-10">
      <div className="flex gap-2 w-full">
        {showSearch && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={filters.search}
              onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
              className="pl-9 bg-card border-border rounded-full h-10 w-full text-sm shadow-sm"
            />
          </div>
        )}
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn("h-10 px-4 shrink-0 rounded-full bg-card border-border shadow-sm text-sm font-semibold transition-all", isExpanded && "bg-secondary text-foreground")}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && !isExpanded && (
            <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {isExpanded && (
        <div className="absolute top-12 left-0 right-0 p-4 border border-border rounded-[20px] bg-card shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3">
             <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</span>
                <Select value={filters.type} onValueChange={(v) => setFilters((prev) => ({ ...prev, type: v as any }))}>
                  <SelectTrigger className="h-10 rounded-xl bg-secondary/50 border-none">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                <Select value={filters.category} onValueChange={(v) => setFilters((prev) => ({ ...prev, category: v as any }))}>
                  <SelectTrigger className="h-10 rounded-xl bg-secondary/50 border-none">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl max-h-48">
                    <SelectItem value="all">All Categories</SelectItem>
                    {ALL_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Mode</span>
                <Select value={filters.paymentMode} onValueChange={(v) => setFilters((prev) => ({ ...prev, paymentMode: v as any }))}>
                  <SelectTrigger className="h-10 rounded-xl bg-secondary/50 border-none">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Modes</SelectItem>
                    {PAYMENT_MODES.map((mode) => (
                      <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
             <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Date Range</span>
                <div className="flex gap-1">
                   <Input 
                    type="date" 
                    value={filters.dateFrom} 
                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                    className="h-10 rounded-xl bg-secondary/50 border-none text-[10px] p-2"
                   />
                   <Input 
                    type="date" 
                    value={filters.dateTo} 
                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                    className="h-10 rounded-xl bg-secondary/50 border-none text-[10px] p-2"
                   />
                </div>
             </div>
          </div>
          
          {(activeFilterCount > 0 || filters.search) && (
            <Button variant="ghost" onClick={resetFilters} className="w-full h-10 rounded-xl text-destructive font-semibold hover:bg-destructive/10">
              Clear All Filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
