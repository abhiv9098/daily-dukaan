"use client";

import { useMemo } from "react";
import Link from "next/link";
import { 
  Plus, 
  PlusCircle, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Zap,
  Target,
  BarChart2
} from "lucide-react";
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
import { useLanguage } from "@/context/language-context";
import { AIInsights } from "./ai-insights";
import { cn } from "@/lib/utils";

export function DashboardContent() {
  const { stats, transactions, isLoaded, settings } = useHisaabContext();
  const { filters } = useFilterContext();
  const { t, language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);
  const cards = buildDashboardCards(stats, transactions, settings.currency, language);

  const profit = stats.income - stats.expense;
  
  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach(t => counts[t.category] = (counts[t.category] || 0) + 1);
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";
  }, [transactions]);

  const today = new Date();
  const dateString = today.toLocaleDateString(language === "hi" ? "hi-IN" : "en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            {language === "hi" ? "लोड हो रहा है..." : "Syncing your data..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Premium Hero Section */}
      <section className="relative group">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 glass-card"
        >
          <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
            <div className="space-y-6 max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-purple-500 border border-purple-500/20 shadow-inner"
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-widest">{dateString}</span>
              </motion.div>
              
              <div className="space-y-3">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
                  <span className="text-gradient">mera hisaab</span>
                </h1>
                <p className="text-lg md:text-xl font-medium text-muted-foreground/90 leading-relaxed">
                  {language === "hi" ? (
                    <>आपकी व्यावसायिक स्थिति इस महीने <span className="text-foreground font-black underline decoration-purple-500/30">₹{(profit).toLocaleString()}</span> है। आप बहुत अच्छा कर रहे हैं!</>
                  ) : (
                    <>Your business reached a <span className="text-foreground font-black underline decoration-purple-500/30">₹{(profit).toLocaleString()}</span> net position this month. You're doing great!</>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg" className="h-14 gap-2 rounded-2xl purple-gradient px-8 font-black shadow-2xl shadow-purple-600/30 border-none hover:scale-105 active:scale-95 transition-all">
                  <Link href="/add">
                    <Plus className="h-6 w-6" />
                    {t("newEntry")}
                  </Link>
                </Button>
                <Button variant="outline" asChild size="lg" className="h-14 gap-2 rounded-2xl border-white/10 bg-white/5 px-8 font-bold backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all">
                  <Link href="/reports">
                    <TrendingUp className="h-6 w-6" />
                    {language === "hi" ? "विश्लेषण" : "Analytics"}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Quick Metrics Circle */}
            <div className="relative hidden xl:block">
              <div className="h-56 w-56 rounded-full border border-white/10 bg-white/5 p-4 backdrop-blur-3xl shadow-inner flex items-center justify-center">
                <div className="h-full w-full rounded-full border-4 border-purple-500/20 bg-purple-500/5 flex flex-col items-center justify-center gap-1 shadow-[0_0_50px_-10px_rgba(168,85,247,0.3)]">
                  <span className="text-xs font-black text-purple-500 uppercase tracking-widest">Margin</span>
                  <span className="text-5xl font-black tracking-tighter">{stats.income > 0 ? Math.round((profit/stats.income)*100) : 0}%</span>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full mt-1">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>+2.4%</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg animate-bounce">
                <Zap className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>

          {/* Abstract background shapes */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="h-8 w-1 bg-purple-600 rounded-full" />
          <h2 className="text-xl font-black uppercase tracking-widest text-foreground">
            {language === "hi" ? "प्रदर्शन अवलोकन" : "Performance Overview"}
          </h2>
        </div>
        <AnimatedCardGrid cards={cards} />
      </section>

      <section className="grid gap-8 lg:grid-cols-12">
        {/* Insights & Recommendations */}
        <div className="lg:col-span-8 space-y-8">
           <AIInsights transactions={transactions} stats={stats} />
           
           <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-2">
                <h2 className="text-xl font-black uppercase tracking-widest shrink-0">{t("recentTransactions")}</h2>
                <div className="w-full lg:w-auto overflow-hidden">
                  <TransactionFiltersBar />
                </div>
              </div>
              <div className="p-2 rounded-[2.5rem] glass-card">
                <TransactionTable transactions={filtered} />
              </div>
           </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="lg:col-span-4 space-y-8">
          <div className="rounded-[2.5rem] glass-card p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <Target className="h-4 w-4 text-purple-500" />
                {language === "hi" ? "त्वरित अंतर्दृष्टि" : "Quick Insights"}
              </h3>
              <PlusCircle className="h-5 w-5 text-muted-foreground/30 hover:text-purple-500 transition-colors cursor-pointer" />
            </div>
            
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/20 transition-all group">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{t("category")}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">{t(topCategory as any)}</span>
                  <div className="h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <BarChart2 className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all group">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{language === "hi" ? "सर्वश्रेष्ठ भुगतान" : "Best Payment"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black">UPI</span>
                  <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-[2rem] bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 flex flex-col items-center text-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-xl">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-wider italic">Premium Account</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">Unlock full export features</p>
                </div>
                <Button className="w-full rounded-xl bg-white text-purple-600 font-bold hover:bg-white/90">Upgrade Now</Button>
              </div>
            </div>
          </div>
          
          <ExportToolbar />
        </div>
      </section>
    </div>
  );
}
