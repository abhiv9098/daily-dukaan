"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Search, Users, Phone, Trash2, Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

export default function KhataPageV2() {
  const { customers, addCustomer, addCreditTransaction, deleteCustomer, settings, creditTransactions } = useHisaabContext();
  const [search, setSearch] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isManagingTransaction, setIsManagingTransaction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add Customer Form
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [initialAmount, setInitialAmount] = useState("");
  const [initialType, setInitialType] = useState<"give" | "receive">("give");

  // Add Transaction Form
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionType, setTransactionType] = useState<"give" | "receive" | null>(null);
  const [transactionNote, setTransactionNote] = useState("");

  // Calculate totals
  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  const totalLenaHai = customers.reduce((acc, c) => acc + Math.max(0, c.totalCredit), 0);
  const totalDenaHai = customers.reduce((acc, c) => acc + Math.max(0, -c.totalCredit), 0);
  const netBalance = totalLenaHai - totalDenaHai;

  // Add customer handler
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName.trim()) return;

    setIsSubmitting(true);
    const newId = await addCustomer({
      name: newCustomerName.trim(),
      phone: newCustomerPhone.trim() || undefined,
    });

    if (initialAmount && Number(initialAmount) > 0) {
      await addCreditTransaction({
        customerId: newId as string,
        amount: Number(initialAmount),
        type: initialType,
        description: "Opening Balance",
        date: new Date().toISOString(),
      });
    }

    setNewCustomerName("");
    setNewCustomerPhone("");
    setInitialAmount("");
    setInitialType("give");
    setIsAddingCustomer(false);
    setIsSubmitting(false);
  };

  // Add transaction handler
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !transactionAmount || !transactionType) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    await addCreditTransaction({
      customerId: selectedCustomer.id,
      amount: Number(transactionAmount),
      type: transactionType,
      description: transactionNote.trim() || (transactionType === "give" ? "Added" : "Received"),
      date: new Date().toISOString(),
    });

    setTransactionAmount("");
    setTransactionType(null);
    setTransactionNote("");
    setIsManagingTransaction(false);
    setIsSubmitting(false);
  };

  // Delete customer handler
  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm("Delete this party and all records? This cannot be undone.")) {
      await deleteCustomer(customerId);
      if (selectedCustomer?.id === customerId) {
        setSelectedCustomer(null);
        setIsManagingTransaction(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 pb-32">
      {/* Header Section */}
      <section className="px-4 pt-6 pb-8 space-y-4">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 border border-white/10 relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl -ml-16 -mb-16" />

          <div className="relative z-10">
            {/* Total Balance */}
            <div className="mb-8">
              <p className="text-sm font-semibold opacity-90 mb-1">Total Balance</p>
              <h1 className="text-5xl font-black tracking-tighter">
                {formatCurrency(netBalance, settings.currency)}
              </h1>
            </div>

            {/* Two Column Stats */}
            <div className="grid grid-cols-2 gap-4">
              {/* Lena Hai */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  <p className="text-xs font-bold opacity-75 uppercase tracking-wider">Lena Hai</p>
                </div>
                <p className="text-2xl font-black">{formatCurrency(totalLenaHai, settings.currency)}</p>
              </div>

              {/* Dena Hai */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-red-300" />
                  <p className="text-xs font-bold opacity-75 uppercase tracking-wider">Dena Hai</p>
                </div>
                <p className="text-2xl font-black">{formatCurrency(totalDenaHai, settings.currency)}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            placeholder="Search by party name or phone..."
            className="w-full pl-12 pr-4 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm focus-visible:ring-2 focus-visible:ring-blue-500/30 text-sm font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Content Section */}
      <section className="px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
            Party Wise Hisaab
          </h2>
          {filteredCustomers.length > 0 && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? "Party" : "Parties"}
            </span>
          )}
        </div>

        {/* Customer List or Empty State */}
        <AnimatePresence mode="wait">
          {filteredCustomers.length > 0 ? (
            <motion.div className="space-y-3">
              {filteredCustomers.map((customer, index) => {
                const isPositive = customer.totalCredit > 0;
                const isNegative = customer.totalCredit < 0;

                return (
                  <motion.div
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsManagingTransaction(true);
                    }}
                    className="group"
                  >
                    <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-4 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-900 dark:text-white truncate">
                            {customer.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {customer.phone && (
                              <>
                                <Phone className="h-3 w-3" />
                                <span>{customer.phone}</span>
                              </>
                            )}
                            {!customer.phone && <span>No contact</span>}
                          </div>
                        </div>

                        {/* Amount & Status */}
                        <div className="text-right flex flex-col items-end gap-1.5">
                          <p
                            className={cn(
                              "text-lg font-black tracking-tight",
                              isPositive && "text-emerald-600 dark:text-emerald-400",
                              isNegative && "text-red-600 dark:text-red-400",
                              !isPositive && !isNegative && "text-slate-400"
                            )}
                          >
                            {formatCurrency(Math.abs(customer.totalCredit), settings.currency)}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg",
                              isPositive &&
                                "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300",
                              isNegative &&
                                "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300",
                              !isPositive &&
                                !isNegative &&
                                "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            )}
                          >
                            {isPositive
                              ? "Lena Hai"
                              : isNegative
                                ? "Dena Hai"
                                : "Barabar"}
                          </span>
                        </div>

                        {/* Delete Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCustomer(customer.id);
                          }}
                          className="ml-2 p-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                          title="Delete party"
                        >
                          <Trash2 className="h-4 w-4" />
                        </motion.button>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
            >
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                <Users className="h-8 w-8 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                No customers found
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Start adding ledgers to track your hisaab.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Add Customer Dialog */}
      <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-28 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow"
          >
            <Plus className="h-6 w-6" strokeWidth={3} />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl p-0 border-none shadow-2xl">
          <DialogHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-t-3xl">
            <DialogTitle className="text-2xl font-black tracking-tight">
              Add New Party
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddCustomer} className="p-8 space-y-6">
            {/* Party Name */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                Party Name *
              </Label>
              <Input
                placeholder="e.g. Sharma Store"
                className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500/30"
                value={newCustomerName}
                onChange={(e) => setNewCustomerName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                Phone (Optional)
              </Label>
              <Input
                placeholder="9876543210"
                className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus-visible:ring-2 focus-visible:ring-blue-500/30"
                value={newCustomerPhone}
                onChange={(e) => setNewCustomerPhone(e.target.value)}
              />
            </div>

            {/* Opening Balance Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest block mb-3">
                Opening Balance (Optional)
              </Label>

              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setInitialType("give")}
                  className={cn(
                    "h-11 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2",
                    initialType === "give"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <ArrowUpRight className="inline h-4 w-4 mr-1" />
                  Lena Hai (Get)
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setInitialType("receive")}
                  className={cn(
                    "h-11 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border-2",
                    initialType === "receive"
                      ? "bg-red-50 dark:bg-red-500/10 border-red-500 text-red-700 dark:text-red-300"
                      : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  )}
                >
                  <ArrowDownLeft className="inline h-4 w-4 mr-1" />
                  Dena Hai (Give)
                </motion.button>
              </div>

              {/* Amount Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">
                  {settings.currency}
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 text-lg font-black focus-visible:ring-2 focus-visible:ring-blue-500/30"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting || !newCustomerName.trim()}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Create Party Ledger"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Manage Transaction Dialog */}
      <Dialog open={isManagingTransaction} onOpenChange={setIsManagingTransaction}>
        <DialogContent className="rounded-3xl p-0 border-none shadow-2xl">
          {selectedCustomer && (
            <>
              <DialogHeader className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-t-3xl">
                <div>
                  <p className="text-xs font-bold opacity-75 uppercase tracking-widest mb-1">Current Balance</p>
                  <DialogTitle className="text-3xl font-black tracking-tight mb-3">
                    {selectedCustomer.name}
                  </DialogTitle>
                  <p
                    className={cn(
                      "text-2xl font-black",
                      selectedCustomer.totalCredit > 0
                        ? "text-emerald-400"
                        : selectedCustomer.totalCredit < 0
                          ? "text-red-400"
                          : "text-slate-300"
                    )}
                  >
                    {formatCurrency(
                      Math.abs(selectedCustomer.totalCredit),
                      settings.currency
                    )}{" "}
                    <span className="text-xs font-bold opacity-75">
                      {selectedCustomer.totalCredit > 0
                        ? "(Lena Hai)"
                        : selectedCustomer.totalCredit < 0
                          ? "(Dena Hai)"
                          : "(Settled)"}
                    </span>
                  </p>
                </div>
              </DialogHeader>

              <div className="p-8 space-y-6">
                {/* Transaction History */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">
                    Recent Transactions
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 bg-slate-50 dark:bg-slate-900/30 rounded-xl p-3">
                    {(creditTransactions || [])
                      .filter((ct) => ct.customerId === selectedCustomer.id)
                      .slice(0, 10)
                      .map((ct) => (
                        <div
                          key={ct.id}
                          className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2 last:border-0"
                        >
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {ct.description}
                            </p>
                            <p className="text-slate-500 dark:text-slate-400">
                              {new Date(ct.date).toLocaleDateString()}
                            </p>
                          </div>
                          <p
                            className={cn(
                              "font-bold",
                              ct.type === "give"
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-red-600 dark:text-red-400"
                            )}
                          >
                            {ct.type === "give" ? "+" : "-"}
                            {formatCurrency(ct.amount, settings.currency)}
                          </p>
                        </div>
                      ))}
                    {(creditTransactions || []).filter(
                      (ct) => ct.customerId === selectedCustomer.id
                    ).length === 0 && (
                      <p className="text-center text-slate-500 py-3 text-xs">
                        No transactions yet
                      </p>
                    )}
                  </div>
                </div>

                {/* Add Transaction Form */}
                {!transactionType ? (
                  <div className="grid grid-cols-2 gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setTransactionType("give")}
                      className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 text-center hover:shadow-lg hover:shadow-emerald-500/10 transition-all"
                    >
                      <ArrowUpRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2" />
                      <p className="font-bold text-xs text-emerald-700 dark:text-emerald-300">
                        Lena Hai
                      </p>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setTransactionType("receive")}
                      className="p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/30 text-center hover:shadow-lg hover:shadow-red-500/10 transition-all"
                    >
                      <ArrowDownLeft className="h-6 w-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                      <p className="font-bold text-xs text-red-700 dark:text-red-300">
                        Dena Hai
                      </p>
                    </motion.button>
                  </div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleAddTransaction}
                    className="space-y-4 pt-4"
                  >
                    <button
                      type="button"
                      onClick={() => setTransactionType(null)}
                      className="text-xs font-bold text-blue-600 dark:text-blue-400 underline"
                    >
                      ← Change Type
                    </button>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                        Amount *
                      </Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">
                          {settings.currency}
                        </span>
                        <Input
                          type="number"
                          placeholder="0"
                          autoFocus
                          className="h-12 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 text-lg font-black focus-visible:ring-2 focus-visible:ring-blue-500/30"
                          value={transactionAmount}
                          onChange={(e) => setTransactionAmount(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Note */}
                    <div className="space-y-2">
                      <Label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                        Note (Optional)
                      </Label>
                      <Input
                        placeholder="e.g. For goods..."
                        className="h-11 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus-visible:ring-2 focus-visible:ring-blue-500/30"
                        value={transactionNote}
                        onChange={(e) => setTransactionNote(e.target.value)}
                      />
                    </div>

                    {/* Submit */}
                    <Button
                      type="submit"
                      disabled={isSubmitting || !transactionAmount}
                      className={cn(
                        "w-full h-12 rounded-xl text-white font-bold shadow-lg transition-all disabled:opacity-50",
                        transactionType === "give"
                          ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                          : "bg-red-500 hover:bg-red-600 shadow-red-500/20"
                      )}
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        "Save Entry"
                      )}
                    </Button>
                  </motion.form>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
