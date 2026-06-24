import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { ExportBundle, ExportDataType } from "@/types/export";
import { formatCurrency } from "@/lib/utils";
import { transactionRows } from "./build-bundle";

type DocWithTable = jsPDF & { lastAutoTable?: { finalY: number } };

function filename(bundle: ExportBundle) {
  const slug = bundle.meta.shopName.replace(/\s+/g, "-").toLowerCase();
  const date = new Date().toISOString().slice(0, 10);
  return `${slug}-${bundle.meta.exportType}-${date}.pdf`;
}

function tableEndY(doc: DocWithTable) {
  return (doc.lastAutoTable?.finalY ?? 40) + 10;
}

function drawBranding(doc: jsPDF, bundle: ExportBundle, title: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Daily Dukaan Hisaab", 14, 14);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(bundle.meta.shopName, 14, 22);

  doc.setFontSize(9);
  doc.text(title, 14, 30);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  let y = 44;
  doc.text(`Generated: ${bundle.meta.generatedAt}`, 14, y);
  y += 5;
  doc.text(`Date range: ${bundle.meta.dateRangeLabel}`, 14, y);
  y += 5;
  doc.text(
    `Export: ${bundle.meta.exportType}${bundle.meta.isFiltered ? " (filtered)" : ""} · ${bundle.meta.recordCount} records`,
    14,
    y
  );

  return y + 8;
}

function addSummaryTable(doc: DocWithTable, bundle: ExportBundle, startY: number) {
  autoTable(doc, {
    startY,
    head: [["Metric", "Value"]],
    body: bundle.reportSummary.map((r) => [r.label, r.value]),
    theme: "striped",
    headStyles: { fillColor: [37, 99, 235] },
    styles: { fontSize: 9 },
    margin: { left: 14, right: 14 },
  });
  return tableEndY(doc);
}

function addFooter(doc: jsPDF, bundle: ExportBundle) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(
      `Daily Dukaan Hisaab · ${bundle.meta.shopName} · Page ${i} of ${pageCount}`,
      14,
      doc.internal.pageSize.getHeight() - 8
    );
  }
}

export function exportToPdf(bundle: ExportBundle, type: ExportDataType) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" }) as DocWithTable;
  const currency = bundle.meta.currency;

  const titles: Record<ExportDataType, string> = {
    transactions: "Transactions Export",
    customers: "Customer Records Export",
    bills: "Bills & Expenses Export",
    reports: "Business Report",
    udhaar: "Udhar Ledger Export",
    complete: "Complete Business Export",
  };

  let y = drawBranding(doc, bundle, titles[type]);

  if (type === "reports" || type === "complete") {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 14, y);
    y = addSummaryTable(doc, bundle, y + 4);

    doc.text("Category Breakdown", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [["Category", "Income", "Expense", "Net"]],
      body: bundle.categoryReport.map((r) => [
        r.category,
        formatCurrency(r.income, currency),
        formatCurrency(r.expense, currency),
        formatCurrency(r.net, currency),
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });
    y = tableEndY(doc);
  }

  if (type === "transactions" || type === "complete") {
    if (type === "complete") {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Transactions", 14, y);
    const rows = transactionRows(bundle.transactions);
    autoTable(doc, {
      startY: y + 4,
      head: [["Date", "Type", "Category", "Description", "Amount", "Mode"]],
      body: rows.map((r) => [
        r.Date,
        r.Type,
        r.Category,
        r.Description,
        formatCurrency(r.Amount, currency),
        r["Payment Mode"],
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
  }

  if (type === "customers" || type === "complete") {
    if (type === "complete") doc.addPage();
    const startY = type === "customers" ? y : 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Customers", 14, type === "customers" ? startY : 14);
    autoTable(doc, {
      startY: type === "customers" ? startY + 4 : 26,
      head: [["Name", "Phone", "Purchases", "Visits", "Last Visit"]],
      body: bundle.customers.map((c) => [
        c.name,
        c.phone,
        formatCurrency(c.totalPurchases, currency),
        String(c.transactionCount),
        c.lastVisit,
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });
  }

  if (type === "udhaar" || type === "complete") {
    if (type === "complete") doc.addPage();
    const startY = type === "udhaar" ? y : 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Udhar Ledger (Customers Outstanding)", 14, type === "udhaar" ? startY : 14);
    autoTable(doc, {
      startY: type === "udhaar" ? startY + 4 : 26,
      head: [["Customer Name", "Phone", "Total Udhar Given", "Last Active Date", "Outstanding", "Status"]],
      body: bundle.customers.map((c) => [
        c.name,
        c.phone,
        formatCurrency(c.totalPurchases, currency),
        c.lastVisit,
        formatCurrency(Math.abs(c.outstandingBalance), currency),
        c.outstandingBalance > 0 ? "Lena Hai" : c.outstandingBalance < 0 ? "Dena Hai" : "Settled"
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 9 },
      margin: { left: 14, right: 14 },
    });
  }

  if (type === "bills" || type === "complete") {
    if (type === "complete") doc.addPage();
    const startY = type === "bills" ? y : 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Bills & Expenses", 14, type === "bills" ? startY : 14);
    autoTable(doc, {
      startY: type === "bills" ? startY + 4 : 26,
      head: [["Bill ID", "Date", "Category", "Description", "Amount", "Status"]],
      body: bundle.bills.map((b) => [
        b.billId,
        b.date,
        b.category,
        b.description,
        formatCurrency(b.amount, currency),
        b.status,
      ]),
      theme: "striped",
      headStyles: { fillColor: [37, 99, 235] },
      styles: { fontSize: 8 },
      margin: { left: 14, right: 14 },
    });
  }

  addFooter(doc, bundle);
  doc.save(filename(bundle));
}
