"use client";

import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Zap, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Transaction, DashboardStats } from "@/types";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface AIInsightsProps {
  transactions: Transaction[];
  stats: DashboardStats;
}

export function AIInsights({ transactions, stats }: AIInsightsProps) {
  const insights = useMemo(() => {
    const list = [];
    
    const profitMargin = stats.income > 0 ? ((stats.income - stats.expense) / stats.income) * 100 : 0;
    
    if (profitMargin > 30) {
      list.push({
        title: "High Efficiency",
        icon: TrendingUp,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        text: "Your profit margin is excellent at " + profitMargin.toFixed(0) + "%. Consider scaling your high-margin stock."
      });
    } else if (profitMargin < 15 && stats.income > 0) {
      list.push({
        title: "Margin Alert",
        icon: AlertCircle,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        text: "Margins are tightening. Review your expense categories for potential optimization."
      });
    }

    const upiSales = transactions.filter(t => t.paymentMode === "UPI").length;
    if (upiSales > transactions.length * 0.5 && transactions.length > 5) {
      list.push({
        title: "Digital Growth",
        icon: Zap,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        text: "Digital adoption is high! Your customers prefer UPI, reducing cash handling risks."
      });
    }

    if (stats.totalCreditGiven > stats.remainingBalance && stats.remainingBalance > 0) {
      list.push({
        title: "Credit Risk",
        icon: ShieldCheck,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        text: "Outstanding credit is higher than your net balance. Focus on collecting payments."
      });
    }

    if (list.length < 3) {
      list.push({
        title: "Data Strategy",
        icon: Sparkles,
        color: "text-indigo-500",
        bg: "bg-indigo-500/10",
        text: "Detailed descriptions help AI provide more accurate trend analysis and sales predictions."
      });
    }

    return list.slice(0, 3);
  }, [transactions, stats]);

  return (
    <Card className="glass-card border-none overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 premium-gradient shimmer" />
      
      <div className="p-6 border-b border-border/30 bg-secondary/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-tight">AI Insights</h3>
            <p className="text-[10px] uppercase tracking-widest font-black text-muted-foreground/60">Smart Recommendations</p>
          </div>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
      </div>
      
      <div className="p-4 grid gap-4">
        {insights.map((insight, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-all group"
          >
            <div className={`shrink-0 rounded-xl p-2.5 ${insight.bg} group-hover:scale-110 transition-transform`}>
              <insight.icon className={`h-5 w-5 ${insight.color}`} />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold">{insight.title}</h4>
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
                {insight.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}

