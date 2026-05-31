"use client";

import { useMemo } from "react";
import { parseISO, startOfDay, endOfDay, startOfMonth, endOfMonth, format } from "date-fns";
import { Transaction, TransactionType, Category, PaymentMode } from "@/types";

export interface TransactionFilters {
  search: string;
  type: TransactionType | "all";
  category: Category | "all";
  paymentMode: PaymentMode | "all";
  dateFrom: string;
  dateTo: string;
}

export function getDefaultFilters(): TransactionFilters {
  const now = new Date();
  return {
    search: "",
    type: "all",
    category: "all",
    paymentMode: "all",
    dateFrom: format(startOfMonth(now), "yyyy-MM-dd"),
    dateTo: format(endOfMonth(now), "yyyy-MM-dd"),
  };
}

export const defaultFilters: TransactionFilters = {
  search: "",
  type: "all",
  category: "all",
  paymentMode: "all",
  dateFrom: "",
  dateTo: "",
};

export function useFilteredTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
) {
  return useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return transactions.filter((t) => {
      if (filters.type !== "all" && t.type !== filters.type) return false;
      if (filters.category !== "all" && t.category !== filters.category)
        return false;
      if (filters.paymentMode !== "all" && t.paymentMode !== filters.paymentMode)
        return false;

      if (filters.dateFrom) {
        const from = startOfDay(new Date(filters.dateFrom));
        const txDate = parseISO(t.date);
        if (txDate < from) return false;
      }
      if (filters.dateTo) {
        const to = endOfDay(new Date(filters.dateTo));
        const txDate = parseISO(t.date);
        if (txDate > to) return false;
      }

      if (query) {
        const haystack = [
          t.description,
          t.category,
          t.paymentMode,
          t.type,
          String(t.amount),
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(query)) return false;
      }

      return true;
    });
  }, [transactions, filters]);
}
