"use client";

import { AnimatedCardGrid } from "@/components/cards/animated-card-grid";
import { useHisaabContext } from "@/context/hisaab-context";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
} from "lucide-react";
import { useMemo } from "react";
import { Transaction } from "@/types";
import { AnimatedCardData } from "@/types/card";

interface ReportsSummaryProps {
  transactions: Transaction[];
}

export function ReportsSummary({ transactions }: ReportsSummaryProps) {
  const { stats, settings } = useHisaabContext();

  const cards = useMemo((): AnimatedCardData[] => {
    let income = 0;
    let expense = 0;
    const byCategory: Record<string, number> = {};

    transactions.forEach((t) => {
      const amount = Number(t.amount);
      if (t.type === "income" || t.type === "payment") {
        income += amount;
      } else if (t.type === "expense" || t.type === "udhaar") {
        expense += amount;
        byCategory[t.category] = (byCategory[t.category] || 0) + amount;
      }
    });

    const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];
    const topCategory = top
      ? `${top[0]} (₹${top[1].toLocaleString("en-IN")})`
      : "—";
    const net = income - expense;
    const currency = settings.currency;

    return [
      {
        id: "filtered-income",
        title: "Total Income",
        value: formatCurrency(income, currency),
        description: "Gross revenue in period",
        icon: TrendingUp,
        iconClassName:
          "bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-inner",
      },
      {
        id: "filtered-expense",
        title: "Total Expense",
        value: formatCurrency(expense, currency),
        description: "Operational costs in view",
        icon: TrendingDown,
        iconClassName:
          "bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-all duration-300 shadow-inner",
      },
      {
        id: "filtered-net",
        title: "Net Profit",
        value: formatCurrency(net, currency),
        description: "Bottom-line performance",
        icon: Wallet,
        iconClassName:
          "bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 shadow-inner",
      },
      {
        id: "overall-balance",
        title: "Total Entries",
        value: transactions.length.toString(),
        description: `${topCategory ? `Main: ${topCategory.split(' ')[0]}` : "No expenses"}`,
        icon: PieChart,
        iconClassName:
          "bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300 shadow-inner",
      },
    ];
  }, [transactions, stats.remainingBalance, settings.currency]);

  return <AnimatedCardGrid cards={cards} />;
}
