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
import { BarChart3, Wallet, Trash2, ListFilter, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-1 px-1">
        <h2 className="text-xl font-bold tracking-tight text-foreground">
           {language === "hi" ? "विश्लेषण और बजट" : "Analytics & Budgets"}
        </h2>
        <p className="text-sm text-muted-foreground">Detailed insights and expense planning.</p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="w-full grid grid-cols-2 h-14 bg-card/50 backdrop-blur-xl border-none rounded-2xl p-1 mb-6 shadow-sm">
          <TabsTrigger 
            value="analytics" 
            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger 
            value="budgets" 
            className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all font-bold flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Budgets
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6 mt-0">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Selected Period</h2>
              </div>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                Quick Select
              </span>
            </div>
            <DaySelector />
          </section>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <TransactionFiltersBar showSearch={false} />
            </div>
            {filtered.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteAll}
                className="rounded-full font-bold shadow-lg shadow-destructive/20 h-10 px-4"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete All
              </Button>
            )}
          </div>
          
          <section>
            <ReportsSummary transactions={filtered} />
          </section>

          <section className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-border/50 bg-secondary/20">
              <ListFilter className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Filtered Entries</h3>
              <span className="ml-auto text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                {filtered.length} Records
              </span>
            </div>
            <TransactionTable transactions={filtered} />
          </section>
        </TabsContent>

        <TabsContent value="budgets" className="space-y-6 mt-0">
          <BudgetsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

