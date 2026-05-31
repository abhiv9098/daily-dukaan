"use client";

import { Share2, Store, Calendar, CreditCard, User, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Transaction, ShopSettings } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ReceiptModalProps {
  transaction: Transaction;
  settings: ShopSettings;
  trigger?: React.ReactNode;
}

export function ReceiptModal({ transaction, settings, trigger }: ReceiptModalProps) {
  const isIncome = transaction.type === "income";

  const shareOnWhatsApp = () => {
    const amount = formatCurrency(transaction.amount, settings.currency);
    const date = formatDate(transaction.date);
    const shopName = settings.shopName;
    const customer = transaction.customerName || "Customer";
    const status = isIncome ? "Paid" : "Spent";

    const message = `*Receipt from ${shopName}*\n\n` +
      `*Customer:* ${customer}\n` +
      `*Amount:* ${amount}\n` +
      `*Date:* ${date}\n` +
      `*Status:* ${status}\n` +
      `*Mode:* ${transaction.paymentMode}\n` +
      `*Note:* ${transaction.description}\n\n` +
      `Thank you for your business!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" title="Share Receipt" className="h-7 w-7 text-muted-foreground hover:text-purple-500 hover:bg-purple-500/10">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Digital Receipt</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="rounded-xl border border-dashed bg-muted/30 p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg">{settings.shopName}</span>
              </div>
              <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {isIncome ? "Payment In" : "Payment Out"}
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Customer</span>
                </div>
                <span className="font-medium">{transaction.customerName || "Walking Customer"}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Date</span>
                </div>
                <span className="font-medium">{formatDate(transaction.date)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  <span>Payment Mode</span>
                </div>
                <span className="font-medium">{transaction.paymentMode}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-dashed">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Total Amount</span>
                <span className={`text-2xl font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(transaction.amount, settings.currency)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                {transaction.description}
              </p>
            </div>
          </div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="w-full"
          >
            <Button 
              onClick={shareOnWhatsApp} 
              className="w-full gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-blue-600 text-white shadow-lg transition-colors duration-200"
            >
              <MessageCircle className="h-5 w-5" />
              Share on WhatsApp
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
