export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Stock' 
  | 'Transport' 
  | 'Food' 
  | 'Electricity' 
  | 'Rent' 
  | 'Salary' 
  | 'Personal' 
  | 'Other'
  | 'Sales';

export type PaymentMode = 'Cash' | 'UPI' | 'Bank';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: Category;
  description: string;
  date: string; // ISO string
  paymentMode: PaymentMode;
  customerName?: string;
  customerId?: string; // Linked to a Customer for Khata
}

export interface Budget {
  id: string;
  category: Category | 'All';
  amount: number;
  spent: number;
  month: string; // YYYY-MM
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  category?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  totalCredit: number; // Total amount they owe (positive) or we owe them (negative)
  lastTransactionDate: string;
}

export interface CreditTransaction {
  id: string;
  customerId: string;
  amount: number;
  type: 'give' | 'receive'; // give = credit given (increase balance), receive = payment received (decrease balance)
  description: string;
  date: string;
}

export interface ShopSettings {
  shopName: string;
  currency: string;
  darkMode: boolean;
  appLockEnabled: boolean;
}

export interface Loss {
  id: string;
  amount: number;
  description: string;
  date: string;
}

export interface Borrowing {
  id: string;
  personName: string;
  personPhoto?: string;
  amount: number;
  remainingBalance: number;
  date: string;
  notes?: string;
}

export interface DashboardStats {
  todayIncome: number;
  todayExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  remainingBalance: number;
  income: number;
  expense: number;
  totalCreditGiven: number;
  activeBudgets: number;
  totalLoss: number;
  totalBorrowed: number;
  totalOutstandingLiability: number;
}

