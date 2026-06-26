"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowDownLeft, 
  ArrowUpRight, 
  Check, 
  User, 
  Loader2, 
  Calendar, 
  Camera, 
  Paperclip, 
  CreditCard, 
  Banknote, 
  Smartphone,
  Landmark,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { getCategoriesForType } from "@/lib/constants";
import { Category, PaymentMode, TransactionType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function TransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addTransaction, customers, settings, addCustomer, addCreditTransaction } = useHisaabContext();
  const { t } = useLanguage();
  const amountInputRef = useRef<HTMLInputElement>(null);

  const initialType = (searchParams.get("type") as TransactionType) || "income";
  const [type, setType] = useState<TransactionType>(initialType === "udhaar" || initialType === "payment" ? "income" : initialType);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Sales");
  const [description, setDescription] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState<string>("none");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = getCategoriesForType(type);

  useEffect(() => {
    // Reset category when type changes
    if (type === "income") setCategory("Sales");
    else if (type === "expense") setCategory("Stock");
  }, [type]);

  useEffect(() => {
    amountInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    let finalCustomerId = customerId === "none" ? undefined : customerId;

    const transactionData = {
      amount: parsed,
      type,
      category,
      description: description.trim() || (customerName.trim() ? "" : "Entry"),
      date: new Date(date).toISOString(),
      paymentMode,
      customerName: customerName.trim() || undefined,
      customerId: finalCustomerId,
    };

    await addTransaction(transactionData);

    router.push("/");
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      {/* Type Toggle */}
      <div className="relative flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl h-14 w-full max-w-lg mx-auto shadow-inner border border-slate-200/50 dark:border-white/5">
        <div className="relative flex w-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={type}
              layoutId="active-type"
              className={cn(
                "absolute inset-0 rounded-xl shadow-md",
                type === "income" ? "bg-emerald-500 left-0 w-1/2" : "bg-rose-500 left-1/2 w-1/2"
              )}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setType("income")}
            className={cn("relative z-10 flex-1 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none", type === 'income' ? 'text-white' : 'text-slate-500')}
          >
            <ArrowUpRight className="h-3.5 w-3.5" /> Kamayi
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            className={cn("relative z-10 flex-1 flex items-center justify-center gap-1 md:gap-2 text-[10px] md:text-sm font-bold transition-colors focus:outline-none focus-visible:ring-0 focus-visible:outline-none", type === 'expense' ? 'text-white' : 'text-slate-500')}
          >
            <ArrowDownLeft className="h-3.5 w-3.5" /> Kharcha
          </button>
        </div>
      </div>

      {/* Amount Input Section */}
      <div className={cn(
        "fintech-card p-10 relative overflow-hidden transition-all duration-500",
        type === 'income' ? "bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-100" : 
        type === 'expense' ? "bg-rose-50/30 dark:bg-rose-500/5 border-rose-100" :
        "bg-indigo-50/30 dark:bg-[#6D5DF6]/5 border-[#6D5DF6]/20"
      )}>
        <div className="flex flex-col items-center gap-3 relative z-10">
          <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Amount</Label>
          <div className="flex items-center justify-center gap-2 w-full max-w-[320px]">
            <span className={cn(
              "text-2xl md:text-3xl font-black transition-colors duration-300 shrink-0",
              type === 'income' ? "text-emerald-500/60" : 
              type === 'expense' ? "text-rose-500/60" :
              "text-[#6D5DF6]/60"
            )}>{settings.currency}</span>
            <input
              ref={amountInputRef}
              type="number"
              placeholder="0"
              className={cn(
                "w-full bg-transparent text-center text-5xl md:text-6xl font-black outline-none border-none placeholder:text-slate-200 dark:placeholder:text-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none transition-all duration-300",
                type === 'income' ? "text-emerald-600 dark:text-emerald-400" : 
                type === 'expense' ? "text-rose-600 dark:text-rose-400" :
                "text-[#6D5DF6] dark:text-[#6D5DF6]/90"
              )}
              value={amount}
              onChange={(e) => {
                if (e.target.value.length <= 12) {
                   setAmount(e.target.value);
                }
              }}
            />
          </div>
        </div>

        {/* Quick Amount Chips - Elegant Row */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {quickAmounts.map((val) => (
            <motion.button
              key={val}
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => setAmount((Number(amount) + val).toString())}
              className={cn(
                "px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-tight transition-all duration-300 border shadow-sm",
                type === 'income' 
                  ? "bg-white dark:bg-slate-800 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 hover:bg-emerald-50" 
                  : type === 'expense'
                    ? "bg-white dark:bg-slate-800 border-rose-100 dark:border-rose-500/20 text-rose-600 hover:bg-rose-50"
                    : "bg-white dark:bg-slate-800 border-indigo-100 dark:border-[#6D5DF6]/20 text-[#6D5DF6] hover:bg-indigo-50"
              )}
            >
              +{settings.currency}{val.toLocaleString()}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setAmount("")}
            className="px-5 py-2.5 rounded-2xl text-[11px] font-black tracking-tight bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-transparent shadow-sm"
          >
            Clear
          </motion.button>
        </div>

        {/* Background Decorative Element */}
        <div className={cn(
          "absolute -right-10 -bottom-10 h-32 w-32 rounded-full blur-3xl opacity-20",
          type === 'income' ? "bg-emerald-500" : 
          type === 'expense' ? "bg-rose-500" :
          "bg-[#6D5DF6]"
        )} />
      </div>

      {/* Details Grid */}
      <div className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="fintech-card p-5 space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Calendar className="h-3 w-3 text-primary" /> Date</Label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-white/5 h-10 rounded-xl px-3 text-sm font-bold outline-none border-none" />
          </div>
          <div className="fintech-card p-5 space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5"><Paperclip className="h-3 w-3 text-primary" /> Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-10 border-none bg-slate-50 dark:bg-white/5 rounded-xl font-bold px-3"><SelectValue /></SelectTrigger>
              <SelectContent className="rounded-2xl">{categories.map(cat => <SelectItem key={cat} value={cat}>{t(cat as any)}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </div>

        {/* Payment Mode */}
        <div className="fintech-card p-5 space-y-3">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Method</Label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { id: 'Cash', icon: Banknote, color: 'text-emerald-500' },
              { id: 'UPI', icon: Smartphone, color: 'text-blue-500' },
              { id: 'Bank', icon: Landmark, color: 'text-indigo-500' },
              { id: 'Card', icon: CreditCard, color: 'text-purple-500' }
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setPaymentMode(mode.id as PaymentMode)}
                className={cn("flex flex-col items-center justify-center p-3 rounded-2xl gap-2 transition-all border", paymentMode === mode.id ? "bg-primary/5 border-primary shadow-sm" : "bg-slate-50 dark:bg-white/5 border-transparent opacity-60")}
              >
                <mode.icon className={cn("h-5 w-5", mode.color)} />
                <span className="text-[10px] font-bold">{mode.id}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Receipt Mockup */}
        <div className="fintech-card p-5">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-3">Receipt Upload</Label>
          <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-2xl cursor-pointer hover:bg-slate-100 transition-colors">
            <Camera className="w-8 h-8 mb-2 text-slate-400" />
            <p className="text-xs font-bold text-slate-500">{receipt ? receipt.name : "Tap to Scan Receipt"}</p>
            <input type="file" className="hidden" onChange={(e) => setReceipt(e.target.files?.[0] || null)} />
          </label>
        </div>

        {/* Customer & Notes */}
        <div className="grid gap-4">
           <div className={cn(
             "fintech-card p-5 space-y-2 transition-all duration-500",
              )}>
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-primary" />
                Party Name (Person Name)
              </Label>
              <Input 
                placeholder="e.g. Rahul Sharma" 
                className="h-12 border-none bg-slate-50 dark:bg-white/5 rounded-xl font-bold px-4 focus-visible:ring-1 focus-visible:ring-primary/20"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
              />
           </div>


           <div className="fintech-card p-5 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link to Customer Ledger (Optional)</Label>
              <Select value={customerId} onValueChange={(v) => {
                setCustomerId(v);
                if (v !== "none") {
                  const c = customers.find(cust => cust.id === v);
                  if (c) {
                    setCustomerName(c.name);
                  }
                }
              }}>
                <SelectTrigger className="h-12 border-none bg-slate-50 dark:bg-white/5 rounded-xl font-bold px-4"><SelectValue placeholder="Select Customer" /></SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="none">New Customer / None</SelectItem>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
           </div>
           
           <div className="fintech-card p-5 space-y-2">
              <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notes</Label>
              <textarea placeholder="Add some details..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 bg-slate-50 dark:bg-white/5 rounded-xl p-4 text-sm font-medium outline-none border-none resize-none" />
           </div>
        </div>
      </div>

      {/* Save Action Button */}
      <div className="pt-4 pb-12">
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            disabled={isSubmitting || !amount}
            className={cn(
              "w-full h-16 rounded-[2rem] text-xl font-black shadow-2xl transition-all duration-300",
              type === 'income' 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20" 
                : type === 'expense'
                  ? "bg-gradient-to-r from-rose-500 to-red-600 shadow-rose-500/20"
                  : "bg-gradient-to-r from-[#6D5DF6] to-indigo-600 shadow-[rgba(109,93,246,0.2)]",
              "disabled:opacity-40 disabled:grayscale"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Check className="h-6 w-6" strokeWidth={3} />
                <span>Save Entry</span>
              </div>
            )}
          </Button>
        </motion.div>
        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">
          Tap above to record this {type}
        </p>
      </div>
    </form>
  );
}
