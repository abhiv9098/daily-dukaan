"use client";

import { useState, useEffect, useCallback } from "react";
import { Transaction, ShopSettings, DashboardStats } from "@/types";
import { isToday, isSameMonth, parseISO } from "date-fns";

const defaultSettings: ShopSettings = {
  shopName: "Mera Hisab",
  currency: "INR",
  darkMode: false,
};

const STORAGE_KEYS = {
  TRANSACTIONS: "hisaab_transactions",
  SETTINGS: "hisaab_settings",
};

export function useHisaab(userId: string = "local-user") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to load from localStorage
  const loadLocalData = useCallback(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);

      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }

      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      } else {
        // Initialize settings if not present
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadLocalData();
  }, [loadLocalData]);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };

    const updatedTransactions = [newTransaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
  };

  const deleteTransaction = async (id: string) => {
    const updatedTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(updatedTransactions);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updatedTransactions));
  };

  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  };

  const getStats = useCallback((): DashboardStats => {
    const now = new Date();

    let todayIncome = 0;
    let todayExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((t) => {
      const date = parseISO(t.date);
      const amount = Number(t.amount);

      if (t.type === "income") {
        totalIncome += amount;
        if (isToday(date)) todayIncome += amount;
        if (isSameMonth(date, now)) monthlyIncome += amount;
      } else {
        totalExpense += amount;
        if (isToday(date)) todayExpense += amount;
        if (isSameMonth(date, now)) monthlyExpense += amount;
      }
    });

    return {
      todayIncome,
      todayExpense,
      monthlyIncome,
      monthlyExpense,
      remainingBalance: totalIncome - totalExpense,
      income: totalIncome,
      expense: totalExpense,
    };
  }, [transactions]);

  return {
    userId,
    transactions,
    settings,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateSettings,
    stats: getStats(),
  };
}
