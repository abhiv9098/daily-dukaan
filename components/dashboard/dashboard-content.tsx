"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, PlusCircle, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { AnimatedCardGrid } from "@/components/cards/animated-card-grid";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { buildDashboardCards } from "@/lib/dashboard-cards";
import { ExportToolbar } from "@/components/export/export-toolbar";
import { formatCurrency } from "@/lib/utils";
import { AIInsights } from "./ai-insights";

export function DashboardContent() {
  const { stats, transactions, isLoaded, settings } = useHisaabContext();
  const { filters } = useFilterContext();
  const filtered = useFilteredTransactions(transactions, filters);
  const cards = buildDashboardCards(stats, transactions, settings.currency);

  if (!isLoaded) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm">Loading your hisaab...</p>
        </div>
      </div>
    );
  }

  const profit = stats.income - stats.expense;
  
  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  }, [transactions]);

  const bestPayment = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach(t => counts[t.paymentMode] = (counts[t.paymentMode] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  }, [transactions]);

  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-20">
      {/* Normalized Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60 sm:p-8"
      >
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-purple-500 shadow-inner">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{dateString}</span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl font-black tracking-tight md:text-5xl lg:text-6xl uppercase">
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">mera hisaab</span>
              </h1>
              <p className="max-w-xl text-base font-medium text-muted-foreground/80 md:text-lg">
                Your business reached a <span className="text-foreground font-bold">₹{(profit).toLocaleString()}</span> net position this month. You're doing great!
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button asChild size="lg" className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-8 font-bold shadow-xl shadow-purple-500/20 border-none hover:scale-105 transition-all">
                <Link href="/add">
                  <Plus className="h-5 w-5" />
                  New Entry
                </Link>
              </Button>
              <Button variant="outline" asChild size="lg" className="h-12 gap-2 rounded-2xl border-white/10 bg-white/5 px-8 font-bold backdrop-blur-md hover:bg-white/10 transition-all">
                <Link href="/reports">
                  <TrendingUp className="h-5 w-5" />
                  Analytics
                </Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative h-32 w-32 rounded-full border border-white/10 bg-white/5 p-3 backdrop-blur-2xl">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-purple-500/20 bg-purple-500/5 shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)]">
                <span className="text-[10px] font-bold text-purple-500">Margin</span>
                <span className="text-2xl font-black">{stats.income > 0 ? Math.round((profit/stats.income)*100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Background Accents */}
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
      </motion.div>

      {/* Main Stats Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Performance Overview</h2>
        </div>
        <AnimatedCardGrid cards={cards} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommendation Center */}
        <div className="lg:col-span-2">
          <AIInsights transactions={transactions} stats={stats} />
        </div>

        {/* Data Management Section */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-card/40 p-6 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Insights</h3>
              <PlusCircle className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Top Category</span>
                <span className="text-sm font-bold text-foreground">{topCategory}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Best Payment</span>
                <span className="text-sm font-bold text-foreground">{bestPayment}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Monthly Active</span>
                <span className="text-sm font-bold text-foreground">{transactions.length} txns</span>
              </div>
            </div>
          </div>
          <ExportToolbar />
        </div>
      </div>

      {/* Recent Activity Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between px-2">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
            <p className="text-sm font-medium text-muted-foreground">
              Monitor your latest business movements
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <TransactionFiltersBar />
          </div>
        </div>
        
        <div className="rounded-[2rem] border border-white/10 bg-card/40 p-3 shadow-2xl backdrop-blur-3xl dark:bg-[#09090b]/60">
          <TransactionTable transactions={filtered} />
        </div>
      </motion.div>
    </div>
  );
}
