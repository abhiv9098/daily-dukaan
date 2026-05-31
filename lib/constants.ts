import { Category, PaymentMode, TransactionType } from "@/types";

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

export const PAYMENT_MODES: PaymentMode[] = ["Cash", "UPI", "Bank"];

export const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export function getCategoriesForType(type: TransactionType): Category[] {
  return type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
