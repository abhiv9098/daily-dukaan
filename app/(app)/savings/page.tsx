"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Target, TrendingUp, Calendar, ChevronRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SavingsPage() {
  const { savings, addSavingsGoal, updateSavingsProgress, settings } = useHisaabContext();
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: "", targetAmount: "", deadline: "" });

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Savings Goals</h2>
          <p className="text-sm text-muted-foreground">Dream big, save consistently</p>
        </div>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button className="rounded-2xl premium-gradient h-12 px-6">
              <Plus className="h-5 w-5 mr-2" />
              New Goal
            </Button>
          </DialogTrigger>
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
              <Button type="submit" className="w-full h-12 rounded-xl premium-gradient mt-2">
                Start Saving
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Stats Card */}
      <Card className="premium-gradient p-6 rounded-[2rem] border-none text-white overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-sm opacity-80 font-medium uppercase tracking-widest mb-1">Total Savings</p>
          <h3 className="text-4xl font-bold mb-4">{settings.currency} {savings.reduce((acc, s) => acc + s.currentAmount, 0)}</h3>
          <div className="flex items-center gap-2 text-sm bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
            <TrendingUp className="h-4 w-4" />
            <span>On track for {savings.length} goals</span>
          </div>
        </div>
        <Award className="absolute -right-4 -bottom-4 h-32 w-32 opacity-10 rotate-12" />
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Active Goals</h3>
        <AnimatePresence>
          {savings.length > 0 ? (
            savings.map((goal, index) => {
              const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card p-5 border-none">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Target className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="font-bold">{goal.title}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {goal.deadline ? `Target: ${format(new Date(goal.deadline), "MMM d, yyyy")}` : "No deadline"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{progress.toFixed(0)}%</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full premium-gradient rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-tight text-muted-foreground">
                        <span>{settings.currency} {goal.currentAmount} saved</span>
                        <span>Target: {settings.currency} {goal.targetAmount}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                       <Button 
                         variant="secondary" 
                         size="sm" 
                         className="flex-1 rounded-xl h-10 text-xs font-bold"
                         onClick={() => updateSavingsProgress(goal.id, 500)} // Quick add
                       >
                         + {settings.currency} 500
                       </Button>
                       <Button 
                         variant="secondary" 
                         size="sm" 
                         className="flex-1 rounded-xl h-10 text-xs font-bold"
                         onClick={() => updateSavingsProgress(goal.id, 1000)} // Quick add
                       >
                         + {settings.currency} 1000
                       </Button>
                       <Button 
                         size="sm" 
                         className="rounded-xl h-10 w-10 p-0 premium-gradient"
                       >
                         <ChevronRight className="h-4 w-4" />
                       </Button>
                    </div>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-16 bg-secondary/20 rounded-[2rem] border-2 border-dashed border-border/50">
              <Target className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No savings goals yet</p>
              <Button variant="link" onClick={() => setIsAddingGoal(true)} className="text-primary mt-2">
                Start your first goal
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
