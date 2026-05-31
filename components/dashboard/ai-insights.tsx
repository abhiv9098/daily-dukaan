"use client";

import { Sparkles, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, DashboardStats } from "@/types";
import { useMemo } from "react";

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
        color: "text-green-500",
        bg: "bg-green-500/10",
        text: "Your profit margin is excellent. This is a great time to scale or diversify your stock."
      });
    } else if (profitMargin < 15 && stats.income > 0) {
      list.push({
        title: "Margin Alert",
        icon: AlertCircle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        text: "Margins are tightening. Review your latest expense categories for potential savings."
      });
    }

    const upiSales = transactions.filter(t => t.paymentMode === "UPI").length;
    if (upiSales > transactions.length * 0.5) {
      list.push({
        title: "Digital Growth",
        icon: Sparkles,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        text: "Digital adoption is high! Most customers prefer UPI, keeping your operations modern."
      });
    }

    if (list.length < 3) {
      list.push({
        title: "Data Strategy",
        icon: Sparkles,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
        text: "Add descriptions to all entries to unlock more advanced trend analysis and AI predictions."
      });
    }

    return list;
  }, [transactions, stats]);

  return (
    <Card className="rounded-3xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60 overflow-hidden">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-purple-500/5 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-base font-bold">Smart Recommendations</h3>
            <p className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground opacity-60">AI-Powered Insights</p>
          </div>
        </div>
      </div>
      
      <div className="p-6 grid gap-4 sm:grid-cols-2">
        {insights.map((insight, i) => (
          <div key={i} className="group relative rounded-[1.5rem] border border-white/5 bg-white/5 p-4 transition-all hover:bg-white/[0.08] hover:border-white/10">
            <div className="flex items-start gap-4">
              <div className={`shrink-0 rounded-2xl p-2.5 shadow-inner ${insight.bg}`}>
                <insight.icon className={`h-5 w-5 ${insight.color}`} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground/90">{insight.title}</h4>
                <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                  {insight.text}
                </p>
              </div>
            </div>
            <div className="absolute right-4 top-4 h-1.5 w-1.5 rounded-full bg-purple-500/20 group-hover:bg-purple-500 transition-colors" />
          </div>
        ))}
      </div>
    </Card>
  );
}
