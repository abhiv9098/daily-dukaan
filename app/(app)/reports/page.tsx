"use client";

import { ReportsCharts } from "@/components/reports/reports-charts";
import { ReportsSummary } from "@/components/reports/reports-summary";
import { TransactionFiltersBar } from "@/components/transactions/transaction-filters";
import { TransactionTable } from "@/components/transactions/transaction-table";
import { useHisaabContext } from "@/context/hisaab-context";
import { useFilterContext } from "@/context/filter-context";
import { useFilteredTransactions } from "@/hooks/use-filtered-transactions";
import { ExportToolbar } from "@/components/export/export-toolbar";
import { useLanguage } from "@/context/language-context";
import { PieChart, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const { transactions, isLoaded } = useHisaabContext();
  const { filters } = useFilterContext();
  const { language } = useLanguage();
  const filtered = useFilteredTransactions(transactions, filters);

  if (!isLoaded) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground animate-pulse">
            {language === "hi" ? "रिपोर्ट लोड हो रही है..." : "Analyzing your finances..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-10 pb-20">
      {/* Premium Reports Header */}
      <section className="relative">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2.5rem] glass-card p-8 md:p-12"
        >
          <div className="relative z-10 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-4 py-1.5 text-purple-500 border border-purple-500/20 shadow-inner">
                <TrendingUp className="h-4 w-4" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Insights</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">
                  {language === "hi" ? "वित्तीय विश्लेषण" : "Financial Analytics"}
                </h1>
                <p className="mt-3 text-lg font-medium text-muted-foreground max-w-xl">
                  {language === "hi" ? "आपकी दुकान के प्रदर्शन और प्रवृत्तियों के दृश्य विश्लेषण।" : "Visual insights into your dukaan's performance and trends."}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="rounded-[2rem] bg-gradient-to-br from-purple-500 to-blue-600 p-6 text-white shadow-2xl shadow-purple-500/30">
                <PieChart className="h-10 w-10" />
              </div>
            </div>
          </div>
          
          {/* Subtle background glow */}
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-purple-500/10 blur-[100px]" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px]" />
        </motion.div>
      </section>

      <div className="space-y-10">
        {/* Filters and Summary */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
               <Calendar className="h-5 w-5 text-purple-600" />
               Timeframe Filters
            </h2>
            <TransactionFiltersBar />
          </div>
          <ReportsSummary transactions={filtered} />
        </div>
        
        {/* Main Analytics Grid */}
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ReportsCharts transactions={filtered} />
          </div>
          
          <div className="lg:col-span-4 space-y-8">
            <ExportToolbar />
            
            <div className="rounded-[2.5rem] glass-card p-8 space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                 <ArrowRight className="h-4 w-4 text-purple-600" />
                 {language === "hi" ? "त्वरित आँकड़े" : "Quick Stats"}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{language === "hi" ? "फ़िल्टर की गई प्रविष्टियाँ" : "Filtered Entries"}</span>
                  <span className="text-xl font-black">{filtered.length}</span>
                </div>
                
                <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-xs font-bold text-muted-foreground uppercase">{language === "hi" ? "तारीख सीमा" : "Date Range"}</span>
                  <span className="text-sm font-black text-purple-500">
                    {filters.dateFrom || (language === "hi" ? "प्रारंभ" : "Start")} — {filters.dateTo || (language === "hi" ? "आज" : "Today")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Ledger Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <div className="space-y-1">
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                {language === "hi" ? "विस्तृत खाता" : "Detailed Ledger"}
              </h2>
              <p className="text-sm font-medium text-muted-foreground">
                Chronological breakdown of filtered records
              </p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-purple-500 bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20">
              {language === "hi" ? `${transactions.length} में से ${filtered.length} रिकॉर्ड दिखा रहा है` : `Showing ${filtered.length} of ${transactions.length} records`}
            </div>
          </div>
          <div className="p-2 rounded-[2.5rem] glass-card">
            <TransactionTable transactions={filtered} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
