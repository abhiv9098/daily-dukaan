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
  | 'Sales'; // Added Sales for income

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
}

export interface ShopSettings {
  shopName: string;
  currency: string;
  darkMode: boolean;
}

export interface DashboardStats {
  todayIncome: number;
  todayExpense: number;
  monthlyIncome: number;
  monthlyExpense: number;
  remainingBalance: number;
  income: number;
  expense: number;
}
