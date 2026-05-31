"use client";

import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { useHisaabContext } from "@/context/hisaab-context";
import { ReceiptModal } from "./receipt-modal";

interface TransactionTableProps {
  transactions: Transaction[];
  showActions?: boolean;
}

export function TransactionTable({
  transactions,
  showActions = true,
}: TransactionTableProps) {
  const { deleteTransaction, settings } = useHisaabContext();

  if (transactions.length === 0) {
    return (
      <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 text-muted-foreground">
        <p className="font-medium">No transactions match your filters</p>
        <p className="text-sm">Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Mobile View: List of Cards */}
      <div className="grid gap-3 md:hidden">
        {transactions.map((t) => (
          <div 
            key={t.id} 
            className="group relative flex items-center justify-between rounded-2xl border border-white/10 bg-card/40 p-3.5 shadow-sm backdrop-blur-xl dark:bg-[#09090b]/60 active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`rounded-xl p-2 shrink-0 ${
                  t.type === "income"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {t.type === "income" ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownLeft className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-[13px] leading-tight text-foreground truncate">
                  {t.description}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-500/80 bg-purple-500/5 px-1.5 py-0.5 rounded-md border border-purple-500/10">
                    {t.category}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {t.paymentMode} • {formatDate(t.date)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-1 pl-2">
              <p className={`text-[13px] font-extrabold tabular-nums ${
                t.type === "income" ? "text-green-500" : "text-red-500"
              }`}>
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(t.amount, settings.currency)}
              </p>
              {showActions && (
                <div className="flex items-center gap-0.5">
                   <ReceiptModal transaction={t} settings={settings} />
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-muted-foreground hover:text-red-500"
                    onClick={() => deleteTransaction(t.id)}
                  >
                    <Trash2 className="h-3 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
        <div className="overflow-x-auto">
          <div className="min-w-full">
            <Table>
              <TableHeader>
                <TableRow className="h-9 bg-white/5 hover:bg-white/5 border-white/10">
                  <TableHead className="w-[280px] h-9 text-[10px] uppercase tracking-widest font-bold px-3">Details</TableHead>
                  <TableHead className="h-9 text-[10px] uppercase tracking-widest font-bold px-3">Category</TableHead>
                  <TableHead className="h-9 text-[10px] uppercase tracking-widest font-bold px-3">Mode</TableHead>
                  <TableHead className="h-9 text-[10px] uppercase tracking-widest font-bold px-3">Date</TableHead>
                  <TableHead className="h-9 text-right text-[10px] uppercase tracking-widest font-bold px-3">Amount</TableHead>
                  {showActions && <TableHead className="w-[80px] h-9 px-3" />}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((t) => (
                  <TableRow key={t.id} className="h-12 border-white/5 group hover:bg-white/[0.02]">
                    <TableCell className="py-0 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`rounded-lg p-1.5 shrink-0 ${
                            t.type === "income"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {t.type === "income" ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownLeft className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-xs leading-tight truncate">
                            {t.description}
                          </p>
                          <p className="text-[10px] capitalize text-muted-foreground leading-tight">
                            {t.type}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-0 px-3">
                      <Badge variant="secondary" className="font-medium text-[10px] px-1.5 py-0 bg-white/5 text-muted-foreground border-white/10">
                        {t.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-0 px-3">
                      <span className="text-[10px] font-medium text-muted-foreground">
                        {t.paymentMode}
                      </span>
                    </TableCell>
                    <TableCell className="py-0 px-3 text-[10px] text-muted-foreground/70">
                      {formatDate(t.date)}
                    </TableCell>
                    <TableCell
                      className={`py-0 px-3 text-right font-bold tabular-nums text-xs ${
                        t.type === "income" ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount, settings.currency)}
                    </TableCell>
                    {showActions && (
                      <TableCell className="py-0 px-3 text-right">
                        <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ReceiptModal transaction={t} settings={settings} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => deleteTransaction(t.id)}
                            aria-label="Delete transaction"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
