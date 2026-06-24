import { format, parseISO } from "date-fns";
import {
  BillRecord,
  CategoryReportRow,
  CustomerRecord,
  ExportBundle,
  ExportDataType,
  ReportSummary,
} from "@/types/export";
import { DashboardStats, Transaction } from "@/types";
import { TransactionFilters } from "@/hooks/use-filtered-transactions";
import { formatCurrency, formatDate } from "@/lib/utils";

export function deriveCustomers(transactions: Transaction[]): CustomerRecord[] {
  const map = new Map<
    string,
    { total: number; count: number; lastDate: string }
  >();

  transactions
    .filter((t) => t.type === "income")
    .forEach((t) => {
      const name = t.description.trim() || "Walk-in Customer";
      const existing = map.get(name) ?? { total: 0, count: 0, lastDate: t.date };
      map.set(name, {
        total: existing.total + Number(t.amount),
        count: existing.count + 1,
        lastDate:
          parseISO(t.date) > parseISO(existing.lastDate) ? t.date : existing.lastDate,
      });
    });

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      phone: "—",
      totalPurchases: data.total,
      transactionCount: data.count,
      lastVisit: formatDate(data.lastDate),
      outstandingBalance: 0,
    }))
    .sort((a, b) => b.totalPurchases - a.totalPurchases);
}

export function deriveBills(transactions: Transaction[]): BillRecord[] {
  return transactions
    .filter((t) => t.type === "expense")
    .map((t) => ({
      billId: `BILL-${t.id.slice(0, 8).toUpperCase()}`,
      date: formatDate(t.date),
      category: t.category,
      description: t.description,
      amount: Number(t.amount),
      paymentMode: t.paymentMode,
      status: "Paid",
    }))
    .sort((a, b) => b.amount - a.amount);
}

export function buildCategoryReport(
  transactions: Transaction[]
): CategoryReportRow[] {
  const map = new Map<string, { income: number; expense: number }>();

  transactions.forEach((t) => {
    const row = map.get(t.category) ?? { income: 0, expense: 0 };
    const amount = Number(t.amount);
    if (t.type === "income") row.income += amount;
    else row.expense += amount;
    map.set(t.category, row);
  });

  return Array.from(map.entries())
    .map(([category, v]) => ({
      category,
      income: v.income,
      expense: v.expense,
      net: v.income - v.expense,
    }))
    .sort((a, b) => b.expense + b.income - (a.expense + a.income));
}

function buildDateRangeLabel(filters: TransactionFilters): string {
  if (filters.dateFrom && filters.dateTo) {
    return `${format(new Date(filters.dateFrom), "dd MMM yyyy")} – ${format(new Date(filters.dateTo), "dd MMM yyyy")}`;
  }
  if (filters.dateFrom) {
    return `From ${format(new Date(filters.dateFrom), "dd MMM yyyy")}`;
  }
  if (filters.dateTo) {
    return `Until ${format(new Date(filters.dateTo), "dd MMM yyyy")}`;
  }
  return "All dates";
}

function hasActiveFilters(filters: TransactionFilters): boolean {
  return (
    filters.search !== "" ||
    filters.type !== "all" ||
    filters.category !== "all" ||
    filters.paymentMode !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== ""
  );
}

export function buildExportBundle(
  transactions: Transaction[],
  allTransactions: Transaction[],
  stats: DashboardStats,
  settings: { shopName: string; currency: string },
  filters: TransactionFilters,
  exportType: ExportDataType,
  actualCustomers?: any[],
  creditTransactions?: any[]
): ExportBundle {
  const isFiltered = hasActiveFilters(filters);
  const customers = actualCustomers && actualCustomers.length > 0
    ? actualCustomers.map((c) => {
        const customerTXs = (creditTransactions || []).filter(ct => ct.customerId === c.id);
        const totalPurchases = customerTXs.filter(ct => ct.type === 'give').reduce((sum, ct) => sum + ct.amount, 0);
        const transactionCount = customerTXs.length;
        return {
          name: c.name,
          phone: c.phone || "—",
          totalPurchases,
          transactionCount,
          lastVisit: c.lastTransactionDate ? formatDate(c.lastTransactionDate) : "—",
          outstandingBalance: c.totalCredit,
        };
      })
    : deriveCustomers(exportType === "complete" ? allTransactions : transactions);
  const bills = deriveBills(transactions);
  const categoryReport = buildCategoryReport(transactions);

  let filteredIncome = 0;
  let filteredExpense = 0;
  transactions.forEach((t) => {
    const amt = Number(t.amount);
    if (t.type === "income") filteredIncome += amt;
    else filteredExpense += amt;
  });

  const reportSummary: ReportSummary[] = [
    { label: "Filtered Income", value: formatCurrency(filteredIncome, settings.currency) },
    { label: "Filtered Expense", value: formatCurrency(filteredExpense, settings.currency) },
    {
      label: "Filtered Net",
      value: formatCurrency(filteredIncome - filteredExpense, settings.currency),
    },
    { label: "Today's Income", value: formatCurrency(stats.todayIncome, settings.currency) },
    { label: "Today's Expense", value: formatCurrency(stats.todayExpense, settings.currency) },
    {
      label: "Monthly Income",
      value: formatCurrency(stats.monthlyIncome, settings.currency),
    },
    {
      label: "Monthly Expense",
      value: formatCurrency(stats.monthlyExpense, settings.currency),
    },
    {
      label: "Overall Balance",
      value: formatCurrency(stats.remainingBalance, settings.currency),
    },
  ];

  const recordCount =
    exportType === "transactions"
      ? transactions.length
      : exportType === "customers"
        ? customers.length
        : exportType === "bills"
          ? bills.length
          : exportType === "reports"
            ? categoryReport.length
            : transactions.length + customers.length + bills.length;

  return {
    meta: {
      shopName: settings.shopName,
      currency: settings.currency,
      generatedAt: format(new Date(), "dd MMM yyyy, hh:mm a"),
      dateRangeLabel: buildDateRangeLabel(filters),
      exportType,
      recordCount,
      isFiltered,
    },
    transactions,
    customers,
    bills,
    reportSummary,
    categoryReport,
    stats,
  };
}

export function transactionRows(transactions: Transaction[]) {
  return transactions.map((t) => ({
    Date: formatDate(t.date),
    Type: t.type,
    Category: t.category,
    Description: t.description,
    Amount: Number(t.amount),
    "Payment Mode": t.paymentMode,
    ID: t.id,
  }));
}
