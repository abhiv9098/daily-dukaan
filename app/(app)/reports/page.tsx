"use client";

import { ReportsCharts } from "@/components/reports/reports-charts";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { useLanguage } from "@/context/language-context";

export default function ReportsPage() {
  const { transactions, isLoaded } = useHisaabContext();
  const { filters } = useFilterContext();
  const { language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);

  if (!isLoaded) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 px-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
           {language === "hi" ? "विश्लेषण" : "Analytics"}
        </h1>
        <p className="text-sm text-muted-foreground font-medium">Insights and visual breakdowns.</p>
      </div>

      <TransactionFiltersBar showSearch={false} />

      <section>
        <ReportsSummary transactions={filtered} />
      </section>

      <section className="bg-card border border-border rounded-[24px] shadow-sm overflow-hidden p-2 md:p-6">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-6 ml-2">Trends</h2>
        <ReportsCharts transactions={filtered} />
      </section>
    </div>
  );
}
