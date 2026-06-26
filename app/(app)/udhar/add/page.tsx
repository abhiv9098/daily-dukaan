"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useHisaabContext } from "@/context/hisaab-context";
import { cn } from "@/lib/utils";

export default function UdharAddPage() {
  const router = useRouter();
  const { customers, addCustomer, addCreditTransaction, settings } = useHisaabContext();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [udharType, setUdharType] = useState<'give' | 'receive'>('give');
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
        type: udharType,
        description: note || (udharType === 'give' ? 'Lena Hai' : 'Dena Hai'),
        date: new Date().toISOString(),
      });

      // reset & redirect to home or khata page
      setName("");
      setPhone("");
      setAmount("");
      setNote("");
      router.push("/khata");
    } catch (error) {
      console.error("Failed to save udhar:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] md:min-h-0 bg-[#F8FAFC] dark:bg-background -mx-4 -mt-2 md:m-0 md:rounded-3xl overflow-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-4 h-16 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full h-10 w-10 hover:bg-slate-100 dark:hover:bg-white/10"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-lg font-bold tracking-tight">Add Udhar Entry</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
          <Card className="p-6 border border-slate-100 dark:border-white/5 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Customer Name</Label>
                <Input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="e.g. Ram Kumar" 
                  className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Mobile Number</Label>
                <Input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="9876543210" 
                  className="rounded-xl h-12 bg-slate-100/60 dark:bg-slate-800 border-none px-4 text-sm font-medium focus-visible:ring-2 focus-visible:ring-[#6D5DF6]/30"
                />
              </div>
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <Label className="text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider">Pichla Udhar (Opening Balance)</Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUdharType('give')}
                    className={cn(
                      "h-12 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-center",
                      udharType === 'give'
                        ? "bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 text-emerald-700 dark:text-emerald-400"
                        : "bg-slate-100/60 dark:bg-slate-800 border-slate-200/40 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    Lena Hai
                  </button>
                  <button
                    type="button"
                    onClick={() => setUdharType('receive')}
                    className={cn(
                      "h-12 rounded-2xl text-sm font-bold transition-all border-2 flex items-center justify-center",
                      udharType === 'receive'
                        ? "bg-rose-50 dark:bg-rose-500/20 border-rose-500 text-rose-700 dark:text-rose-455"
                        : "bg-slate-100/60 dark:bg-slate-800 border-slate-200/40 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    )}
                  >
                    Dena Hai
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Udhar Amount ({settings.currency})</Label>
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
                <Label className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">Note (Optional)</Label>
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
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
