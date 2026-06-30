"use client";

import { Edit3, Trash2, ArrowUpRight, ArrowDownLeft, FileText, User, Plus } from "lucide-react";
import Link from "next/link";
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
  const { deleteTransaction, updateTransaction, settings } = useHisaabContext();
  const { t, language } = useLanguage();

  const handleEdit = async (transaction: Transaction) => {
    const newDescription = window.prompt("Update description", transaction.description || "")?.trim();
    if (newDescription === undefined) return;

    const newAmountValue = window.prompt("Update amount", String(transaction.amount));
    if (newAmountValue === null) return;
    const newAmount = Number(newAmountValue);
    if (Number.isNaN(newAmount)) return;

    await updateTransaction(transaction.id, {
      description: newDescription,
      amount: newAmount,
    });
  };

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
        <p className="text-xs text-slate-500 font-bold text-center max-w-[220px] leading-relaxed mb-6">
          Abhi tak koi entry nahi hui hai. Nayi entry add karne ke liye <span className="text-primary">+</span> dabayein.
        </p>
        <Link href="/udhar/add">
          <Button className="rounded-2xl font-bold bg-[#6D5DF6] hover:bg-[#6D5DF6]/95 text-white shadow-lg transition-all px-6 h-11 text-xs">
            <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
            Add Udhar
          </Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="w-full divide-y divide-slate-200">
      {transactions.map((transaction, index) => (
        <motion.div 
          key={transaction.id} 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03 }}
          className="flex items-center justify-between gap-4 p-4 bg-white border-b border-slate-100"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                transaction.type === "income" || transaction.type === "udhaar"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              } shadow-inner border border-transparent group-hover:border-current/10 transition-colors`}
            >
              {transaction.type === "income" || transaction.type === "udhaar" ? (
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
                {transaction.type === 'udhaar' && (
                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-rose-600 dark:text-rose-400 px-2 py-0.5 bg-rose-50 dark:bg-rose-950/20 rounded-md border border-rose-100 dark:border-rose-950/40 whitespace-nowrap">
                    Given (Diya)
                  </span>
                )}
                {transaction.type === 'payment' && (
                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 rounded-md border border-emerald-100 dark:border-emerald-950/40 whitespace-nowrap">
                    Received (Mila)
                  </span>
                )}
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
          
          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className={`text-base font-black tracking-tighter tabular-nums ${
              transaction.type === "income" || transaction.type === "udhaar" ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}>
              {transaction.type === "income" || transaction.type === "udhaar" ? "+" : "-"}
              {formatCurrency(transaction.amount, settings.currency)}
            </p>
            {showActions && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-2xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition"
                  onClick={() => handleEdit(transaction)}
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-100 transition"
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
