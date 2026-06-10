"use client";

import Link from "next/link";
import { Plus, BarChart2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCardGrid } from "@/components/cards/animated-card-grid";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { buildDashboardCards } from "@/lib/dashboard-cards";
import { useLanguage } from "@/context/language-context";

export function DashboardContent() {
  const { stats, transactions, isLoaded, settings } = useHisaabContext();
  const { filters } = useFilterContext();
  const { t, language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);
  const cards = buildDashboardCards(stats, transactions, settings.currency, language);

  const profit = stats.income - stats.expense;

  if (!isLoaded) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Minimal Fintech Hero Section */}
      <section className="flex flex-col items-center text-center py-6 md:py-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-[10px] font-bold uppercase tracking-widest mb-4">
          <Sparkles className="h-3 w-3" />
          {language === "hi" ? "आपका बैलेंस" : "Total Balance"}
        </div>
        <h1 className="text-5xl md:text-6xl font-semibold tracking-tighter text-foreground">
          ₹{profit.toLocaleString("en-IN")}
        </h1>
        
        <div className="mt-6 flex flex-row items-center justify-center gap-3 w-full max-w-sm px-4 md:px-0">
          <Button asChild className="flex-1 rounded-full h-12 font-semibold shadow-sm text-sm bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/add">
              <Plus className="h-4 w-4 mr-2" /> {t("newEntry")}
            </Link>
          </Button>
          <Button asChild variant="secondary" className="flex-1 rounded-full h-12 font-semibold text-sm">
            <Link href="/reports">
              <BarChart2 className="h-4 w-4 mr-2" /> Analytics
            </Link>
          </Button>
        </div>
      </section>

      {/* Overview Cards */}
      <section>
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 px-1">Overview</h2>
        <AnimatedCardGrid cards={cards} />
      </section>

      {/* Recent Transactions */}
      <section className="space-y-3 pb-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Activity</h2>
          <Link href="/reports" className="text-xs font-bold text-primary hover:underline">See All</Link>
        </div>
        <div className="rounded-[20px] border border-border bg-card overflow-hidden shadow-sm">
          <TransactionTable transactions={filtered.slice(0, 8)} showActions={false} />
        </div>
      </section>
    </div>
  );
}
