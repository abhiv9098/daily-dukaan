"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateInput } from "@/components/ui/date-input";
import { useHisaabContext } from "@/context/hisaab-context";
import { getCategoriesForType, PAYMENT_MODES } from "@/lib/constants";
import { Category, PaymentMode, TransactionType } from "@/types";

export function TransactionForm() {
  const router = useRouter();
  const { addTransaction } = useHisaabContext();

  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Sales");
  const [description, setDescription] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [error, setError] = useState("");

  const categories = getCategoriesForType(type);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(getCategoriesForType(newType)[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(amount);
    if (!parsed || parsed <= 0) {
      setError("Enter a valid amount greater than zero.");
      return;
    }
    if (!description.trim()) {
      setError("Add a short description for this entry.");
      return;
    }

    addTransaction({
      amount: parsed,
      type,
      category,
      description: description.trim(),
      date: new Date(date).toISOString(),
      paymentMode,
      customerName: customerName.trim() || undefined,
    });

    router.push("/");
  };

  return (
    <Card className="mx-auto max-w-2xl border-white/20 bg-white/40 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-black/20">
      <CardHeader>
        <CardTitle>Add Entry</CardTitle>
        <CardDescription>
          Record a new income or expense for your dukaan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs
            value={type}
            onValueChange={(v) => handleTypeChange(v as TransactionType)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="income" className="gap-2">
                <ArrowUpRight className="h-4 w-4 text-green-600" />
                Income
              </TabsTrigger>
              <TabsTrigger value="expense" className="gap-2">
                <ArrowDownLeft className="h-4 w-4 text-red-600" />
                Expense
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="amount"
                type="number"
                min="1"
                step="1"
                placeholder="0"
                className="pl-9 text-lg font-semibold"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <Select
                value={paymentMode}
                onValueChange={(v) => setPaymentMode(v as PaymentMode)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_MODES.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="e.g. Morning cash sales, milk stock..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setError("");
              }}
            />
          </div>

          {type === "income" && (
            <div className="space-y-2">
              <Label htmlFor="customer">Customer name (optional)</Label>
              <Input
                id="customer"
                placeholder="Walk-in / customer name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>
          )}

          <div className="min-w-0 max-w-[9.5rem] space-y-2">
            <Label htmlFor="date">Date</Label>
            <DateInput
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm font-medium text-destructive">{error}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" className="flex-1 gap-2">
              Save Entry
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
