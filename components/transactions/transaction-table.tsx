"use client";

import { Trash2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { ReceiptModal } from "./receipt-modal";

interface TransactionTableProps {
  transactions: Transaction[];
  showActions?: boolean;
}

export function TransactionTable({ transactions, showActions = true }: TransactionTableProps) {
  const { deleteTransaction, settings } = useHisaabContext();
  const { t, language } = useLanguage();

  if (transactions.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center p-6 text-center text-muted-foreground">
        <p className="text-sm font-medium">No transactions found</p>
      </div>
    );
  }

  return (
    <div className="w-full divide-y divide-border/60">
      {transactions.map((transaction) => (
        <div 
          key={transaction.id} 
          className="flex items-center justify-between p-3 sm:p-4 bg-card hover:bg-secondary/50 transition-colors group"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                transaction.type === "income"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownLeft className="h-4 w-4" />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm leading-tight text-foreground truncate">
                {transaction.description}
              </p>
              <p className="text-[11px] mt-0.5 text-muted-foreground truncate">
                {t(transaction.category as any)} • {formatDate(transaction.date)}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-0.5 pl-3 shrink-0">
            <p className={`text-sm font-semibold tabular-nums ${
              transaction.type === "income" ? "text-green-600 dark:text-green-400" : "text-foreground"
            }`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount, settings.currency)}
            </p>
            {showActions && (
              <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                 <ReceiptModal transaction={transaction} settings={settings} />
                 <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
