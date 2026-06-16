"use client";

import { Trash2, ArrowUpRight, ArrowDownLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/types";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { ReceiptModal } from "./receipt-modal";
import { motion } from "framer-motion";

interface TransactionTableProps {
  transactions: Transaction[];
  showActions?: boolean;
}

export function TransactionTable({ transactions, showActions = true }: TransactionTableProps) {
  const { deleteTransaction, settings } = useHisaabContext();
  const { t, language } = useLanguage();

  if (transactions.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-16 px-4 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] m-4"
      >
        <div className="h-16 w-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center mb-5 shadow-sm border border-slate-100 dark:border-white/5">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5 uppercase tracking-tight">Koi Hisaab Nahi Hai</h3>
        <p className="text-xs text-slate-500 font-bold text-center max-w-[220px] leading-relaxed">
          Abhi tak koi entry nahi hui hai. Nayi entry add karne ke liye <span className="text-primary">+</span> dabayein.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full divide-y divide-border/60">
      {transactions.map((transaction, index) => (
        <motion.div 
          key={transaction.id} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center justify-between p-3.5 sm:p-5 bg-card hover:bg-secondary/40 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                transaction.type === "income"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              } shadow-inner border border-transparent group-hover:border-current/10 transition-colors`}
            >
              {transaction.type === "income" ? (
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.5} />
              ) : (
                <ArrowDownLeft className="h-5 w-5" strokeWidth={2.5} />
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight text-slate-900 dark:text-white truncate">
                {transaction.customerName || transaction.description}
              </p>
              <div className="flex items-center gap-2 mt-1.5 overflow-hidden">
                <span className="text-[9px] font-black uppercase tracking-widest text-primary px-2 py-0.5 bg-primary/5 rounded-md border border-primary/5 whitespace-nowrap">
                   {t(transaction.category as any)}
                </span>
                <p className="text-[11px] font-bold text-slate-400 truncate">
                  {transaction.customerName && transaction.description && transaction.description !== "Entry" 
                    ? `${transaction.description} • ` 
                    : ""
                  }
                  {formatDate(transaction.date)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 pl-3 shrink-0">
            <p className={`text-base font-black tracking-tighter tabular-nums ${
              transaction.type === "income" ? "text-emerald-600 dark:text-emerald-400" : "text-slate-900 dark:text-white"
            }`}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount, settings.currency)}
            </p>
            {showActions && (
              <div className="flex items-center gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                 <ReceiptModal transaction={transaction} settings={settings} />
                 <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all active:scale-90"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
