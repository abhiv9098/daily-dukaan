import {
  ArrowUpRight,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { AnimatedCardData } from "@/types/card";

/** Sample dashboard card data for demos and previews */
export const SAMPLE_CARDS: AnimatedCardData[] = [
  {
    id: "income-today",
    title: "Today's Income",
    value: "₹12,450",
    description: "Sales & credits today",
    icon: TrendingUp,
    iconClassName:
      "bg-green-100 text-green-700 group-hover:bg-white/20 group-hover:text-white",
  },
  {
    id: "expense-today",
    title: "Today's Expense",
    value: "₹4,200",
    description: "Stock & bills today",
    icon: TrendingDown,
    iconClassName:
      "bg-red-100 text-red-700 group-hover:bg-white/20 group-hover:text-white",
  },
  {
    id: "income-month",
    title: "Monthly Income",
    value: "₹2,18,900",
    description: "This calendar month",
    icon: ArrowUpRight,
    iconClassName:
      "bg-blue-100 text-blue-700 group-hover:bg-white/20 group-hover:text-white",
  },
  {
    id: "balance",
    title: "Balance",
    value: "₹1,86,500",
    description: "Total income − expense",
    icon: Wallet,
    iconClassName:
      "bg-violet-100 text-violet-700 group-hover:bg-white/20 group-hover:text-white",
  },
];
