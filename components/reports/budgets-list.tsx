"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Wallet, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Category } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export function BudgetsList() {
  const { budgets, addBudget, deleteBudget, settings, transactions } = useHisaabContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newBudget, setNewBudget] = useState<{ category: Category | "All", amount: string }>({ 
    category: "All", 
    amount: "" 
  });

  const categories: (Category | "All")[] = ["All", "Stock", "Transport", "Food", "Electricity", "Rent", "Salary", "Personal", "Other", "Sales"];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudget.amount) return;
    addBudget({
      category: newBudget.category,
      amount: Number(newBudget.amount),
      month: format(new Date(), "yyyy-MM"),
    });
    setNewBudget({ category: "All", amount: "" });
    setIsAdding(false);
  };

  const getSpent = (category: Category | "All") => {
    const now = new Date();
    return transactions
      .filter(t => {
        const isMonth = format(new Date(t.date), "yyyy-MM") === format(now, "yyyy-MM");
        const isExpense = t.type === "expense";
        const isCategory = category === "All" ? true : t.category === category;
        return isMonth && isExpense && isCategory;
      })
      .reduce((acc, t) => acc + t.amount, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Monthly Budgets</h3>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 rounded-full text-primary hover:text-primary hover:bg-primary/10 font-bold">
              <Plus className="h-4 w-4 mr-1" />
              Add Budget
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-none max-w-sm rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Set Monthly Budget</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={newBudget.category} 
                  onValueChange={(v: Category | "All") => setNewBudget({...newBudget, category: v})}
                >
                  <SelectTrigger className="rounded-xl h-12 bg-secondary/50 border-none">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-none shadow-xl">
                    {categories.map(c => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Budget Amount ({settings.currency})</Label>
                <Input 
                  type="number"
                  placeholder="e.g. 10000" 
                  className="rounded-xl h-12 bg-secondary/50 border-none"
                  value={newBudget.amount}
                  onChange={e => setNewBudget({...newBudget, amount: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl premium-gradient mt-2">
                Set Budget
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <AnimatePresence>
        {budgets.length > 0 ? (
          budgets.map((budget, index) => {
            const spent = getSpent(budget.category);
            const progress = Math.min((spent / budget.amount) * 100, 100);
            const isOver = spent > budget.amount;

            return (
              <motion.div
                key={budget.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card p-4 border-none relative overflow-hidden group">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "h-8 w-8 rounded-lg flex items-center justify-center",
                        isOver ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-500"
                      )}>
                        <Wallet className="h-4 w-4" />
                      </div>
                      <span className="font-bold">{budget.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground">
                        {settings.currency} {spent} / {budget.amount}
                      </span>
                      {isOver ? (
                        <AlertCircle className="h-4 w-4 text-rose-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        isOver ? "bg-rose-500" : "bg-emerald-500"
                      )}
                    />
                  </div>
                  
                  {isOver && (
                    <p className="text-[10px] text-rose-500 font-bold mt-2 uppercase tracking-tighter">
                      Budget Exceeded by {settings.currency} {spent - budget.amount}
                    </p>
                  )}
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10 bg-secondary/20 rounded-[1.5rem] border-2 border-dashed border-border/50">
             <p className="text-xs text-muted-foreground font-medium">No budgets set for this month</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
