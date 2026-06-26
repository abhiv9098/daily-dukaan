"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useHisaabContext } from "@/context/hisaab-context";
import { formatCurrency } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function UdharPage() {
  const { customers, creditTransactions, addCustomer, addCreditTransaction, settings } = useHisaabContext();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const totals = useMemo(() => {
    const totalGiven = (creditTransactions || []).filter(ct => ct.type === 'give').reduce((s, c) => s + (c.amount || 0), 0);
    const totalReceived = (creditTransactions || []).filter(ct => ct.type === 'receive').reduce((s, c) => s + (c.amount || 0), 0);
    const pending = Math.max(0, totalGiven - totalReceived);
    return { totalGiven, totalReceived, pending };
  }, [creditTransactions]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;
    setIsSaving(true);
    try {
      // try match existing customer by phone or name
      let customer = customers.find(c => (phone && c.phone === phone) || c.name.toLowerCase() === name.toLowerCase());
      let customerId = customer?.id;
      if (!customerId) {
        customerId = await addCustomer({ name: name.trim(), phone: phone.trim() });
      }

      await addCreditTransaction({
        customerId: customerId as string,
        amount: Number(amount),
        type: 'give',
        description: note || 'Udhar entry',
        date: new Date(date).toISOString(),
      });

      // reset
      setName("");
      setPhone("");
      setAmount("");
      setNote("");
      setDate(new Date().toISOString().slice(0,10));
      setShowForm(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePayment = async (customerId: string) => {
    const value = window.prompt("Enter amount received:");
    if (!value) return;
    const num = Number(value);
    if (Number.isNaN(num) || num <= 0) return;

    await addCreditTransaction({
      customerId,
      amount: num,
      type: 'receive',
      description: 'Payment Mila',
      date: new Date().toISOString(),
    });
  };

  const sortedCustomers = [...(customers || [])].sort((a,b) => (b.totalCredit || 0) - (a.totalCredit || 0));

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-background space-y-4 pb-8">
      {/* Header */}
      <header className="flex items-center justify-between px-1 pt-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Udhar Khata</h1>
          <p className="text-xs text-slate-400 dark:text-slate-550 font-semibold uppercase tracking-wider mt-0.5">Manage your collections</p>
        </div>
        <div>
          <Button 
            onClick={() => setShowForm(v => !v)} 
            className="inline-flex items-center gap-1.5 rounded-2xl bg-[#6D5DF6] hover:bg-[#6D5DF6]/90 text-white px-5 h-11 text-xs font-bold transition-all shadow-[0_4px_14px_rgba(109,93,246,0.2)] focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} /> Add Udhar
          </Button>
        </div>
      </header>

      {showForm && (
        <Card className="p-6 border border-slate-100 dark:border-white/5 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm animate-in fade-in slide-in-from-top-3 duration-200">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Customer Name</label>
              <Input 
                value={name} 
                onChange={e => setName(e.target.value)} 
                placeholder="e.g. Ram Kumar" 
                className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Mobile Number</label>
              <Input 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                placeholder="9876543210" 
                className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Udhar Amount ({settings.currency})</label>
              <Input 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                type="number" 
                placeholder="0" 
                className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Note (Optional)</label>
              <Input 
                value={note} 
                onChange={e => setNote(e.target.value)} 
                placeholder="e.g. For raw materials" 
                className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
              />
            </div>
            <div className="flex gap-2.5 pt-2">
              <Button 
                type="submit" 
                className="rounded-xl bg-[#6D5DF6] hover:bg-[#6D5DF6]/95 text-white font-bold px-6 h-12 text-sm transition-all focus:outline-none focus-visible:ring-0 shadow-lg shadow-indigo-500/10" 
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Udhar'}
              </Button>
              <Button 
                type="button" 
                variant="secondary" 
                className="rounded-xl font-bold h-12 px-6" 
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Premium Stats Header Card */}
      <section>
        <div className="relative overflow-hidden bg-gradient-to-tr from-[#6D5DF6]/10 to-[#818cf8]/5 dark:from-[#6D5DF6]/20 dark:to-slate-900 border border-indigo-100/40 dark:border-white/5 rounded-[24px] shadow-[0_8px_32px_rgba(109,93,246,0.04)] p-6 space-y-5">
          {/* Decorative background glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[11px] font-bold text-indigo-650/70 dark:text-indigo-400 uppercase tracking-widest block mb-1">Pending Collections</h2>
                <h1 className="text-4xl font-extrabold tracking-tight text-[#6D5DF6]">{formatCurrency(totals.pending, settings.currency)}</h1>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>TOTAL GIVEN</span>
                </div>
                <p className="text-lg font-black text-slate-800 dark:text-white">{formatCurrency(totals.totalGiven, settings.currency)}</p>
              </div>
              <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-100 dark:border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span>RECEIVED</span>
                </div>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totals.totalReceived, settings.currency)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customers List Section */}
      <section className="space-y-4 px-0.5">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">Customers List</h2>
        
        <div className="space-y-3.5">
          {sortedCustomers.length ? sortedCustomers.map(c => (
            <div key={c.id} className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100/70 dark:border-white/5 p-5 flex items-center justify-between shadow-[0_4px_16px_rgba(0,0,0,0.01)] hover:shadow-md transition duration-300">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="h-11 w-11 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-white/5 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm rounded-full shrink-0">
                  {c.name[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white truncate">{c.name}</div>
                  <div className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-1">
                    {c.phone || 'No Mobile'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3.5 shrink-0">
                <div className="text-right">
                  <div className={`text-sm font-black tracking-tight ${c.totalCredit > 0 ? 'text-emerald-600 dark:text-emerald-450' : c.totalCredit < 0 ? 'text-rose-600 dark:text-rose-455' : 'text-slate-500'}`}>
                    {formatCurrency(Math.abs(c.totalCredit), settings.currency)}
                  </div>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mt-1">
                    {c.totalCredit > 0 ? 'Lena' : c.totalCredit < 0 ? 'Dena' : 'Settled'}
                  </span>
                </div>
                
                <Button 
                  onClick={() => handlePayment(c.id)}
                  className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-100/80 border border-emerald-100/30 text-[10px] font-black h-9 px-3.5 transition focus:outline-none focus-visible:ring-0"
                >
                  Mila
                </Button>
              </div>
            </div>
          )) : (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 p-8 text-center shadow-sm">
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">No customers ledger recorded yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
