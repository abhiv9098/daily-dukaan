"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, ShopSettings, DashboardStats } from "@/types";
import { isToday, isSameMonth, parseISO } from "date-fns";

const defaultSettings: ShopSettings = {
  shopName: "Mera Hisab",
  currency: "INR",
  darkMode: false,
};

export function getStorageKeys(userId: string = "default-user") {
  return {
    transactions: `dukaan_transactions_${userId}`,
    settings: `dukaan_settings_${userId}`,
  };
}

export function useHisaab(userId: string = "default-user") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  const storageKeys = useMemo(
    () => getStorageKeys(userId),
    [userId]
  );

  useEffect(() => {
    setIsLoaded(false);
    const savedTransactions = localStorage.getItem(storageKeys.transactions);
    const savedSettings = localStorage.getItem(storageKeys.settings);

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions([]);
    }

    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      if (
        parsed.shopName === "http://localhost:3000/settings" ||
        parsed.shopName === "http://localhost:3000"
      ) {
        parsed.shopName = "Mera Hisab";
      }
      setSettings(parsed);
    } else {
      setSettings(defaultSettings);
    }

    setIsLoaded(true);
  }, [userId, storageKeys]);

  useEffect(() => {
    if (isLoaded && storageKeys) {
      localStorage.setItem(
        storageKeys.transactions,
        JSON.stringify(transactions)
      );
    }
  }, [transactions, isLoaded, storageKeys]);

  useEffect(() => {
    if (isLoaded && storageKeys) {
      localStorage.setItem(storageKeys.settings, JSON.stringify(settings));
    }
  }, [settings, isLoaded, storageKeys]);

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
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
    storageKeys: storageKeys ?? getStorageKeys(""),
    transactions,
    settings,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateSettings,
    stats: getStats(),
  };
}
