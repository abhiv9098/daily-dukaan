"use client";

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

export default function ReportsPage() {
  const { transactions, isLoaded, deleteTransactions } = useHisaabContext();
  const { filters } = useFilterContext();
  const { language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);

  if (!isLoaded) return null;

  const handleDeleteAll = () => {
    if (confirm(`Are you sure you want to delete all ${filtered.length} filtered transactions?`)) {
      deleteTransactions(filtered.map(t => t.id));
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

      <Tabs defaultValue="kamayi" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl p-1 mb-8">
          <TabsTrigger 
            value="kamayi" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all font-bold"
          >
            Kamayi
          </TabsTrigger>
          <TabsTrigger 
            value="udhar" 
            className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm transition-all font-bold"
          >
            Udhar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kamayi" className="space-y-8 mt-0">
          {/* Quick Filters */}
          <section className="space-y-4">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Time Period</h3>
                <div className="flex gap-2">
                   {['Today', 'Week', 'Month', 'Year'].map(p => (
                     <button key={p} className="text-[10px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-colors">{p}</button>
                   ))}
                </div>
             </div>
             <DaySelector />
          </section>

          {/* Export & Data Center */}
          <section className="px-1">
             <ExportToolbar />
          </section>

          {/* Core Analytics */}
          <section className="space-y-6">
            <ReportsSummary transactions={filtered.filter(t => t.type === 'income')} />
          </section>

          {/* Detailed Entries */}
          <section className="space-y-4 px-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Income Ledger</h3>
              <div className="flex gap-2">
                <TransactionFiltersBar showSearch={false} />
                {filtered.filter(t => t.type === 'income').length > 0 && (
                  <Button variant="ghost" size="icon" onClick={handleDeleteAll} className="h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            <div className="fintech-card overflow-hidden">
              <TransactionTable transactions={filtered.filter(t => t.type === 'income')} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="udhar" className="space-y-8 mt-0">
          {/* Detailed Entries */}
          <section className="space-y-4 px-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Credit (Udhar) Ledger</h3>
              <div className="flex gap-2">
                <TransactionFiltersBar showSearch={false} />
              </div>
            </div>
            <div className="fintech-card overflow-hidden">
              <TransactionTable transactions={filtered.filter(t => !!t.customerName)} />
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}
