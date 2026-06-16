"use client";

import Link from "next/link";
import { Plus, Sparkles, TrendingUp, TrendingDown, Wallet, ArrowRight, Users, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { useLanguage } from "@/context/language-context";
import { motion } from "framer-motion";

export function DashboardContent() {
  const { transactions, isLoaded, settings, stats, user } = useHisaabContext();
  const { filters } = useFilterContext();
  const { language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);
  
  const profit = stats.remainingBalance;
  const savingsProgress = stats.income > 0 ? (profit / stats.income) * 100 : 0;

  if (!isLoaded) return (
    <div className="flex h-[50vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
    </div>
  );

  return (
    <div className="space-y-6 pb-24">
      {/* Compact Greeting */}
      <section className="px-1 pt-1">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Namaste, {user?.user_metadata?.full_name?.split(' ')[0] || 'Local'}!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-bold mt-0.5">Sahi ja rahe ho, aaj ka kaam shuru karein?</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-white/5 shadow-sm">
             <Sparkles className="h-5 w-5 text-indigo-500 animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Aapki Bachat - Top Summary Card */}
      <section className="relative group px-0.5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-gradient p-7 rounded-[2rem] border-none text-white relative overflow-hidden shadow-xl shadow-indigo-500/20"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/80">Aapki Bachat (Total Savings)</span>
                <h1 className="text-4xl font-black tracking-tighter mt-1">
                  {settings.currency} {profit.toLocaleString()}
                </h1>
              </div>
              <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md border border-white/20">
                <Wallet className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2.5 mb-6">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                 <span className="text-[8px] font-bold uppercase tracking-wider text-white/70 block mb-0.5">Income</span>
                 <p className="text-xs font-black text-white">{settings.currency} {stats.income.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                 <span className="text-[8px] font-bold uppercase tracking-wider text-white/70 block mb-0.5">Expense</span>
                 <p className="text-xs font-black text-white">{settings.currency} {stats.expense.toLocaleString()}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-center">
                 <span className="text-[8px] font-bold uppercase tracking-wider text-white/70 block mb-0.5">Net Profit</span>
                 <p className="text-xs font-black text-white">{settings.currency} {profit.toLocaleString()}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-white/80">
                <span>Monthly Growth</span>
                <span>{savingsProgress.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, savingsProgress)}%` }}
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)]"
                />
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-8 -mb-8" />
        </motion.div>
      </section>

      {/* 4 Separate Action Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3.5 px-0.5">
        {/* Income Card */}
        <motion.div whileTap={{ scale: 0.98 }} className="fintech-card p-5 flex flex-col gap-4 relative overflow-hidden group border-slate-200/60 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 shadow-inner">
                <TrendingUp className="h-5 w-5" />
              </div>
              <Link href="/add?type=income">
                <Button size="icon" variant="ghost" className="rounded-lg hover:bg-emerald-50 text-emerald-600 h-8 w-8">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>
           </div>
           <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Income (Kamayi)</h3>
              <div className="grid grid-cols-2 gap-4 mt-2.5">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.todayIncome.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.monthlyIncome.toLocaleString()}</p>
                 </div>
              </div>
           </div>
           <Link href="/reports" className="text-[9px] font-black text-emerald-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 hover:underline">
              Income History <ArrowRight className="h-2.5 w-2.5" />
           </Link>
        </motion.div>

        {/* Expense Card */}
        <motion.div whileTap={{ scale: 0.98 }} className="fintech-card p-5 flex flex-col gap-4 relative overflow-hidden group border-slate-200/60 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 border border-rose-500/10 shadow-inner">
                <TrendingDown className="h-5 w-5" />
              </div>
              <Link href="/add?type=expense">
                <Button size="icon" variant="ghost" className="rounded-lg hover:bg-rose-50 text-rose-600 h-8 w-8">
                  <Plus className="h-5 w-5" />
                </Button>
              </Link>
           </div>
           <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Expense (Kharcha)</h3>
              <div className="grid grid-cols-2 gap-4 mt-2.5">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.todayExpense.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Monthly</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.monthlyExpense.toLocaleString()}</p>
                 </div>
              </div>
           </div>
           <Link href="/reports" className="text-[9px] font-black text-rose-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 hover:underline">
              Expense Categories <ArrowRight className="h-2.5 w-2.5" />
           </Link>
        </motion.div>

        {/* Borrowed Money Card */}
        <motion.div whileTap={{ scale: 0.98 }} className="fintech-card p-5 flex flex-col gap-4 relative overflow-hidden group border-slate-200/60 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 shadow-inner">
                <Users className="h-5 w-5" />
              </div>
              <div className="bg-indigo-50 px-2 py-0.5 rounded-md">
                <span className="text-[8px] font-black text-indigo-600 uppercase">Udhar Liya</span>
              </div>
           </div>
           <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Borrowed Money</h3>
              <div className="grid grid-cols-2 gap-4 mt-2.5">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.totalBorrowed.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Soon</p>
                    <p className="font-black text-sm text-rose-500 mt-0.5">Soon</p>
                 </div>
              </div>
           </div>
           <Link href="/liabilities" className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 hover:underline">
              Repayment Status <ArrowRight className="h-2.5 w-2.5" />
           </Link>
        </motion.div>

        {/* Credit Given Card */}
        <motion.div whileTap={{ scale: 0.98 }} className="fintech-card p-5 flex flex-col gap-4 relative overflow-hidden group border-slate-200/60 shadow-sm">
           <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-500/10 shadow-inner">
                <Store className="h-5 w-5" />
              </div>
              <div className="bg-amber-50 px-2 py-0.5 rounded-md">
                <span className="text-[8px] font-black text-amber-600 uppercase">Udhar Diya</span>
              </div>
           </div>
           <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Credit Given</h3>
              <div className="grid grid-cols-2 gap-4 mt-2.5">
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                    <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{settings.currency} {stats.totalCreditGiven.toLocaleString()}</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recovery</p>
                    <p className="font-black text-sm text-emerald-500 mt-0.5">80%</p>
                 </div>
              </div>
           </div>
           <Link href="/khata" className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em] mt-1 flex items-center gap-1 hover:underline">
              Recovery Status <ArrowRight className="h-2.5 w-2.5" />
           </Link>
        </motion.div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4 px-1 pb-10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Hisaab</h2>
          <Button variant="ghost" asChild className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-xl h-9 group">
            <Link href="/reports">
              View Reports <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="fintech-card overflow-hidden">
          <TransactionTable transactions={filtered.slice(0, 5)} showActions={false} />
        </div>
      </section>
    </div>
  );
}
