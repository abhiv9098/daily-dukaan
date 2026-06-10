import { Category, PaymentMode, TransactionType } from "@/types";
import { 
  Package, 
  Truck, 
  Utensils, 
  Zap, 
  Home, 
  Users, 
  User, 
  MoreHorizontal,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone
} from "lucide-react";

export const EXPENSE_CATEGORIES: Category[] = [
  "Stock",
  "Transport",
  "Food",
  "Electricity",
  "Rent",
  "Salary",
  "Personal",
  "Other",
];

export const INCOME_CATEGORIES: Category[] = ["Sales", "Other"];

export const CATEGORY_DETAILS: Record<string, { icon: any; color: string; bgColor: string }> = {
  Stock: { icon: Package, color: "#3b82f6", bgColor: "bg-blue-500/10" },
  Transport: { icon: Truck, color: "#f59e0b", bgColor: "bg-amber-500/10" },
  Food: { icon: Utensils, color: "#ef4444", bgColor: "bg-red-500/10" },
  Electricity: { icon: Zap, color: "#eab308", bgColor: "bg-yellow-500/10" },
  Rent: { icon: Home, color: "#6366f1", bgColor: "bg-indigo-500/10" },
  Salary: { icon: Users, color: "#10b981", bgColor: "bg-emerald-500/10" },
  Personal: { icon: User, color: "#a855f7", bgColor: "bg-purple-500/10" },
  Sales: { icon: TrendingUp, color: "#10b981", bgColor: "bg-emerald-500/10" },
  Other: { icon: MoreHorizontal, color: "#64748b", bgColor: "bg-slate-500/10" },
};

export const PAYMENT_MODE_DETAILS: Record<PaymentMode, { icon: any; color: string }> = {
  Cash: { icon: Banknote, color: "#10b981" },
  UPI: { icon: Smartphone, color: "#6366f1" },
  Bank: { icon: CreditCard, color: "#3b82f6" },
};

export const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Bank"];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export function getCategoriesForType(type: TransactionType): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}

