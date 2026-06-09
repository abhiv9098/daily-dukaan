import {
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { DashboardStats, Transaction } from "@/types";
import { AnimatedCardData } from "@/types/card";
import { formatCurrency } from "@/lib/utils";
import { parseISO, subDays, isSameDay } from "date-fns";

export function buildDashboardCards(
  stats: DashboardStats,
  transactions: Transaction[],
  currency: string,
  language: string = "en"
): AnimatedCardData[] {
  const isHi = language === "hi";
  
  const getSparkline = (type: "income" | "expense" | "all") => {
    const days = [6, 5, 4, 3, 2, 1, 0].map(d => subDays(new Date(), d));
    return days.map(day => {
      const dayTx = transactions.filter(t => isSameDay(parseISO(t.date), day));
      if (type === "all") {
        return dayTx.reduce((acc, t) => acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount)), 0);
      }
      return dayTx.filter(t => t.type === type).reduce((acc, t) => acc + Number(t.amount), 0);
    });
  };

  return [
    {
      id: "income-today",
      title: isHi ? "आज की आय" : "Today's Income",
      value: formatCurrency(stats.todayIncome, currency),
      description: isHi ? "आज की बिक्री और क्रेडिट" : "Sales & credits today",
      icon: TrendingUp,
      iconClassName: "bg-green-500/10 text-green-500",
      sparklineData: getSparkline("income"),
    },
    {
      id: "expense-today",
      title: isHi ? "आज का खर्च" : "Today's Expense",
      value: formatCurrency(stats.todayExpense, currency),
      description: isHi ? "आज का स्टॉक और बिल" : "Stock & bills today",
      icon: TrendingDown,
      iconClassName: "bg-red-500/10 text-red-500",
      sparklineData: getSparkline("expense"),
    },
    {
      id: "income-month",
      title: isHi ? "मासिक आय" : "Monthly Income",
      value: formatCurrency(stats.monthlyIncome, currency),
      description: isHi ? "इस कैलेंडर माह" : "This calendar month",
      icon: ArrowUpRight,
      iconClassName: "bg-blue-500/10 text-blue-500",
      sparklineData: getSparkline("income"),
    },
    {
      id: "balance",
      title: isHi ? "कुल शेष" : "Net Balance",
      value: formatCurrency(stats.remainingBalance, currency),
      description: isHi ? "कुल नकद स्थिति" : "Overall cash position",
      icon: Wallet,
      iconClassName: "bg-purple-500/10 text-purple-500",
      sparklineData: getSparkline("all"),
    },
  ];
}
