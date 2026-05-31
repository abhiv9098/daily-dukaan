"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterContext } from "@/context/filter-context";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  PAYMENT_MODES,
} from "@/lib/constants";
import { Category } from "@/types";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES: Category[] = [
  ...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES]),
];

interface TransactionFiltersProps {
  showSearch?: boolean;
}

export function TransactionFiltersBar({ showSearch = true }: TransactionFiltersProps) {
  const { filters, setFilters, resetFilters } = useFilterContext();
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.paymentMode !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.search !== "";

  const activeFilterCount = [
    filters.type !== "all",
    filters.category !== "all",
    filters.paymentMode !== "all",
    filters.dateFrom !== "" || filters.dateTo !== "",
    filters.search !== "",
  ].filter(Boolean).length;

  return (
    <div className="rounded-3xl border border-white/10 bg-card/40 p-4 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60 transition-all duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {showSearch && (
          <div className="relative flex-1 space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Search Transactions</Label>
            <div className="relative group">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground group-focus-within:text-purple-500 transition-colors" />
              <Input
                placeholder="Search description, category..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="h-9 pl-8 rounded-xl bg-black/5 dark:bg-white/5 border-white/10 focus-visible:ring-purple-500/30 transition-all text-xs"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 w-full sm:flex sm:w-auto">
          <div className="space-y-1.5 sm:w-[9.5rem]">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">From</Label>
            <DateInput
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
              }
              className="h-9 rounded-xl"
            />
          </div>

          <div className="space-y-1.5 sm:w-[9.5rem]">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">To</Label>
            <DateInput
              value={filters.dateTo}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
              }
              className="h-9 rounded-xl"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "h-9 rounded-xl gap-2 border-white/10 bg-white/5 px-3 text-xs transition-all",
              isExpanded && "border-purple-500/50 bg-purple-500/5 text-purple-500"
            )}
          >
            <Filter className="h-3.5 w-3.5" />
            {isExpanded ? "Less Filters" : "More Filters"}
            {activeFilterCount > 0 && !isExpanded && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 w-9 rounded-xl border border-red-500/10 bg-red-500/5 p-0 text-red-500 hover:bg-red-500/10 transition-colors"
              title="Clear all filters"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 grid animate-in fade-in slide-in-from-top-2 duration-300 gap-4 pt-4 border-t border-white/5 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Transaction Type</Label>
            <Select
              value={filters.type}
              onValueChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  type: v as typeof filters.type,
                }))
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-black/5 dark:bg-white/5 border-white/10 focus:ring-purple-500/30 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Category</Label>
            <Select
              value={filters.category}
              onValueChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  category: v as typeof filters.category,
                }))
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-black/5 dark:bg-white/5 border-white/10 focus:ring-purple-500/30 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-64">
                <SelectItem value="all">All Categories</SelectItem>
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Payment Method</Label>
            <Select
              value={filters.paymentMode}
              onValueChange={(v) =>
                setFilters((prev) => ({
                  ...prev,
                  paymentMode: v as typeof filters.paymentMode,
                }))
              }
            >
              <SelectTrigger className="h-9 rounded-xl bg-black/5 dark:bg-white/5 border-white/10 focus:ring-purple-500/30 transition-all">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Modes</SelectItem>
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>
                    {mode}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}
