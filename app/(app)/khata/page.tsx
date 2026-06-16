"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Search, Users, Phone, ChevronRight, ArrowUpRight, ArrowDownLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { formatCurrency } from "@/lib/utils";

export default function KhataPage() {
  const { customers, addCustomer, addCreditTransaction, settings } = useHisaabContext();
  const [search, setSearch] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", initialAmount: "", udharType: "give" as "give" | "receive" });

  // Manage Udhar State
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isManageUdharOpen, setIsManageUdharOpen] = useState(false);
  const [udharAmount, setUdharAmount] = useState("");
  const [udharDescription, setUdharDescription] = useState("");
  const [udharType, setUdharType] = useState<'give' | 'receive' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  );

  const totalReceivable = customers.reduce((acc, c) => acc + (c.totalCredit > 0 ? c.totalCredit : 0), 0);
  const totalPayable = Math.abs(customers.reduce((acc, c) => acc + (c.totalCredit < 0 ? c.totalCredit : 0), 0));
  const netBalance = totalReceivable - totalPayable;

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    setIsSubmitting(true);
    
    const newId = await addCustomer({ name: newCustomer.name, phone: newCustomer.phone });
    
    if (newCustomer.initialAmount && Number(newCustomer.initialAmount) > 0) {
      await addCreditTransaction({
        customerId: newId as string,
        amount: Number(newCustomer.initialAmount),
        type: newCustomer.udharType,
        description: "Opening Balance",
        date: new Date().toISOString(),
      });
    }

    setNewCustomer({ name: "", phone: "", initialAmount: "", udharType: "give" });
    setIsAddingCustomer(false);
    setIsSubmitting(false);
  };

  const handleAddUdhar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer || !udharAmount || !udharType) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    addCreditTransaction({
      customerId: selectedCustomer.id,
      amount: Number(udharAmount),
      type: udharType,
      description: udharDescription.trim() || (udharType === 'give' ? "Udhar Diya" : "Udhar Mila"),
      date: new Date().toISOString(),
    });

    setUdharAmount("");
    setUdharDescription("");
    setUdharType(null);
    setIsManageUdharOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen pb-32">
      {/* Compact Modern Header */}
      <section className="pt-4 pb-4 px-1">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl border border-white/5"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300/80">Aapka Kul Hisaab</span>
                <h1 className="text-4xl font-black tracking-tighter mt-1">
                  {formatCurrency(netBalance, settings.currency)}
                </h1>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xl border border-white/10 shadow-inner">
                <Users className="h-6 w-6 text-indigo-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/90">Lena Hai</span>
                 </div>
                 <p className="text-lg font-black text-emerald-400">{formatCurrency(totalReceivable, settings.currency)}</p>
              </div>
              <div className="bg-rose-500/10 rounded-2xl p-4 border border-rose-500/20 backdrop-blur-sm">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="h-2 w-2 rounded-full bg-rose-400" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-rose-300/90">Dena Hai</span>
                 </div>
                 <p className="text-lg font-black text-rose-400">{formatCurrency(totalPayable, settings.currency)}</p>
              </div>
            </div>
          </div>
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl -ml-8 -mb-8" />
        </motion.div>
      </section>

      {/* Elegant Search Bar */}
      <section className="sticky top-2 z-30 px-1 mb-6">
        <div className="relative flex items-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-1 shadow-lg shadow-slate-200/20 dark:shadow-none">
          <Search className="h-4 w-4 text-slate-400 mr-2" />
          <Input 
            placeholder="Search party name..." 
            className="border-none bg-transparent h-12 p-0 text-sm focus-visible:ring-0 placeholder:text-slate-400 font-bold"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </section>

      {/* Customer List Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em]">Party Wise Hisaab</h3>
          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20">
            {filteredCustomers.length} Parties
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredCustomers.length > 0 ? (
            <div className="grid gap-2">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsManageUdharOpen(true);
                  }}
                >
                  <Card className="rounded-2xl border-none bg-white dark:bg-slate-900/40 p-3 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-colors cursor-pointer group shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-lg shadow-sm">
                        {customer.name.charAt(0)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">{customer.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Phone className="h-2.5 w-2.5 opacity-70" />
                          {customer.phone || "No contact"}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        <p className={cn(
                          "font-black text-base tracking-tight",
                          customer.totalCredit > 0 ? "text-emerald-600 dark:text-emerald-400" : customer.totalCredit < 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"
                        )}>
                          {formatCurrency(Math.abs(customer.totalCredit), settings.currency)}
                        </p>
                        
                        <span className={cn(
                          "text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md",
                          customer.totalCredit > 0 
                            ? "bg-emerald-500/10 text-emerald-500" 
                            : customer.totalCredit < 0 
                              ? "bg-rose-500/10 text-rose-500" 
                              : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                        )}>
                          {customer.totalCredit > 0 ? "You'll Get" : customer.totalCredit < 0 ? "You'll Give" : "Settled"}
                        </span>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-primary transition-colors" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white dark:bg-slate-900/20 rounded-[1.5rem] border border-dashed border-slate-200 dark:border-slate-800"
            >
              <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">No customers found</h3>
              <p className="text-[11px] text-slate-500 mt-1">Start adding ledgers to track your hisaab.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Manage Udhar Dialog */}
      <Dialog open={isManageUdharOpen} onOpenChange={setIsManageUdharOpen}>
        <DialogContent className="border-none max-w-[95vw] sm:max-w-md rounded-[2.5rem] p-0 overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
           <div className="bg-slate-900 p-8 text-white relative">
              <div className="relative z-10">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Balance for</span>
                 <h2 className="text-2xl font-black tracking-tight mt-1">{selectedCustomer?.name}</h2>
                 <div className="mt-4">
                    <p className={cn(
                       "text-3xl font-black",
                       (selectedCustomer?.totalCredit || 0) > 0 ? "text-emerald-400" : (selectedCustomer?.totalCredit || 0) < 0 ? "text-rose-400" : "text-white"
                    )}>
                       {formatCurrency(Math.abs(selectedCustomer?.totalCredit || 0), settings.currency)}
                    </p>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                       {(selectedCustomer?.totalCredit || 0) > 0 ? "Lene Hain (You'll Get)" : (selectedCustomer?.totalCredit || 0) < 0 ? "Dene Hain (You'll Give)" : "Hisab Barabar"}
                    </span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
           </div>

           <div className="p-8 space-y-6">
              {!udharType ? (
                 <div className="grid grid-cols-2 gap-4">
                    <motion.button
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setUdharType('give')}
                       className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 group"
                    >
                       <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                          <ArrowUpRight className="h-6 w-6" />
                       </div>
                       <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-tight">Maine Diye</span>
                    </motion.button>

                    <motion.button
                       whileTap={{ scale: 0.95 }}
                       onClick={() => setUdharType('receive')}
                       className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 group"
                    >
                       <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/20 group-hover:scale-110 transition-transform">
                          <ArrowDownLeft className="h-6 w-6" />
                       </div>
                       <span className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-tight">Mujhe Mile</span>
                    </motion.button>
                 </div>
              ) : (
                 <motion.form 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleAddUdhar} 
                  className="space-y-4"
                 >
                    <div className="flex items-center gap-3 mb-2">
                       <button 
                        type="button" 
                        onClick={() => setUdharType(null)}
                        className="text-xs font-bold text-primary underline"
                       >
                          ← Change Type
                       </button>
                       <span className={cn(
                          "text-[10px] font-black uppercase px-3 py-1 rounded-full",
                          udharType === 'give' ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                       )}>
                          {udharType === 'give' ? "Adding 'Maine Diye'" : "Adding 'Mujhe Mile'"}
                       </span>
                    </div>

                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount</Label>
                       <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">{settings.currency}</span>
                          <Input 
                             type="number"
                             placeholder="0"
                             autoFocus
                             className="rounded-2xl h-14 bg-slate-50 dark:bg-slate-800 border-none pl-12 text-xl font-black focus-visible:ring-2 focus-visible:ring-primary/20"
                             value={udharAmount}
                             onChange={e => setUdharAmount(e.target.value)}
                             required
                          />
                       </div>
                    </div>

                    <div className="space-y-1.5">
                       <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Notes (Optional)</Label>
                       <Input 
                          placeholder="e.g. For Raw Material" 
                          className="rounded-2xl h-12 bg-slate-50 dark:bg-slate-800 border-none px-4 font-bold text-sm"
                          value={udharDescription}
                          onChange={e => setUdharDescription(e.target.value)}
                       />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting || !udharAmount}
                      className={cn(
                        "w-full h-14 rounded-2xl text-base font-black shadow-lg transition-all",
                        udharType === 'give' ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                      )}
                    >
                       {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Entry"}
                    </Button>
                 </motion.form>
              )}
           </div>
        </DialogContent>
      </Dialog>

      {/* Refined Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50">
        <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
          <DialogTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/25"
            >
              <Plus className="h-7 w-7" />
            </motion.button>
          </DialogTrigger>
          <DialogContent className="border-none max-w-[90vw] rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-bold tracking-tight">New Customer Ledger</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Party Name</Label>
                <Input 
                  placeholder="e.g. Rahul Sharma" 
                  className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm font-semibold focus-visible:ring-1 focus-visible:ring-primary/30"
                  value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  required
                />
              </div>
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Pichla Udhar (Opening Balance)</Label>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => setNewCustomer({...newCustomer, udharType: 'give'})}
                    className={cn(
                      "h-10 rounded-xl text-xs font-bold transition-all border",
                      newCustomer.udharType === 'give' 
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-sm" 
                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500"
                    )}
                  >
                    Maine Diye (Get)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCustomer({...newCustomer, udharType: 'receive'})}
                    className={cn(
                      "h-10 rounded-xl text-xs font-bold transition-all border",
                      newCustomer.udharType === 'receive' 
                        ? "bg-rose-50 dark:bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm" 
                        : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500"
                    )}
                  >
                    Mujhe Mile (Give)
                  </button>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">{settings.currency}</span>
                  <Input 
                    type="number"
                    placeholder="0" 
                    className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none pl-10 pr-4 text-base font-black focus-visible:ring-1 focus-visible:ring-primary/30"
                    value={newCustomer.initialAmount}
                    onChange={e => setNewCustomer({...newCustomer, initialAmount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number (Optional)</Label>
                <Input 
                  placeholder="9876543210" 
                  className="rounded-xl h-12 bg-slate-50 dark:bg-slate-800 border-none px-4 text-sm font-semibold focus-visible:ring-1 focus-visible:ring-primary/30"
                  value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md shadow-primary/10 mt-4"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Ledger"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
