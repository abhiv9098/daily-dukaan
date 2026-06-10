"use client";

import React, { useState } from "react";
import { useHisaabContext } from "@/context/hisaab-context";
import { Plus, Search, Users, Phone, ArrowUpRight, ArrowDownLeft, ChevronRight, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function KhataPage() {
  const { customers, addCustomer, addCreditTransaction, settings } = useHisaabContext();
  const [search, setSearch] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone?.includes(search)
  );

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name) return;
    addCustomer(newCustomer);
    setNewCustomer({ name: "", phone: "" });
    setIsAddingCustomer(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Customer Ledger</h2>
            <p className="text-sm text-muted-foreground">Manage your credits and payments</p>
          </div>
          <Dialog open={isAddingCustomer} onOpenChange={setIsAddingCustomer}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl premium-gradient h-12 px-6">
                <UserPlus className="h-5 w-5 mr-2" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-none max-w-sm rounded-[2rem]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCustomer} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input 
                    placeholder="e.g. Rahul Sharma" 
                    className="rounded-xl h-12 bg-secondary/50 border-none"
                    value={newCustomer.name}
                    onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number (Optional)</Label>
                  <Input 
                    placeholder="e.g. 9876543210" 
                    className="rounded-xl h-12 bg-secondary/50 border-none"
                    value={newCustomer.phone}
                    onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  />
                </div>
                <Button type="submit" className="w-full h-12 rounded-xl premium-gradient mt-2">
                  Save Customer
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input 
            placeholder="Search by name or phone..." 
            className="pl-12 h-14 bg-card border-none rounded-2xl shadow-sm focus-visible:ring-primary/20"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass-card p-4 border-none">
          <div className="flex items-center gap-2 text-emerald-500 mb-1">
             <ArrowDownLeft className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider">You'll Receive</span>
          </div>
          <p className="text-2xl font-bold">{settings.currency} {customers.reduce((acc, c) => acc + (c.totalCredit > 0 ? c.totalCredit : 0), 0)}</p>
        </Card>
        <Card className="glass-card p-4 border-none">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
             <ArrowUpRight className="h-4 w-4" />
             <span className="text-[10px] font-bold uppercase tracking-wider">You'll Give</span>
          </div>
          <p className="text-2xl font-bold">{settings.currency} {Math.abs(customers.reduce((acc, c) => acc + (c.totalCredit < 0 ? c.totalCredit : 0), 0))}</p>
        </Card>
      </div>

      {/* Customer List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Customers</h3>
        <AnimatePresence>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card p-4 border-none hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold truncate group-hover:text-primary transition-colors">{customer.name}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone || "No phone"}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-bold text-lg",
                        customer.totalCredit > 0 ? "text-emerald-500" : customer.totalCredit < 0 ? "text-rose-500" : "text-muted-foreground"
                      )}>
                        {settings.currency} {Math.abs(customer.totalCredit)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                        {customer.totalCredit > 0 ? "Receivable" : customer.totalCredit < 0 ? "Payable" : "Settled"}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-secondary/20 rounded-[2rem] border-2 border-dashed border-border/50">
              <Users className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No customers found</p>
              <Button variant="link" onClick={() => setIsAddingCustomer(true)} className="text-primary mt-2">
                Add your first customer
              </Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
