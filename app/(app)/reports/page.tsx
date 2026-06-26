"use client";

import { useMemo } from "react";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { BudgetsList } from "@/components/reports/budgets-list";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { DaySelector } from "@/components/dashboard/day-selector";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { useLanguage } from "@/context/language-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Trash2, ListFilter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExportToolbar } from "@/components/export/export-toolbar";
import { subDays, startOfMonth, startOfYear, format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const { transactions, isLoaded, deleteTransactions } = useHisaabContext();
  const { filters, setFilters } = useFilterContext();
  const { language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);

  const currentPeriod = useMemo(() => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    if (filters.dateFrom === todayStr && filters.dateTo === todayStr) return "Today";
    
    const weekAgoStr = format(subDays(new Date(), 6), "yyyy-MM-dd");
    if (filters.dateFrom === weekAgoStr && filters.dateTo === todayStr) return "Week";
    
    const startMonthStr = format(startOfMonth(new Date()), "yyyy-MM-dd");
    if (filters.dateFrom === startMonthStr && filters.dateTo === todayStr) return "Month";
    
    const startYearStr = format(startOfYear(new Date()), "yyyy-MM-dd");
    if (filters.dateFrom === startYearStr && filters.dateTo === todayStr) return "Year";
    
    return null;
  }, [filters.dateFrom, filters.dateTo]);

  const handlePeriodChange = (period: string) => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    let dateFrom = todayStr;
    
    if (period === "Week") {
      dateFrom = format(subDays(new Date(), 6), "yyyy-MM-dd");
    } else if (period === "Month") {
      dateFrom = format(startOfMonth(new Date()), "yyyy-MM-dd");
    } else if (period === "Year") {
      dateFrom = format(startOfYear(new Date()), "yyyy-MM-dd");
    }
    
    setFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo: todayStr
    }));
  };

  if (!isLoaded) return null;

  const handleDeleteAll = (type?: 'income' | 'expense') => {
    const listToDelete = type 
      ? filtered.filter(t => t.type === type) 
      : filtered;
    
    if (confirm(`Are you sure you want to delete all ${listToDelete.length} filtered transactions?`)) {
      deleteTransactions(listToDelete.map(t => t.id));
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Header */}
      <section className="px-1 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Analysis & Reports</h2>
            <p className="text-slate-500 font-medium text-sm">Grow your business with deep insights.</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-100">
             <BarChart3 className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="space-y-4">
         <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Time Period</h3>
            <div className="flex gap-2">
                {['Today', 'Week', 'Month', 'Year'].map(p => {
                  const isActive = currentPeriod === p;
                  return (
                    <button 
                      key={p} 
                      onClick={() => handlePeriodChange(p)}
                      className={cn(
                        "text-[10px] font-bold px-3 py-1.5 rounded-full transition-all duration-200 border",
                        isActive 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm shadow-indigo-600/25" 
                          : "bg-slate-100 dark:bg-white/5 border-transparent text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400"
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
            </div>
         </div>
         <DaySelector />
      </section>

      {/* Export & Data Center */}
      <section className="px-1">
         <ExportToolbar />
      </section>

      {/* Core Analytics - Displays both Income and Expense summary */}
      <section className="space-y-6">
        <ReportsSummary transactions={filtered} />
      </section>

      {/* Tabbed Ledgers */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl p-1 mb-8">
          <TabsTrigger 
            value="all" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all font-bold text-xs"
          >
            All Ledger
          </TabsTrigger>
          <TabsTrigger 
            value="income" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all font-bold text-xs"
          >
            Kamayi
          </TabsTrigger>
          <TabsTrigger 
            value="expense" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all font-bold text-xs"
          >
            Kharcha
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 px-1 mt-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">All Cashbook Entries</h3>
            <div className="flex gap-2">
              <TransactionFiltersBar showSearch={false} />
              {filtered.length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAll()} className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="fintech-card overflow-hidden">
            <TransactionTable transactions={filtered} />
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-4 px-1 mt-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Income Ledger</h3>
            <div className="flex gap-2">
              <TransactionFiltersBar showSearch={false} />
              {filtered.filter(t => t.type === 'income').length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAll('income')} className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="fintech-card overflow-hidden">
            <TransactionTable transactions={filtered.filter(t => t.type === 'income')} />
          </div>
        </TabsContent>

        <TabsContent value="expense" className="space-y-4 px-1 mt-0">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Expense Ledger</h3>
            <div className="flex gap-2">
              <TransactionFiltersBar showSearch={false} />
              {filtered.filter(t => t.type === 'expense').length > 0 && (
                <Button variant="ghost" size="icon" onClick={() => handleDeleteAll('expense')} className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="fintech-card overflow-hidden">
            <TransactionTable transactions={filtered.filter(t => t.type === 'expense')} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
