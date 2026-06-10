"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Transaction, 
  ShopSettings, 
  DashboardStats, 
  Budget, 
  SavingsGoal, 
  Customer, 
  CreditTransaction 
} from "@/types";
import { isToday, isSameMonth, parseISO, format } from "date-fns";

const defaultSettings: ShopSettings = {
  shopName: "Mera Hisab",
  currency: "INR",
  darkMode: false,
  appLockEnabled: true,
};

const STORAGE_KEYS = {
  TRANSACTIONS: "hisaab_transactions",
  SETTINGS: "hisaab_settings",
  BUDGETS: "hisaab_budgets",
  SAVINGS: "hisaab_savings",
  CUSTOMERS: "hisaab_customers",
  CREDIT_TRANSACTIONS: "hisaab_credit_transactions",
};

export function useHisaab(userId: string = "local-user") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Helper to load from localStorage
  const loadLocalData = useCallback(() => {
    try {
      const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      const storedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const storedBudgets = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      const storedSavings = localStorage.getItem(STORAGE_KEYS.SAVINGS);
      const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      const storedCredit = localStorage.getItem(STORAGE_KEYS.CREDIT_TRANSACTIONS);

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
      if (storedSavings) setSavings(JSON.parse(storedSavings));
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      if (storedCredit) setCreditTransactions(JSON.parse(storedCredit));

      if (!storedSettings) {
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

  // --- Transactions ---
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = { ...transaction, id: crypto.randomUUID() };
    const updated = [newTransaction, ...transactions];
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  };

  const deleteTransactions = async (ids: string[]) => {
    const updated = transactions.filter((t) => !ids.includes(t.id));
    setTransactions(updated);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
  };

  // --- Settings ---
  const updateSettings = async (newSettings: Partial<ShopSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  };

  // --- Budgets ---
  const addBudget = async (budget: Omit<Budget, "id" | "spent">) => {
    const newBudget: Budget = { ...budget, id: crypto.randomUUID(), spent: 0 };
    const updated = [newBudget, ...budgets];
    setBudgets(updated);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
  };

  const deleteBudget = async (id: string) => {
    const updated = budgets.filter((b) => b.id !== id);
    setBudgets(updated);
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
  };

  // --- Savings ---
  const addSavingsGoal = async (goal: Omit<SavingsGoal, "id">) => {
    const newGoal: SavingsGoal = { ...goal, id: crypto.randomUUID() };
    const updated = [newGoal, ...savings];
    setSavings(updated);
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(updated));
  };

  const updateSavingsProgress = async (id: string, amount: number) => {
    const updated = savings.map(s => s.id === id ? { ...s, currentAmount: s.currentAmount + amount } : s);
    setSavings(updated);
    localStorage.setItem(STORAGE_KEYS.SAVINGS, JSON.stringify(updated));
  };

  // --- Customers & Khata ---
  const addCustomer = async (customer: Omit<Customer, "id" | "totalCredit" | "lastTransactionDate">) => {
    const newCustomer: Customer = { 
      ...customer, 
      id: crypto.randomUUID(), 
      totalCredit: 0, 
      lastTransactionDate: new Date().toISOString() 
    };
    const updated = [newCustomer, ...customers];
    setCustomers(updated);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
  };

  const addCreditTransaction = async (ct: Omit<CreditTransaction, "id">) => {
    const newCT: CreditTransaction = { ...ct, id: crypto.randomUUID() };
    const updatedCT = [newCT, ...creditTransactions];
    setCreditTransactions(updatedCT);
    localStorage.setItem(STORAGE_KEYS.CREDIT_TRANSACTIONS, JSON.stringify(updatedCT));

    // Update customer balance
    const updatedCustomers = customers.map(c => {
      if (c.id === ct.customerId) {
        const amountChange = ct.type === 'give' ? ct.amount : -ct.amount;
        return { ...c, totalCredit: c.totalCredit + amountChange, lastTransactionDate: ct.date };
      }
      return c;
    });
    setCustomers(updatedCustomers);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedCustomers));
  };

  // --- Stats ---
  const getStats = useCallback((): DashboardStats => {
    const now = new Date();
    const currentMonth = format(now, "yyyy-MM");

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

    const totalCreditGiven = customers.reduce((acc, c) => acc + (c.totalCredit > 0 ? c.totalCredit : 0), 0);
    const activeBudgets = budgets.filter(b => b.month === currentMonth).length;

    return {
      todayIncome,
      todayExpense,
      monthlyIncome,
      monthlyExpense,
      remainingBalance: totalIncome - totalExpense,
      income: totalIncome,
      expense: totalExpense,
      totalCreditGiven,
      activeBudgets,
    };
  }, [transactions, customers, budgets]);

  return {
    userId,
    transactions,
    settings,
    budgets,
    savings,
    customers,
    creditTransactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    deleteTransactions,
    updateSettings,
    addBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsProgress,
    addCustomer,
    addCreditTransaction,
    stats: getStats(),
  };
}

