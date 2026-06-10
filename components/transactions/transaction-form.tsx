"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Check, ChevronDown, User, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { getCategoriesForType, PAYMENT_MODES, CATEGORY_DETAILS, PAYMENT_MODE_DETAILS } from "@/lib/constants";
import { Category, PaymentMode, TransactionType } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function TransactionForm() {
  const router = useRouter();
  const { addTransaction, customers, settings } = useHisaabContext();
  const { t } = useLanguage();
  const amountInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Sales");
  const [description, setDescription] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [customerId, setCustomerId] = useState<string>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = getCategoriesForType(type);

  useEffect(() => {
    // Focus amount input on mount
    amountInputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    setIsSubmitting(true);
    
    // Simulate slight delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 600));

    addTransaction({
      amount: parsed,
      type,
      category,
      description: description.trim() || "Entry",
      date: new Date().toISOString(),
      paymentMode,
      customerId: customerId === "none" ? undefined : customerId,
    });

    router.push("/");
  };

  const quickAmounts = [100, 500, 1000, 5000];

  const handleQuickAmount = (val: number) => {
    setAmount((prev) => {
      const current = Number(prev) || 0;
      return (current + val).toString();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shortcut to Loss & Borrowings */}
      <div className="flex justify-center -mt-2 mb-4">
        <Button variant="outline" asChild className="rounded-full h-9 px-4 text-xs font-bold border-rose-200/60 dark:border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:text-rose-600 transition-all border-dashed shadow-sm">
          <Link href="/liabilities">
            <AlertTriangle className="h-3.5 w-3.5 mr-2" />
            Record Loss or Borrowing
          </Link>
        </Button>
      </div>

      {/* Type Toggle - Modern Segmented Control */}
      <div className="relative flex bg-slate-100 dark:bg-white/5 p-1 rounded-2xl h-14 w-full max-w-sm mx-auto shadow-inner border border-slate-200/50 dark:border-white/5">
        <div className="relative flex w-full">
          <AnimatePresence initial={false}>
            <motion.div
              key={type}
              layoutId="active-type"
              className={cn(
                "absolute inset-0 w-1/2 rounded-xl shadow-md",
                type === "income" ? "bg-emerald-500 left-0" : "bg-rose-500 left-1/2"
              )}
              transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
            />
          </AnimatePresence>
          
          <button
            type="button"
            onClick={() => { setType("income"); setCategory("Sales"); }}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors duration-300",
              type === 'income' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <ArrowUpRight className={cn("h-4 w-4", type === 'income' ? 'text-white' : 'text-emerald-500')} />
            {t("income")}
          </button>
          
          <button
            type="button"
            onClick={() => { setType("expense"); setCategory("Stock"); }}
            className={cn(
              "relative z-10 flex-1 flex items-center justify-center gap-2 text-sm font-bold transition-colors duration-300",
              type === 'expense' ? 'text-white' : 'text-slate-500 dark:text-slate-400'
            )}
          >
            <ArrowDownLeft className={cn("h-4 w-4", type === 'expense' ? 'text-white' : 'text-rose-500')} />
            {t("expense")}
          </button>
        </div>
      </div>

      {/* Main Amount Focus Section */}
      <div className="space-y-4">
        <div className={cn(
          "relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 transition-all duration-300",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:scale-[1.02]"
        )}>
          <div className="flex flex-col items-center gap-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Enter Amount</Label>
            <div className="flex items-center justify-center w-full">
              <span className="text-3xl font-bold text-slate-400 mr-2">{settings.currency}</span>
              <input
                ref={amountInputRef}
                type="number"
                placeholder="0"
                className="w-full bg-transparent text-center text-5xl font-black outline-none border-none placeholder:text-slate-200 dark:placeholder:text-white/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Amount Chips */}
        <div className="flex flex-wrap justify-center gap-2">
          {quickAmounts.map((val) => (
            <motion.button
              key={val}
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => handleQuickAmount(val)}
              className="px-4 py-2 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors shadow-sm"
            >
              +{settings.currency}{val}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => setAmount("")}
            className="px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 text-sm font-bold text-rose-500 transition-colors shadow-sm"
          >
            Clear
          </motion.button>
        </div>
      </div>

      {/* Form Details Cards */}
      <div className="grid gap-4">
        {/* Category & Payment Mode */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Category
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-10 border-none bg-slate-50 dark:bg-white/5 rounded-xl font-bold px-3">
                <div className="flex items-center gap-2">
                  {category && CATEGORY_DETAILS[category] && (
                    <div className={cn("p-1.5 rounded-lg", CATEGORY_DETAILS[category].bgColor)}>
                      {(() => {
                        const Icon = CATEGORY_DETAILS[category].icon;
                        return <Icon className="h-3.5 w-3.5" style={{ color: CATEGORY_DETAILS[category].color }} />;
                      })()}
                    </div>
                  )}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                {categories.map((cat) => {
                  const details = CATEGORY_DETAILS[cat];
                  const Icon = details?.icon || Check;
                  return (
                    <SelectItem key={cat} value={cat} className="rounded-xl my-0.5">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg", details?.bgColor)}>
                          <Icon className="h-4 w-4" style={{ color: details?.color }} />
                        </div>
                        <span className="font-semibold">{t(cat as any)}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-2">
            <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-primary" />
              Mode
            </Label>
            <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)}>
              <SelectTrigger className="h-10 border-none bg-slate-50 dark:bg-white/5 rounded-xl font-bold px-3">
                <div className="flex items-center gap-2">
                  {(() => {
                    const Icon = PAYMENT_MODE_DETAILS[paymentMode].icon;
                    return <Icon className="h-3.5 w-3.5" style={{ color: PAYMENT_MODE_DETAILS[paymentMode].color }} />;
                  })()}
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
                {PAYMENT_MODES.map((mode) => {
                  const details = PAYMENT_MODE_DETAILS[mode];
                  const Icon = details.icon;
                  return (
                    <SelectItem key={mode} value={mode} className="rounded-xl my-0.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/10">
                          <Icon className="h-4 w-4" style={{ color: details.color }} />
                        </div>
                        <span className="font-semibold">{mode}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Customer Selector */}
        <div className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Customer (Optional)
          </Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="h-12 border-none bg-slate-50 dark:bg-white/5 rounded-2xl font-bold px-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <SelectValue placeholder="Select Customer" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl p-1">
              <SelectItem value="none" className="rounded-xl my-0.5 font-semibold">No Customer</SelectItem>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id} className="rounded-xl my-0.5 font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-[10px]">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    {c.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div className="bg-white dark:bg-white/5 p-4 rounded-3xl border border-slate-100 dark:border-white/5 shadow-sm space-y-2">
          <Label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-primary" />
            Notes
          </Label>
          <textarea
            placeholder="Add some details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-[80px] bg-slate-50 dark:bg-white/5 rounded-2xl p-4 text-sm font-semibold outline-none border-none resize-none focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-slate-300 dark:placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Fixed Bottom Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:relative md:p-0 bg-white/80 dark:bg-black/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t border-slate-100 dark:border-white/5 md:border-none z-50">
        <motion.div
          whileTap={{ scale: 0.98 }}
          className="max-w-2xl mx-auto"
        >
          <Button 
            type="submit" 
            disabled={isSubmitting || !amount}
            className={cn(
              "w-full h-16 rounded-2xl text-lg font-black shadow-2xl transition-all duration-300",
              type === 'income' 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/20" 
                : "bg-gradient-to-r from-purple-600 to-blue-600 shadow-primary/20",
              "disabled:opacity-50 disabled:grayscale"
            )}
          >
            {isSubmitting ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Check className="h-6 w-6" />
                <span>Save {type === 'income' ? 'Income' : 'Expense'}</span>
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </form>
  );
}


