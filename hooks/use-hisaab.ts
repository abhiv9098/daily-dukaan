"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Transaction, 
  ShopSettings, 
  DashboardStats, 
  Budget, 
  SavingsGoal, 
  Customer, 
  CreditTransaction,
  Loss,
  Borrowing
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
  LOSSES: "hisaab_losses",
  BORROWINGS: "hisaab_borrowings",
};

export function useHisaab(userId: string = "local-user") {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [settings, setSettings] = useState<ShopSettings>(defaultSettings);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [savings, setSavings] = useState<SavingsGoal[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [creditTransactions, setCreditTransactions] = useState<CreditTransaction[]>([]);
  const [losses, setLosses] = useState<Loss[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
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
      const storedLosses = localStorage.getItem(STORAGE_KEYS.LOSSES);
      const storedBorrowings = localStorage.getItem(STORAGE_KEYS.BORROWINGS);

      if (storedTransactions) setTransactions(JSON.parse(storedTransactions));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      if (storedBudgets) setBudgets(JSON.parse(storedBudgets));
      if (storedSavings) setSavings(JSON.parse(storedSavings));
      if (storedCustomers) setCustomers(JSON.parse(storedCustomers));
      if (storedCredit) setCreditTransactions(JSON.parse(storedCredit));
      if (storedLosses) setLosses(JSON.parse(storedLosses));
      if (storedBorrowings) setBorrowings(JSON.parse(storedBorrowings));

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

  const updateTransaction = async (id: string, updatedData: Partial<Transaction>) => {
    const updated = transactions.map(t => t.id === id ? { ...t, ...updatedData } : t);
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
    const newId = crypto.randomUUID();
    const newCustomer: Customer = { 
      ...customer, 
      id: newId, 
      totalCredit: 0, 
      lastTransactionDate: new Date().toISOString() 
    };
    
    setCustomers(prev => {
      const updated = [newCustomer, ...prev];
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
      return updated;
    });
    
    return newId;
  };

  const addCreditTransaction = async (ct: Omit<CreditTransaction, "id">) => {
    const newId = crypto.randomUUID();
    const newCT: CreditTransaction = { ...ct, id: newId };
    
    setCreditTransactions(prev => {
      const updated = [newCT, ...prev];
      localStorage.setItem(STORAGE_KEYS.CREDIT_TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });

    let customerName = "Customer";
    // Update customer balance using functional update to ensure we have latest customers
    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id === ct.customerId) {
          customerName = c.name;
          const amountChange = ct.type === 'give' ? ct.amount : -ct.amount;
          return { ...c, totalCredit: c.totalCredit + amountChange, lastTransactionDate: ct.date };
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
      return updated;
    });

    // Add to cashbook transactions automatically
    const isGive = ct.type === 'give';
    const newTransaction: Transaction = {
      id: newId, // Link using same ID
      amount: ct.amount,
      type: isGive ? 'udhaar' : 'payment',
      category: isGive ? 'Credit' : 'Payment',
      description: ct.description || (isGive ? `Udhar to ${customerName}` : `Payment from ${customerName}`),
      date: ct.date,
      paymentMode: 'Cash',
    };

    setTransactions(prev => {
      const updated = [newTransaction, ...prev];
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCreditTransaction = async (id: string) => {
    let deletedTransaction: CreditTransaction | undefined;

    setCreditTransactions(prev => {
      const updated = prev.filter((ct) => {
        if (ct.id === id) {
          deletedTransaction = ct;
          return false;
        }
        return true;
      });
      localStorage.setItem(STORAGE_KEYS.CREDIT_TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });

    // Delete linked cashbook transaction
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });

    if (!deletedTransaction) return;

    setCustomers(prev => {
      const updated = prev.map(c => {
        if (c.id === deletedTransaction?.customerId) {
          const amountChange = deletedTransaction.type === 'give' ? -deletedTransaction.amount : deletedTransaction.amount;
          return { ...c, totalCredit: c.totalCredit + amountChange };
        }
        return c;
      });
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCustomer = async (id: string) => {
    const deletedCreditIds = creditTransactions.filter(ct => ct.customerId === id).map(ct => ct.id);

    const updatedCustomers = customers.filter((c) => c.id !== id);
    const updatedCredits = creditTransactions.filter((ct) => ct.customerId !== id);
    setCustomers(updatedCustomers);
    setCreditTransactions(updatedCredits);
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updatedCustomers));
    localStorage.setItem(STORAGE_KEYS.CREDIT_TRANSACTIONS, JSON.stringify(updatedCredits));

    // Remove linked cashbook transactions
    setTransactions(prev => {
      const updated = prev.filter(t => !deletedCreditIds.includes(t.id));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      return updated;
    });
  };

  // --- Losses ---
  const addLoss = async (loss: Omit<Loss, "id">) => {
    const newLoss: Loss = { ...loss, id: crypto.randomUUID() };
    const updated = [newLoss, ...losses];
    setLosses(updated);
    localStorage.setItem(STORAGE_KEYS.LOSSES, JSON.stringify(updated));
  };

  const updateLoss = async (id: string, loss: Partial<Loss>) => {
    const updated = losses.map(l => l.id === id ? { ...l, ...loss } : l);
    setLosses(updated);
    localStorage.setItem(STORAGE_KEYS.LOSSES, JSON.stringify(updated));
  };

  const deleteLoss = async (id: string) => {
    const updated = losses.filter(l => l.id !== id);
    setLosses(updated);
    localStorage.setItem(STORAGE_KEYS.LOSSES, JSON.stringify(updated));
  };

  // --- Borrowings ---
  const addBorrowing = async (borrowing: Omit<Borrowing, "id" | "remainingBalance">) => {
    const newBorrowing: Borrowing = { ...borrowing, id: crypto.randomUUID(), remainingBalance: borrowing.amount };
    const updated = [newBorrowing, ...borrowings];
    setBorrowings(updated);
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(updated));
  };

  const updateBorrowing = async (id: string, borrowing: Partial<Borrowing>) => {
    const updated = borrowings.map(b => b.id === id ? { ...b, ...borrowing } : b);
    setBorrowings(updated);
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(updated));
  };

  const deleteBorrowing = async (id: string) => {
    const updated = borrowings.filter(b => b.id !== id);
    setBorrowings(updated);
    localStorage.setItem(STORAGE_KEYS.BORROWINGS, JSON.stringify(updated));
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
      } else if (t.type === "expense") {
        totalExpense += amount;
        if (isToday(date)) todayExpense += amount;
        if (isSameMonth(date, now)) monthlyExpense += amount;
      } else if (t.type === "udhaar") {
        // Udhaar given is money going out of cash box, 
        // but it's still an asset, so we don't subtract it from 'Savings'
        // We only track it separately in stats if needed
      }
    });

    const totalCreditGiven = customers.reduce((acc, c) => acc + (c.totalCredit > 0 ? c.totalCredit : 0), 0);
    const activeBudgets = budgets.filter(b => b.month === currentMonth).length;
    
    const totalLoss = losses.reduce((acc, l) => acc + l.amount, 0);
    const totalBorrowed = borrowings.reduce((acc, b) => acc + b.amount, 0);
    const totalOutstandingLiability = borrowings.reduce((acc, b) => acc + b.remainingBalance, 0);

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
      totalLoss,
      totalBorrowed,
      totalOutstandingLiability,
    };
  }, [transactions, customers, budgets, losses, borrowings]);

  return {
    userId,
    transactions,
    settings,
    budgets,
    savings,
    customers,
    creditTransactions,
    losses,
    borrowings,
    isLoaded,
    addTransaction,
    deleteTransaction,
    deleteTransactions,
    updateTransaction,
    updateSettings,
    addBudget,
    deleteBudget,
    addSavingsGoal,
    updateSavingsProgress,
    addCustomer,
    addCreditTransaction,
    deleteCreditTransaction,
    deleteCustomer,
    addLoss,
    updateLoss,
    deleteLoss,
    addBorrowing,
    updateBorrowing,
    deleteBorrowing,
    stats: getStats(),
  };
}

