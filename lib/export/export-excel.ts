import * as XLSX from "xlsx";
import { ExportBundle, ExportDataType } from "@/types/export";
import { transactionRows } from "./build-bundle";

function downloadWorkbook(wb: XLSX.WorkBook, filename: string) {
  XLSX.writeFile(wb, filename);
}

function metaRows(bundle: ExportBundle) {
  return [
    ["Daily Dukaan Hisaab — Export"],
    ["Shop", bundle.meta.shopName],
    ["Generated", bundle.meta.generatedAt],
    ["Date Range", bundle.meta.dateRangeLabel],
    ["Export Type", bundle.meta.exportType],
    ["Filtered", bundle.meta.isFiltered ? "Yes" : "No"],
    ["Records", bundle.meta.recordCount],
    [],
  ];
}

function addTransactionsSheet(wb: XLSX.WorkBook, bundle: ExportBundle) {
  const rows = transactionRows(bundle.transactions);
  const ws = XLSX.utils.aoa_to_sheet([...metaRows(bundle), ["Transactions"]]);
  if (rows.length) {
    XLSX.utils.sheet_add_json(ws, rows, { origin: -1 });
  }
  const totalIncome = bundle.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = bundle.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);
  XLSX.utils.sheet_add_aoa(
    ws,
    [
      [],
      ["Total Income", totalIncome],
      ["Total Expense", totalExpense],
      ["Net", totalIncome - totalExpense],
    ],
    { origin: -1 }
  );
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
}

function addCustomersSheet(wb: XLSX.WorkBook, bundle: ExportBundle) {
  const ws = XLSX.utils.aoa_to_sheet([...metaRows(bundle), ["Customers"]]);
  XLSX.utils.sheet_add_json(
    ws,
    bundle.customers.map((c) => ({
      Name: c.name,
      Phone: c.phone,
      "Total Purchases": c.totalPurchases,
      Visits: c.transactionCount,
      "Last Visit": c.lastVisit,
      Outstanding: c.outstandingBalance,
    })),
    { origin: -1 }
  );
  XLSX.utils.book_append_sheet(wb, ws, "Customers");
}

function addBillsSheet(wb: XLSX.WorkBook, bundle: ExportBundle) {
  const ws = XLSX.utils.aoa_to_sheet([...metaRows(bundle), ["Bills & Expenses"]]);
  XLSX.utils.sheet_add_json(
    ws,
    bundle.bills.map((b) => ({
      "Bill ID": b.billId,
      Date: b.date,
      Category: b.category,
      Description: b.description,
      Amount: b.amount,
      Payment: b.paymentMode,
      Status: b.status,
    })),
    { origin: -1 }
  );
  const total = bundle.bills.reduce((s, b) => s + b.amount, 0);
  XLSX.utils.sheet_add_aoa(ws, [[], ["Total Bills", total]], { origin: -1 });
  XLSX.utils.book_append_sheet(wb, ws, "Bills");
}

function addReportsSheet(wb: XLSX.WorkBook, bundle: ExportBundle) {
  const ws = XLSX.utils.aoa_to_sheet([...metaRows(bundle), ["Summary Report"]]);
  XLSX.utils.sheet_add_json(
    ws,
    bundle.reportSummary.map((r) => ({ Metric: r.label, Value: r.value })),
    { origin: -1 }
  );
  XLSX.utils.sheet_add_aoa(ws, [[], ["Category Breakdown"]], { origin: -1 });
  XLSX.utils.sheet_add_json(
    ws,
    bundle.categoryReport.map((r) => ({
      Category: r.category,
      Income: r.income,
      Expense: r.expense,
      Net: r.net,
    })),
    { origin: -1 }
  );
  XLSX.utils.book_append_sheet(wb, ws, "Reports");
}

function filename(bundle: ExportBundle) {
  const slug = bundle.meta.shopName.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `${slug}-${bundle.meta.exportType}-${date}.xlsx`;
}

export function exportToExcel(bundle: ExportBundle, type: ExportDataType) {
  const wb = XLSX.utils.book_new();

  switch (type) {
    case "transactions":
      addTransactionsSheet(wb, bundle);
      break;
    case "customers":
      addCustomersSheet(wb, bundle);
      break;
    case "bills":
      addBillsSheet(wb, bundle);
      break;
    case "reports":
      addReportsSheet(wb, bundle);
      break;
    case "complete":
      addReportsSheet(wb, bundle);
      addTransactionsSheet(wb, bundle);
      addCustomersSheet(wb, bundle);
      addBillsSheet(wb, bundle);
      break;
  }

  downloadWorkbook(wb, filename(bundle));
}
