"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Target, TrendingUp, Award, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SavingsPage() {
  const { savings, addSavingsGoal, settings, stats } = useHisaabContext();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", targetAmount: "", deadline: "" });

  const totalSaved = savings.reduce((acc, s) => acc + s.currentAmount, 0);


  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.title || !newGoal.targetAmount) return;
    addSavingsGoal({
      title: newGoal.title,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
    });
    setNewGoal({ title: "", targetAmount: "", deadline: "" });
    setIsAddingGoal(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Stats Overview */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Savings Hub</h2>
            <p className="text-slate-500 font-medium text-sm">Har rupiya bachana ek shuruat hai.</p>
          </div>
          <Button onClick={() => setIsAddingGoal(true)} className="rounded-2xl purple-gradient h-12 px-6 shadow-lg shadow-purple-500/20">
            <Plus className="h-5 w-5 mr-2" /> New Goal
          </Button>
        </div>

        {/* Savings Multi-Timeline Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 px-1">
          {[
            { label: "Today", val: stats.todayIncome - stats.todayExpense, color: "text-emerald-500" },
            { label: "Weekly", val: 4500, color: "text-blue-500" },
            { label: "Monthly", val: stats.monthlyIncome - stats.monthlyExpense, color: "text-indigo-500" },
            { label: "Yearly", val: 125000, color: "text-purple-500" }
          ].map((s) => (
            <div key={s.label} className="fintech-card p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{s.label}</span>
              <p className={cn("text-lg font-black tracking-tight", s.color)}>{settings.currency}{s.val.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Savings Card */}
      <section className="px-1">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="premium-gradient p-8 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <Award className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Global Savings Account</span>
            </div>
            <h3 className="text-5xl font-black tracking-tighter mb-6">{settings.currency} {totalSaved.toLocaleString()}</h3>
            <div className="flex items-center gap-3">
               <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-white/20">
                 {savings.length} Active Goals
               </div>
               <div className="bg-emerald-400/20 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold border border-emerald-400/20 text-emerald-300">
                 +12% vs Last Month
               </div>
            </div>
          </div>
          <Target className="absolute -right-6 -bottom-6 h-48 w-48 opacity-10 rotate-12" />
        </motion.div>
      </section>

      {/* Active Goals Section */}
      <section className="space-y-4 px-1">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">My Goals</h3>
        <div className="grid gap-4">
          {savings.length > 0 ? (
            savings.map((goal, index) => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <motion.div key={goal.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="fintech-card p-6 border-none group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-100">
                          <Target className="h-8 w-8" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-slate-900 dark:text-white">{goal.title}</h4>
                          <p className="text-xs text-slate-500 font-medium">Target: {settings.currency}{goal.targetAmount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black">{progress.toFixed(0)}%</div>
                    </div>

                    <div className="space-y-3">
                      <div className="h-3 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200/50">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full purple-gradient rounded-full" />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <span>{settings.currency}{goal.currentAmount.toLocaleString()} Saved</span>
                        <span>{settings.currency}{(goal.targetAmount - goal.currentAmount).toLocaleString()} Left</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 fintech-card border-dashed">
              <Target className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No active goals found</p>
            </div>
          )}
        </div>
      </section>

      {/* Achievement Badges (Mocked) */}
      <section className="space-y-4 px-1">
        <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { label: "Saver", icon: Award, color: "text-amber-500", bg: "bg-amber-50" },
            { label: "Pro", icon: Sparkles, color: "text-purple-500", bg: "bg-purple-50" },
            { label: "Elite", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
            { label: "Guru", icon: Target, color: "text-blue-500", bg: "bg-blue-50" }
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2 shrink-0">
               <div className={cn("h-16 w-16 rounded-full flex items-center justify-center shadow-sm border border-white", b.bg)}>
                 <b.icon className={cn("h-8 w-8", b.color)} />
               </div>
               <span className="text-[10px] font-bold text-slate-600 uppercase">{b.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Savings Insights */}
      <section className="px-1">
        <div className="fintech-card p-6 bg-slate-900 dark:bg-slate-900 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <h4 className="text-lg font-bold">Savings Insights 💡</h4>
            <ul className="space-y-3">
              <li className="flex gap-3 text-sm text-slate-300 font-medium leading-relaxed">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                You saved 15% more this week compared to last week. Good job!
              </li>
              <li className="flex gap-3 text-sm text-slate-300 font-medium leading-relaxed">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0 mt-1.5" />
                Setting a daily budget could increase your monthly savings by {settings.currency}2,000.
              </li>
            </ul>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
        </div>
      </section>

      {/* Add Goal Dialog is already handled in the header section above by setIsAddingGoal */}
      <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
        <DialogContent className="glass-card border-none max-w-sm rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Create Savings Goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddGoal} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>What are you saving for?</Label>
              <Input 
                placeholder="e.g. New iPhone, Shop Expansion" 
                className="rounded-xl h-12 bg-secondary/50 border-none"
                value={newGoal.title}
                onChange={e => setNewGoal({...newGoal, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Target Amount ({settings.currency})</Label>
              <Input 
                type="number"
                placeholder="e.g. 50000" 
                className="rounded-xl h-12 bg-secondary/50 border-none"
                value={newGoal.targetAmount}
                onChange={e => setNewGoal({...newGoal, targetAmount: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Deadline (Optional)</Label>
              <Input 
                type="date"
                className="rounded-xl h-12 bg-secondary/50 border-none"
                value={newGoal.deadline}
                onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full h-12 rounded-xl purple-gradient mt-2">
              Start Saving
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
