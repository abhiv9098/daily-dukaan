"use client";

import Link from "next/link";
import { Plus, BarChart2, Sparkles, TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedCardGrid } from "@/components/cards/animated-card-grid";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { DaySelector } from "./day-selector";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { buildDashboardCards } from "@/lib/dashboard-cards";
import { useLanguage } from "@/context/language-context";
import { parseISO, format } from "date-fns";
import { motion } from "framer-motion";

export function DashboardContent() {
  const { transactions, isLoaded, settings, stats } = useHisaabContext();
  const { filters } = useFilterContext();
  const { t, language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);
  
  const currentDay = filters.dateFrom ? parseISO(filters.dateFrom) : new Date();
  const cards = buildDashboardCards(stats, transactions, settings.currency, language, currentDay);

  const profit = stats.remainingBalance;

  if (!isLoaded) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Premium Hero Section */}
      <section className="relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="premium-gradient p-8 rounded-[2.5rem] border-none text-white overflow-hidden relative shadow-2xl shadow-primary/30"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Sparkles className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Total Net Balance</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-8">
              {settings.currency} {profit.toLocaleString()}
            </h1>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                 <div className="flex items-center gap-2 mb-1 opacity-80">
                   <TrendingUp className="h-3 w-3" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Total Income</span>
                 </div>
                 <p className="text-xl font-bold">{settings.currency} {stats.income.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                 <div className="flex items-center gap-2 mb-1 opacity-80">
                   <TrendingDown className="h-3 w-3" />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Total Expense</span>
                 </div>
                 <p className="text-xl font-bold">{settings.currency} {stats.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-indigo-400/20 rounded-full blur-3xl" />
        </motion.div>
      </section>

      {/* Quick Actions & Day Selection */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Selected Period</h2>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
            {format(currentDay, "MMMM d, yyyy")}
          </span>
        </div>
        <DaySelector />
      </section>

      {/* Performance Overview */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-1">Performance Overview</h2>
        <AnimatedCardGrid cards={cards} />
      </section>

      {/* Recent Activity */}
      <section className="space-y-4 pb-10">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Recent Transactions</h2>
          <Button variant="ghost" asChild className="text-xs font-bold text-primary hover:bg-primary/10 rounded-full h-8 group">
            <Link href="/reports">
              See All <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="glass-card overflow-hidden">
          <TransactionTable transactions={filtered.slice(0, 5)} showActions={false} />
        </div>
      </section>
    </div>
  );
}

