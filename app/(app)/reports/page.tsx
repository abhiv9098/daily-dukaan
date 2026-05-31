"use client";

import { ReportsCharts } from "@/components/reports/reports-charts";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { ExportToolbar } from "@/components/export/export-toolbar";
import { PieChart } from "lucide-react";

export default function ReportsPage() {
  const { transactions, isLoaded } = useHisaabContext();
  const { filters } = useFilterContext();
  const filtered = useFilteredTransactions(transactions, filters);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-12">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-2xl backdrop-blur-2xl dark:bg-[#09090b]/60 sm:p-8">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
              Financial Analytics
            </h1>
            <p className="mt-1 text-base text-muted-foreground">
              Visual insights into your dukaan's performance and trends.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-purple-500/10 p-3 text-purple-500 shadow-inner">
              <PieChart className="h-6 w-6" />
            </div>
          </div>
        </div>
        
        {/* Subtle background glow */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      </div>

      <div className="space-y-6">
        <TransactionFiltersBar />
        <ReportsSummary transactions={filtered} />
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ReportsCharts transactions={filtered} />
          </div>
          <div className="space-y-6">
            <ExportToolbar />
            <div className="rounded-3xl border border-white/10 bg-card/40 p-6 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quick Stats</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Filtered Entries</span>
                  <span className="font-semibold">{filtered.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date Range</span>
                  <span className="font-semibold">
                    {filters.dateFrom || "Start"} — {filters.dateTo || "Today"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold tracking-tight">Detailed Ledger</h2>
            <div className="text-xs font-medium text-muted-foreground bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
              Showing {filtered.length} of {transactions.length} records
            </div>
          </div>
          <div className="p-3 rounded-2xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            <TransactionTable transactions={filtered} />
          </div>
        </div>
      </div>
    </div>
  );
}
