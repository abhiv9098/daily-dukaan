import {
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  Users,
  Target,
  AlertTriangle
} from "lucide-react";
import { DashboardStats, Transaction } from "@/types";
import { AnimatedCardData } from "@/types/card";
import { formatCurrency } from "@/lib/utils";
import { parseISO, subDays, isSameDay } from "date-fns";

export function buildDashboardCards(
  stats: DashboardStats,
  transactions: Transaction[],
  currency: string,
  language: string = "en",
  referenceDate: Date = new Date()
): AnimatedCardData[] {
  const isHi = language === "hi";
  
  const getSparkline = (type: "income" | "expense" | "all") => {
    const days = [6, 5, 4, 3, 2, 1, 0].map(d => subDays(referenceDate, d));
    return days.map(day => {
      const dayTx = transactions.filter(t => isSameDay(parseISO(t.date), day));
      if (type === "all") {
        return dayTx.reduce((acc, t) => acc + (t.type === "income" ? Number(t.amount) : -Number(t.amount)), 0);
      }
      return dayTx.filter(t => t.type === type).reduce((acc, t) => acc + Number(t.amount), 0);
    });
  };

  const isTodayRef = isSameDay(referenceDate, new Date());

  return [
    {
      id: "income-today",
      title: isTodayRef 
        ? (isHi ? "आज की आय" : "Today's Income")
        : (isHi ? "दिन की आय" : "Day's Income"),
      value: formatCurrency(stats.todayIncome, currency),
      description: isHi ? "कुल बिक्री" : "Total sales",
      icon: TrendingUp,
      iconClassName: "bg-emerald-500/10 text-emerald-500",
      sparklineData: getSparkline("income"),
    },
    {
      id: "expense-today",
      title: isTodayRef
        ? (isHi ? "आज का खर्च" : "Today's Expense")
        : (isHi ? "दिन का खर्च" : "Day's Expense"),
      value: formatCurrency(stats.todayExpense, currency),
      description: isHi ? "कुल बिल" : "Total bills",
      icon: TrendingDown,
      iconClassName: "bg-rose-500/10 text-rose-500",
      sparklineData: getSparkline("expense"),
    },
    {
      id: "khata-summary",
      title: isHi ? "खाता बकाया" : "Khata Receivable",
      value: formatCurrency(stats.totalCreditGiven || 0, currency),
      description: isHi ? "ग्राहकों से लेना है" : "Pending from customers",
      icon: Users,
      iconClassName: "bg-blue-500/10 text-blue-500",
      sparklineData: [5, 10, 8, 15, 12, 20, 18], // Placeholder trend
    },
    {
      id: "budgets-active",
      title: isHi ? "सक्रिय बजट" : "Active Budgets",
      value: stats.activeBudgets?.toString() || "0",
      description: isHi ? "इस महीने की योजना" : "Planned for this month",
      icon: Target,
      iconClassName: "bg-purple-500/10 text-purple-500",
      sparklineData: [1, 2, 2, 3, 3, 4, stats.activeBudgets || 0],
    },
    {
      id: "liabilities",
      title: isHi ? "नुकसान और उधार" : "Loss & Borrowings",
      value: formatCurrency(stats.totalOutstandingLiability || 0, currency),
      description: isHi ? "कुल वित्तीय देनदारियां" : "Total financial liabilities",
      icon: AlertTriangle,
      iconClassName: "bg-rose-500/10 text-rose-500",
      sparklineData: [10, 8, 12, 15, 14, 18, 20],
      href: "/liabilities",
    },
  ];
}

