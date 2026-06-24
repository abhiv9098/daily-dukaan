"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Plus, 
  Wallet, 
  Users, 
  Search, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft, 
  FileText, 
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Trash2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { useLanguage } from "@/context/language-context";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function DashboardContent() {
  const { 
    transactions, 
    customers, 
    isLoaded, 
    settings, 
    stats, 
    user,
    addCreditTransaction,
    deleteTransaction
  } = useHisaabContext();
  
  const { filters } = useFilterContext();
  const { t } = useLanguage();
  const filteredTransactions = useFilteredTransactions(transactions, filters);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);

  const categoryTransactions = useMemo(() => {
    if (!selectedCategory) return [];
    return (transactions || []).filter(t => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  const profit = Math.max(0, stats.remainingBalance);
  
  // Calculate Lena Hai & Dena Hai
  const lenaHai = stats.totalCreditGiven || 0;
  const denaHai = stats.totalOutstandingLiability || 0;

  // Filter customers/parties based on search query
  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    if (!searchQuery.trim()) return customers;
    const query = searchQuery.toLowerCase();
    return customers.filter(
      c => c.name.toLowerCase().includes(query) || (c.phone && c.phone.includes(query))
    );
  }, [customers, searchQuery]);

  // Handle quick payment logging for customers directly from dashboard
  const handleQuickPayment = async (e: React.MouseEvent, customerId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const value = window.prompt("Enter payment amount received:");
    if (!value) return;
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return;

    await addCreditTransaction({
      customerId,
      amount: num,
      type: 'receive',
      description: 'Payment Mila (Quick Entry)',
      date: new Date().toISOString(),
    });
  };

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-xs text-slate-500 font-bold tracking-wider uppercase animate-pulse">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // Categories Breakdown
  const categories: Record<string, number> = {};
  (transactions || []).forEach((t: any) => {
    const key = t.category || "Other";
    categories[key] = (categories[key] || 0) + Math.abs(t.amount || 0);
  });

  const topCategories = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 pb-24 px-1 select-none">
      
      {/* Greeting and Merchant Brand Info */}
      <section className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Hello, {user?.user_metadata?.full_name?.split(' ')[0] || 'Merchant'}
            </h2>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
              {settings.shopName || "Apna Hisaab"} Ledger
            </p>
          </div>
          
          <Link href="/profile">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm"
            >
              <Users className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Elegant & Minimalist Net Balance Card (fintech style) */}
      <section>
        <div className="relative overflow-hidden bg-gradient-to-tr from-[#6D5DF6]/10 to-[#818cf8]/5 dark:from-[#6D5DF6]/20 dark:to-slate-900 border border-indigo-100/40 dark:border-white/5 rounded-[24px] shadow-[0_8px_32px_rgba(109,93,246,0.04)] p-5 space-y-5">
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
          
          {/* Main Net Balance Header */}
          <div className="flex items-baseline justify-between relative z-10">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-indigo-650/70 dark:text-indigo-400 uppercase tracking-widest block">
                Total Net Balance
              </span>
              <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white block">
                {settings.currency}{profit.toLocaleString()}
              </span>
            </div>
            
            <div className="h-10 w-10 rounded-2xl bg-[#6D5DF6]/10 dark:bg-[#6D5DF6]/20 flex items-center justify-center text-[#6D5DF6]">
              <Wallet className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>

          {/* Quick Net Indicator Statement */}
          <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium border-t border-indigo-100/30 dark:border-white/5 pt-4 flex items-center gap-1.5 relative z-10">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Real-time balance tracking across active bookkeeping ledgers
          </div>

          {/* Lena & Dena Statistic Cards with Icons */}
          <div className="grid grid-cols-2 gap-4 relative z-10">
            {/* Lena Hai (Get) */}
            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                  Lena Hai
                </span>
                <div className="h-7 w-7 rounded-lg bg-rose-50 dark:bg-rose-950/30 flex items-center justify-center text-rose-600 dark:text-rose-455">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="text-lg font-black text-rose-700 dark:text-rose-400 truncate">
                {settings.currency}{lenaHai.toLocaleString()}
              </div>
            </div>

            {/* Dena Hai (Pay) */}
            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                  Dena Hai
                </span>
                <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-450">
                  <TrendingDown className="h-4 w-4" />
                </div>
              </div>
              <div className="text-lg font-black text-emerald-700 dark:text-emerald-400 truncate">
                {settings.currency}{denaHai.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Search bar */}
      <section>
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-[#6D5DF6] transition-colors pointer-events-none" />
          <input 
            type="text" 
            placeholder="Search active parties, phone, or tags..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 focus:bg-white dark:focus:bg-slate-900 h-12 pl-11 pr-4 rounded-2xl border border-transparent focus:border-[#6D5DF6]/30 dark:focus:border-[#6D5DF6]/50 text-sm font-semibold outline-none transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus:shadow-[0_4px_20px_rgba(109,93,246,0.06)]"
          />
        </div>
      </section>

      {/* Improved Party Wise Hisaab Ledger List */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Party Wise Hisaab</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
              {filteredCustomers.length} Active {filteredCustomers.length === 1 ? "Party" : "Parties"}
            </p>
          </div>
          
          <Link href="/udhar/add">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs font-bold text-[#6D5DF6] hover:text-[#6D5DF6]/90 flex items-center gap-1 hover:bg-slate-100/50 dark:hover:bg-white/5 rounded-lg px-2 h-8"
            >
              <Plus className="h-3.5 w-3.5" /> Add Party
            </Button>
          </Link>
        </div>

        {/* Empty State Redesign */}
        {filteredCustomers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6D5DF6]/20 to-transparent" />
            
            {/* Friendly abstract vector illustration */}
            <svg className="mx-auto mb-5 w-32 h-32 text-indigo-400 dark:text-indigo-900" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="35" y="25" width="50" height="70" rx="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.02" />
              <line x1="47" y1="45" x2="73" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="47" y1="58" x2="65" y2="58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="73" cy="58" r="3" fill="#6D5DF6" />
              <line x1="47" y1="71" x2="73" y2="71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              {/* Floating elements */}
              <circle cx="25" cy="40" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <path d="M98 75L93 80L98 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="95" cy="35" r="4" fill="currentColor" />
            </svg>
            
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              {searchQuery ? "No matching parties found" : "Start Your Ledger"}
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-[250px] mx-auto mb-10 leading-relaxed">
              {searchQuery 
                ? "Try searching for a different name or phone number" 
                : "Add your customers to log credit entries (Udhar), record payments, and track hisaab."
              }
            </p>

            <Link href="/udhar/add" className="inline-block w-full max-w-[220px] mt-2">
              <Button className="w-full h-12 rounded-2xl font-bold bg-[#6D5DF6] hover:bg-[#6D5DF6]/95 text-white transition-all shadow-[0_4px_14px_rgba(109,93,246,0.3)] hover:shadow-[0_6px_20px_rgba(109,93,246,0.4)] hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
                Add First Party
              </Button>
            </Link>
          </div>
        ) : (
          /* Party list view */
          <div className="space-y-2.5">
            {filteredCustomers.slice(0, 4).map((c) => {
              const isOwed = c.totalCredit > 0; // customer owes us
              const isOwedUs = c.totalCredit < 0; // we owe customer
              
              return (
                <Link key={c.id} href="/khata" className="block">
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-200 dark:hover:border-white/10 transition duration-300">
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Avatar initial circular badge */}
                      <div className="h-10 w-10 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm rounded-full shrink-0">
                        {c.name[0]?.toUpperCase()}
                      </div>
                      
                      {/* Customer Details */}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                          {c.phone || "No Mobile"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Ledger Balance */}
                      <div className="text-right">
                        <div className={cn(
                          "text-sm font-black",
                          isOwed ? "text-rose-600 dark:text-rose-400" : 
                          isOwedUs ? "text-emerald-600 dark:text-emerald-400" : 
                          "text-slate-400"
                        )}>
                          {settings.currency} {Math.abs(c.totalCredit).toLocaleString()}
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          {isOwed ? "Lena" : isOwedUs ? "Dena" : "Settled"}
                        </span>
                      </div>

                      {/* Quick action button for Payment Mila */}
                      {isOwed && (
                        <Button 
                          onClick={(e) => handleQuickPayment(e, c.id)}
                          className="h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-100/80 border border-emerald-100/30 text-[10px] font-black px-3"
                        >
                          Mila
                        </Button>
                      )}
                      
                      <ChevronRight className="h-4 w-4 text-slate-350" />
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {filteredCustomers.length > 4 && (
              <Link href="/khata" className="block text-center pt-2">
                <span className="text-xs font-bold text-[#6D5DF6] hover:text-[#6D5DF6]/95">
                  View all {filteredCustomers.length} parties
                </span>
              </Link>
            )}
          </div>
        )}
      </section>

      {/* Summary insights / breakdown card */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Spending Categories card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] shadow-sm p-5 space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Category Breakdown</h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Where your business spends</p>
          </div>
          
          <ul className="space-y-2">
            {topCategories.length ? topCategories.map((c) => (
              <li 
                key={c.name} 
                onClick={() => {
                  setSelectedCategory(c.name);
                  setIsCategoryDialogOpen(true);
                }}
                className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/30 p-2.5 rounded-xl border border-slate-100/50 dark:border-white/5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition duration-150"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-7 w-7 rounded-lg bg-white dark:bg-slate-800 border border-slate-200/65 dark:border-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400 text-xs font-black">
                    {c.name[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{c.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {settings.currency} {c.value.toLocaleString()}
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </div>
              </li>
            )) : <li className="text-xs text-slate-400 text-center py-4 font-medium">No spending categories yet</li>}
          </ul>
        </div>

        {/* Quick analytics info */}
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] shadow-sm p-5 flex flex-col justify-between space-y-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Recent Cashflow</h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Income & Expense Overview</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pb-1">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Income</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {settings.currency} {stats.income.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-rose-50 dark:bg-rose-950/20 flex items-center justify-center text-rose-500">
                <TrendingDown className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Expense</span>
                <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                  {settings.currency} {stats.expense.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cashbook Entries list */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Cashbook Entries</h3>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Latest income and expense records</p>
          </div>
          <Link href="/reports" className="text-xs font-bold text-slate-500 hover:text-slate-800">
            View all
          </Link>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] overflow-hidden shadow-sm">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-medium">No transactions recorded yet</div>
          ) : (
            <div className="divide-y divide-slate-50 dark:divide-white/5">
              {filteredTransactions.slice(0, 4).map((t) => {
                const isIncome = t.type === 'income';
                return (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-white/5 transition duration-150 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border",
                        isIncome 
                          ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                          : "bg-rose-500/10 border-rose-500/10 text-rose-600 dark:text-rose-400"
                      )}>
                        {isIncome ? <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} /> : <ArrowDownLeft className="h-5 w-5" strokeWidth={2.5} />}
                      </div>
                      
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{t.description || t.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded">
                            {t.category}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-slate-400" /> {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className={cn(
                          "text-xs font-black",
                          isIncome ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                        )}>
                          {isIncome ? "+" : "-"} {settings.currency} {t.amount.toLocaleString()}
                        </span>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-xl text-slate-450 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (window.confirm("Delete this entry?")) {
                            deleteTransaction(t.id);
                          }
                        }}
                        aria-label="Delete entry"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Category Transactions Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="border-none max-w-[95vw] sm:max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#6D5DF6]" />
              {selectedCategory} Entries
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
            {categoryTransactions.length > 0 ? (
              categoryTransactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {t.description || "Entry"}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 font-bold">
                      <Calendar className="h-3 w-3" />
                      {new Date(t.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-black text-sm text-slate-900 dark:text-white">
                      {settings.currency}{t.amount.toLocaleString()}
                    </div>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        if (window.confirm("Delete this entry?")) {
                          deleteTransaction(t.id);
                        }
                      }}
                      className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors"
                      aria-label="Delete transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-xs text-slate-400 font-medium">
                No entries for this category.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
