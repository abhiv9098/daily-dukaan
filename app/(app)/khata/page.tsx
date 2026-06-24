"use client";

import { useState, useMemo } from "react";
import { Plus, Search, Users, Phone, ChevronRight, ArrowUpRight, ArrowDownLeft, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useHisaabContext } from "@/context/hisaab-context";
import { formatCurrency } from "@/lib/utils";

export default function KhataPage() {
  const { customers, addCustomer, addCreditTransaction, deleteCustomer, deleteCreditTransaction, settings, creditTransactions } = useHisaabContext();
  const [search, setSearch] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", initialAmount: "", udharType: "give" as "give" | "receive" });

  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [isManageUdharOpen, setIsManageUdharOpen] = useState(false);
  const [udharAmount, setUdharAmount] = useState("");
  const [udharDescription, setUdharDescription] = useState("");
  const [udharType, setUdharType] = useState<'give' | 'receive' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredCustomers = useMemo(() =>
    customers.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.phone?.includes(search)
    ), [customers, search]
  );

  const { totalReceivable, totalPayable, netBalance } = useMemo(() => {
    const receive = customers.reduce((acc, c) => acc + (c.totalCredit > 0 ? c.totalCredit : 0), 0);
    const pay = Math.abs(customers.reduce((acc, c) => acc + (c.totalCredit < 0 ? c.totalCredit : 0), 0));
    return { totalReceivable: receive, totalPayable: pay, netBalance: receive - pay };
  }, [customers]);

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

    await addCreditTransaction({
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

  const handleDeleteCreditTransaction = async (transactionId: string) => {
    const confirmed = window.confirm("Delete this udhaar entry? This will update the party balance.");
    if (!confirmed) return;
    await deleteCreditTransaction(transactionId);
  };

  const handleDeleteCustomer = async (customerId: string) => {
    const confirmed = window.confirm("Delete this party and all its udhaar records? This cannot be undone.");
    if (!confirmed) return;
    await deleteCustomer(customerId);
    if (selectedCustomer?.id === customerId) {
      setSelectedCustomer(null);
      setIsManageUdharOpen(false);
    }
  };

  return (
    <div className="relative min-h-screen pb-32 px-4">
      {/* Header Section with Balance */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 pb-6"
      >
        <div className="relative overflow-hidden bg-gradient-to-tr from-[#6D5DF6]/10 to-[#818cf8]/5 dark:from-[#6D5DF6]/20 dark:to-slate-900 border border-indigo-100/40 dark:border-white/5 rounded-[24px] shadow-[0_8px_32px_rgba(109,93,246,0.04)] p-6 space-y-5">
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[11px] font-bold text-indigo-650/70 dark:text-indigo-400 uppercase tracking-widest block mb-1">Aapka Kul Hisaab</h2>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">{formatCurrency(netBalance, settings.currency)}</h1>
              </div>
              <div className="h-11 w-11 rounded-2xl bg-[#6D5DF6]/10 dark:bg-[#6D5DF6]/20 flex items-center justify-center text-[#6D5DF6]">
                <Users className="h-5 w-5" strokeWidth={2} />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <ArrowDownLeft className="h-3.5 w-3.5 text-rose-500" />
                  <span>LENA HAI</span>
                </div>
                <p className="text-lg font-black text-rose-600 dark:text-rose-400">{formatCurrency(totalReceivable, settings.currency)}</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  <span>DENA HAI</span>
                </div>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-450">{formatCurrency(totalPayable, settings.currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Search Bar */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-4 z-30 mb-6"
      >
        <div className="relative flex items-center bg-slate-100/50 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900/80 focus-within:bg-white dark:focus-within:bg-slate-900 border border-transparent focus-within:border-[#6D5DF6]/30 dark:focus-within:border-[#6D5DF6]/50 rounded-2xl px-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)] focus-within:shadow-[0_4px_20px_rgba(109,93,246,0.06)] transition-all duration-200">
          <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 mr-3" />
          <Input 
            placeholder="Search party name or number..." 
            className="border-none bg-transparent h-12 p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 font-semibold text-slate-800 dark:text-slate-200"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </motion.section>

      {/* Customer List */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1 mb-3">
          <h3 className="text-sm font-bold text-slate-905 dark:text-white">Party Wise Hisaab</h3>
          <div className="flex items-center gap-2">
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="text-xs font-bold text-[#6D5DF6] dark:text-[#6D5DF6]/90 px-3 py-1 rounded-full bg-[#6D5DF6]/10 border border-[#6D5DF6]/20 inline-block"
            >
              {filteredCustomers.length} Parties
            </motion.span>
            <button
              type="button"
              onClick={() => setIsAddingCustomer(true)}
              className="text-xs font-bold text-[#6D5DF6] hover:text-[#6D5DF6]/95 flex items-center gap-1 hover:bg-[#6D5DF6]/10 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2.5} /> Add Party
            </button>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {filteredCustomers.length > 0 ? (
            <div className="space-y-2.5">
              {filteredCustomers.map((customer, index) => (
                <motion.div
                  key={customer.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.03 }}
                  className="group"
                >
                  <Card 
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setIsManageUdharOpen(true);
                    }}
                    className="rounded-2xl border border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/40 p-4 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm rounded-full shrink-0">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-slate-950 dark:text-slate-50 truncate">{customer.name}</h4>
                        <p className="text-xs text-slate-400 dark:text-slate-550 flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3 w-3 opacity-60" />
                          <span className="truncate">{customer.phone || "No contact"}</span>
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                        <div className="flex items-baseline gap-1.5 justify-end">
                          <p className={cn(
                            "font-black text-sm tracking-tight",
                            customer.totalCredit > 0 ? "text-rose-600 dark:text-rose-400" : customer.totalCredit < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"
                          )}>
                            {formatCurrency(Math.abs(customer.totalCredit), settings.currency)}
                          </p>
                          <span className={cn(
                            "text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap",
                            customer.totalCredit > 0 
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-455" 
                              : customer.totalCredit < 0 
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          )}>
                            {customer.totalCredit > 0 ? "Lena" : customer.totalCredit < 0 ? "Dena" : "Settled"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              setSelectedCustomer(customer);
                              setIsManageUdharOpen(true);
                            }}
                            className="rounded-xl bg-[#6D5DF6] hover:bg-[#6D5DF6]/95 text-white shadow-sm font-bold text-[10px] px-3 py-1 transition duration-150"
                          >
                            Add Udhar
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              event.preventDefault();
                              handleDeleteCustomer(customer.id);
                            }}
                            className="rounded-xl border border-rose-200/40 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 hover:bg-rose-100/80 font-bold text-[10px] px-3 py-1 transition duration-150"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[24px] p-8 text-center shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#6D5DF6]/20 to-transparent" />
              
              {/* Friendly abstract vector illustration */}
              <svg className="mx-auto mb-5 w-32 h-32 text-indigo-400 dark:text-indigo-900" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="35" y="25" width="50" height="70" rx="8" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.02" />
                <line x1="47" y1="45" x2="73" y2="45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="47" y1="58" x2="65" y2="58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="73" cy="58" r="3" fill="#6D5DF6" />
                <line x1="47" y1="71" x2="73" y2="71" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="25" cy="40" r="8" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <path d="M98 75L93 80L98 85" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="95" cy="35" r="4" fill="currentColor" />
              </svg>
              
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">No parties found</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium max-w-[250px] mx-auto mb-10 leading-relaxed">Start adding customers to log credit entries (Udhar) and track hisaab.</p>
              
              <Button type="button" onClick={() => setIsAddingCustomer(true)} className="h-11 rounded-2xl font-bold bg-[#6D5DF6] hover:bg-[#6D5DF6]/95 text-white transition-all shadow-[0_4px_14px_rgba(109,93,246,0.3)] px-6 mt-2 animate-pulse-subtle" size="sm">
                <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
                Add First Party
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Manage Udhar Dialog */}
      <Dialog open={isManageUdharOpen} onOpenChange={setIsManageUdharOpen}>
        <DialogContent className="border-none max-w-[95vw] sm:max-w-md rounded-3xl p-0 overflow-hidden bg-white dark:bg-slate-900 shadow-2xl">
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 text-white relative">
            <div className="relative z-10">
              <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Current Balance for</span>
              <DialogTitle className="text-2xl font-black tracking-tight mt-2">{selectedCustomer?.name}</DialogTitle>
              <div className="mt-4">
                <p className={cn(
                  "text-4xl font-black tracking-tight",
                  (selectedCustomer?.totalCredit || 0) > 0 ? "text-rose-400" : (selectedCustomer?.totalCredit || 0) < 0 ? "text-emerald-400" : "text-white"
                )}>
                  {formatCurrency(Math.abs(selectedCustomer?.totalCredit || 0), settings.currency)}
                </p>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 block">
                  {(selectedCustomer?.totalCredit || 0) > 0 ? "Lene Hain (You'll Get)" : (selectedCustomer?.totalCredit || 0) < 0 ? "Dene Hain (You'll Give)" : "Settled"}
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl" />
          </div>

          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Transaction History */}
            {selectedCustomer && creditTransactions && (creditTransactions.filter(ct => ct.customerId === selectedCustomer.id).length > 0) && (
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Recent Transactions</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {creditTransactions.filter(ct => ct.customerId === selectedCustomer.id).slice(0, 10).map((ct) => (
                    <div key={ct.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{ct.description || (ct.type === 'give' ? 'Maine Diye' : 'Mujhe Mile')}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{new Date(ct.date).toLocaleDateString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={cn("font-bold text-sm", ct.type === 'give' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
                          {ct.type === 'give' ? '+' : '-'}{formatCurrency(ct.amount, settings.currency)}
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteCreditTransaction(ct.id);
                          }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-600 hover:border-rose-200 transition-colors"
                          aria-label="Delete transaction"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons or Form */}
            {!udharType ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUdharType('give')}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/30 hover:border-rose-400 dark:hover:border-rose-500/50 transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowUpRight className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase">Maine Diye</span>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUdharType('receive')}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border-2 border-emerald-200 dark:border-emerald-500/30 hover:border-emerald-400 dark:hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <ArrowDownLeft className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase">Mujhe Mile</span>
                  </motion.button>
                </div>

                {selectedCustomer && selectedCustomer.totalCredit !== 0 && (
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={async () => {
                      const halfAmount = Math.abs(selectedCustomer.totalCredit) / 2;
                      const isLena = selectedCustomer.totalCredit > 0;
                      const type = isLena ? 'receive' : 'give';
                      const description = isLena ? 'Aadha Mila (50% Payment)' : 'Aadha Diya (50% Return)';
                      
                      setIsSubmitting(true);
                      try {
                        await addCreditTransaction({
                          customerId: selectedCustomer.id,
                          amount: halfAmount,
                          type,
                          description,
                          date: new Date().toISOString(),
                        });
                        setIsManageUdharOpen(false);
                      } catch (error) {
                        console.error("Failed to save half payment:", error);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-2xl border border-indigo-200/50 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/10 hover:bg-indigo-100/50 dark:hover:bg-indigo-500/20 text-[#6D5DF6] dark:text-[#818cf8] font-bold text-xs flex items-center justify-center gap-1.5 transition-all duration-200"
                  >
                    {selectedCustomer.totalCredit > 0 ? "Aadha Mila (Deposit 50%): " : "Aadha Diya (Pay 50%): "}
                    <span className="font-extrabold text-sm">{formatCurrency(Math.abs(selectedCustomer.totalCredit) / 2, settings.currency)}</span>
                  </motion.button>
                )}
              </div>
            ) : (
              <motion.form 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleAddUdhar} 
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <button 
                    type="button" 
                    onClick={() => setUdharType(null)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 underline"
                  >
                    ← Change Type
                  </button>
                  <span className={cn(
                    "text-xs font-black uppercase px-3 py-1.5 rounded-full text-white",
                    udharType === 'give' ? "bg-rose-500" : "bg-emerald-500"
                  )}>
                    {udharType === 'give' ? "Maine Diye" : "Mujhe Mile"}
                  </span>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{settings.currency}</span>
                    <Input 
                      type="number"
                      placeholder="0"
                      autoFocus
                      className={cn(
                        "rounded-xl h-12 bg-slate-100 dark:bg-slate-800 border-none text-lg font-black focus-visible:ring-2 focus-visible:ring-indigo-500/30",
                        settings.currency.length > 2 ? "pl-16" : settings.currency.length > 1 ? "pl-12" : "pl-10"
                      )}
                      value={udharAmount}
                      onChange={e => setUdharAmount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Notes (Optional)</Label>
                  <Input 
                    placeholder="e.g. For Raw Material" 
                    className="rounded-xl h-11 bg-slate-100 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                    value={udharDescription}
                    onChange={e => setUdharDescription(e.target.value)}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !udharAmount}
                  className={cn(
                    "w-full h-12 rounded-xl text-sm font-bold shadow-lg transition-all",
                    udharType === 'give' ? "bg-rose-500 hover:bg-rose-600" : "bg-emerald-500 hover:bg-emerald-600"
                  )}
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Entry"}
                </Button>
              </motion.form>
            )}

            <button
              onClick={() => {
                handleDeleteCustomer(selectedCustomer?.id || "");
              }}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border-2 border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm font-bold text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Delete Party
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating Action Button */}
      <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
        <DialogTrigger asChild>
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="fixed bottom-20 right-6 h-14 w-14 rounded-full bg-[#6D5DF6] text-white flex items-center justify-center shadow-lg shadow-indigo-600/35 border border-white/20 z-40"
          >
            <Plus className="h-7 w-7" />
          </motion.button>
        </DialogTrigger>
        <DialogContent className="border-none max-w-[90vw] sm:max-w-md rounded-3xl p-6 bg-white dark:bg-slate-900 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold">New Customer Ledger</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Party Name</Label>
              <Input 
                placeholder="e.g. Rahul Sharma" 
                className="rounded-xl h-12 bg-slate-100 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                value={newCustomer.name}
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                required
                autoFocus
              />
            </div>
            
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Pichla Udhar (Opening Balance)</Label>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewCustomer({...newCustomer, udharType: 'give'})}
                  className={cn(
                    "h-10 rounded-xl text-xs font-bold transition-all border-2",
                    newCustomer.udharType === 'give' 
                      ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400" 
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  )}
                >
                  Maine Diye
                </button>
                <button
                  type="button"
                  onClick={() => setNewCustomer({...newCustomer, udharType: 'receive'})}
                  className={cn(
                    "h-10 rounded-xl text-xs font-bold transition-all border-2",
                    newCustomer.udharType === 'receive' 
                      ? "bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-400" 
                      : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                  )}
                >
                  Mujhe Mile
                </button>
              </div>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">{settings.currency}</span>
                <Input 
                  type="number"
                  placeholder="0" 
                  className={cn(
                    "rounded-xl h-12 bg-slate-100 dark:bg-slate-800 border-none pr-4 text-lg font-black focus-visible:ring-2 focus-visible:ring-indigo-500/30",
                    settings.currency.length > 2 ? "pl-16" : settings.currency.length > 1 ? "pl-12" : "pl-10"
                  )}
                  value={newCustomer.initialAmount}
                  onChange={e => setNewCustomer({...newCustomer, initialAmount: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Phone Number (Optional)</Label>
              <Input 
                placeholder="9876543210" 
                className="rounded-xl h-12 bg-slate-100 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-indigo-500/30"
                value={newCustomer.phone}
                onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSubmitting || !newCustomer.name}
              className="w-full h-12 rounded-xl text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-6"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add Party"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
