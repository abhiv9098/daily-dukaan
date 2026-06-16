"use client";

import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { useFilterContext } from "@/context/filter-context";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, PAYMENT_MODES } from "@/lib/constants";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: Category[] = [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])];

export function TransactionFiltersBar({ showSearch = true }: { showSearch?: boolean }) {
  const { filters, setFilters, resetFilters } = useFilterContext();

  const activeFilterCount = [
    filters.type !== "all",
    filters.category !== "all",
    filters.paymentMode !== "all",
    filters.dateFrom !== "",
    filters.dateTo !== "",
  ].filter(Boolean).length;

  return (
    <div className="w-full z-10">
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
        
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className={cn("h-10 px-4 shrink-0 rounded-full bg-card border-border shadow-sm text-sm font-semibold transition-all")}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[32px] p-6 border-t border-border bg-background pb-10 shadow-2xl">
            <SheetHeader className="mb-6 flex flex-row items-center justify-between">
              <SheetTitle className="text-xl font-black uppercase tracking-tight">Refine List</SheetTitle>
            </SheetHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Type</span>
                    <Select value={filters.type} onValueChange={(v) => setFilters((prev) => ({ ...prev, type: v as any }))}>
                      <SelectTrigger className="h-12 rounded-2xl bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-colors">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Category</span>
                    <Select value={filters.category} onValueChange={(v) => setFilters((prev) => ({ ...prev, category: v as any }))}>
                      <SelectTrigger className="h-12 rounded-2xl bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-colors">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50 max-h-48">
                        <SelectItem value="all">All Categories</SelectItem>
                        {ALL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Payment Mode</span>
                    <Select value={filters.paymentMode} onValueChange={(v) => setFilters((prev) => ({ ...prev, paymentMode: v as any }))}>
                      <SelectTrigger className="h-12 rounded-2xl bg-secondary/30 border-border/50 hover:bg-secondary/50 transition-colors">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-border/50">
                        <SelectItem value="all">All Modes</SelectItem>
                        {PAYMENT_MODES.map((mode) => (
                          <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/80 ml-1">Date Range</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <Input 
                          type="date" 
                          value={filters.dateFrom} 
                          onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                          className="h-12 rounded-2xl bg-secondary/30 border-border/50 text-xs pl-4 pr-2 focus:bg-card transition-all"
                        />
                        <span className="absolute -top-2 left-4 px-1 text-[8px] font-bold bg-background text-muted-foreground rounded uppercase">From</span>
                      </div>
                      <div className="relative">
                        <Input 
                          type="date" 
                          value={filters.dateTo} 
                          onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                          className="h-12 rounded-2xl bg-secondary/30 border-border/50 text-xs pl-4 pr-2 focus:bg-card transition-all"
                        />
                        <span className="absolute -top-2 left-4 px-1 text-[8px] font-bold bg-background text-muted-foreground rounded uppercase">To</span>
                      </div>
                    </div>
                </div>
              </div>
              
              <div className="pt-4 flex gap-3">
                <SheetClose asChild>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider border-border/50"
                  >
                    View Results
                  </Button>
                </SheetClose>
                {(activeFilterCount > 0 || filters.search) && (
                  <Button 
                    variant="destructive" 
                    onClick={resetFilters} 
                    className="flex-1 h-12 rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-destructive/20"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
