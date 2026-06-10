"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { getCategoriesForType, PAYMENT_MODES } from "@/lib/constants";
import { Category, PaymentMode, TransactionType } from "@/types";

export function TransactionForm() {
  const router = useRouter();
  const { addTransaction } = useHisaabContext();
  const { t } = useLanguage();

  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Sales");
  const [description, setDescription] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");

  const categories = getCategoriesForType(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) return;

    addTransaction({
      amount: parsed,
      type,
      category,
      description: description.trim() || "Entry",
      date: new Date().toISOString(),
      paymentMode,
    });

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4 md:space-y-6">
      {/* Type Toggle */}
      <div className="flex bg-card border border-border p-1 rounded-full shadow-sm">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-full text-sm font-bold transition-all ${type === 'income' ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'text-muted-foreground'}`}
        >
          <ArrowUpRight className="h-4 w-4" /> {t("income")}
        </button>
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`flex-1 flex items-center justify-center gap-2 h-10 md:h-12 rounded-full text-sm font-bold transition-all ${type === 'expense' ? 'bg-red-500/15 text-red-700 dark:text-red-400' : 'text-muted-foreground'}`}
        >
          <ArrowDownLeft className="h-4 w-4" /> {t("expense")}
        </button>
      </div>

      <div className="space-y-4 bg-card border border-border p-5 rounded-[24px] shadow-sm">
        <div className="space-y-2">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("amount")}</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₹</span>
            <Input
              type="number"
              min="1"
              step="1"
              placeholder="0"
              className="h-16 pl-10 text-3xl font-bold rounded-2xl border-none bg-secondary/50 focus-visible:ring-primary shadow-none"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("category")}</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-none font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{t(cat as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Mode</Label>
            <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)}>
              <SelectTrigger className="h-12 rounded-xl bg-secondary/50 border-none font-semibold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {PAYMENT_MODES.map((mode) => (
                  <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5 pt-1">
          <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Note (Optional)</Label>
          <Input
            placeholder="e.g. Morning cash sales..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-12 rounded-xl border-none bg-secondary/50 shadow-none font-medium"
          />
        </div>
      </div>

      <Button type="submit" className="w-full h-14 rounded-full text-base font-bold shadow-md bg-primary hover:bg-primary/90 text-primary-foreground">
        {t("save")} Entry
      </Button>
    </form>
  );
}
