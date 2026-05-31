import { DashboardStats, Transaction } from "@/types";

export type ExportDataType =
  | "transactions"
  | "customers"
  | "bills"
  | "reports"
  | "complete";

export type ExportFormat = "xlsx" | "pdf";

export interface CustomerRecord {
  name: string;
  phone: string;
  totalPurchases: number;
  transactionCount: number;
  lastVisit: string;
  outstandingBalance: number;
}

export interface BillRecord {
  billId: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
  status: string;
}

export interface ReportSummary {
  label: string;
  value: string;
}

export interface CategoryReportRow {
  category: string;
  income: number;
  expense: number;
  net: number;
}

export interface ExportMeta {
  shopName: string;
  currency: string;
  generatedAt: string;
  dateRangeLabel: string;
  exportType: ExportDataType;
  recordCount: number;
  isFiltered: boolean;
}

export interface ExportBundle {
  meta: ExportMeta;
  transactions: Transaction[];
  customers: CustomerRecord[];
  bills: BillRecord[];
  reportSummary: ReportSummary[];
  categoryReport: CategoryReportRow[];
  stats: DashboardStats;
}
