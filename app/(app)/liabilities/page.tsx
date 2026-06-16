"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  TrendingDown, 
  Users, 
  Plus, 
  Trash2, 
  User as UserIcon, 
  Calendar, 
  FileText,
  ChevronLeft,
  Camera,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { formatCurrency, formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LiabilitiesPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { stats, settings, losses, borrowings, addLoss, deleteLoss, addBorrowing, deleteBorrowing, updateBorrowing } = useHisaabContext();
  
  const [isAddingLoss, setIsAddingLoss] = useState(false);
  const [isAddingBorrowing, setIsAddingBorrowing] = useState(false);
  
  const [lossForm, setLossForm] = useState({ amount: "", description: "", date: new Date().toISOString().split('T')[0] });
  const [borrowForm, setBorrowForm] = useState({ personName: "", amount: "", date: new Date().toISOString().split('T')[0], notes: "", personPhoto: "" });

  const handleAddLoss = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lossForm.amount || !lossForm.description) return;
    addLoss({
      amount: Number(lossForm.amount),
      description: lossForm.description,
      date: new Date(lossForm.date).toISOString(),
    });
    setLossForm({ amount: "", description: "", date: new Date().toISOString().split('T')[0] });
    setIsAddingLoss(false);
  };

  const handleAddBorrowing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowForm.personName || !borrowForm.amount) return;
    addBorrowing({
      personName: borrowForm.personName,
      amount: Number(borrowForm.amount),
      date: new Date(borrowForm.date).toISOString(),
      notes: borrowForm.notes,
      personPhoto: borrowForm.personPhoto,
    });
    setBorrowForm({ personName: "", amount: "", date: new Date().toISOString().split('T')[0], notes: "", personPhoto: "" });
    setIsAddingBorrowing(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBorrowForm(prev => ({ ...prev, personPhoto: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] dark:bg-background -mx-4 -mt-2 md:m-0 md:rounded-3xl overflow-hidden pb-20">
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
        <h1 className="text-lg font-bold tracking-tight">Loss & Borrowings</h1>
        <div className="w-10" />
      </header>

      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 max-w-4xl mx-auto w-full">
        {/* Summary Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <TrendingDown className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Loss</p>
                <p className="text-2xl font-black text-rose-500">{formatCurrency(stats.totalLoss, settings.currency)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[2rem] bg-white dark:bg-white/5 border-none shadow-xl shadow-slate-200/50 dark:shadow-none">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Borrowed</p>
                <p className="text-2xl font-black text-indigo-500">{formatCurrency(stats.totalBorrowed, settings.currency)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 rounded-[2.5rem] premium-gradient border-none shadow-2xl shadow-primary/20 text-white">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">Total Liability</p>
                <p className="text-2xl font-black">{formatCurrency(stats.totalOutstandingLiability, settings.currency)}</p>
              </div>
            </div>
          </Card>
        </section>

        <Tabs defaultValue="losses" className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-14 bg-slate-100 dark:bg-white/5 rounded-2xl p-1 mb-8 shadow-inner">
            <TabsTrigger value="losses" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md font-bold transition-all">
              Business Losses
            </TabsTrigger>
            <TabsTrigger value="borrowings" className="rounded-xl data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-md font-bold transition-all">
              Borrowed Money
            </TabsTrigger>
          </TabsList>

          <TabsContent value="losses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Loss Records</h2>
              <Dialog open={isAddingLoss} onOpenChange={setIsAddingLoss}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full font-bold premium-gradient h-10 px-5 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" /> Add Loss
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-none glass-card max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Record New Loss</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddLoss} className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-bold"
                        value={lossForm.amount}
                        onChange={e => setLossForm({...lossForm, amount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input 
                        placeholder="e.g. Damage stock, Theft" 
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-semibold"
                        value={lossForm.description}
                        onChange={e => setLossForm({...lossForm, description: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date"
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-semibold"
                        value={lossForm.date}
                        onChange={e => setLossForm({...lossForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl premium-gradient font-bold mt-2">
                      Record Loss
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {losses.length > 0 ? (
                  losses.map((loss, index) => (
                    <motion.div
                      key={loss.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-4 rounded-3xl bg-white dark:bg-white/5 border-none shadow-sm flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <TrendingDown className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{loss.description}</p>
                            <p className="text-xs text-slate-400">{formatDate(loss.date)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="text-lg font-black text-rose-500">-{formatCurrency(loss.amount, settings.currency)}</p>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteLoss(loss.id)}
                            className="h-8 w-8 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 bg-white/50 dark:bg-white/5 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                    <TrendingDown className="h-12 w-12 text-slate-200 dark:text-white/10 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium text-sm">No losses recorded yet</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="borrowings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Creditors List</h2>
              <Dialog open={isAddingBorrowing} onOpenChange={setIsAddingBorrowing}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full font-bold premium-gradient h-10 px-5 shadow-lg shadow-primary/20">
                    <Plus className="h-4 w-4 mr-2" /> Add Borrowing
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[2.5rem] border-none glass-card max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Add New Borrowing</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddBorrowing} className="space-y-4 pt-4">
                    <div className="flex justify-center mb-4">
                      <div className="relative group">
                        <div className="h-24 w-24 rounded-[2rem] bg-slate-100 dark:bg-white/10 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 group-hover:border-primary transition-colors">
                          {borrowForm.personPhoto ? (
                            <img src={borrowForm.personPhoto} className="h-full w-full object-cover" alt="preview" />
                          ) : (
                            <Camera className="h-8 w-8 text-slate-300" />
                          )}
                        </div>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Person Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-bold"
                        value={borrowForm.personName}
                        onChange={e => setBorrowForm({...borrowForm, personName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-bold"
                        value={borrowForm.amount}
                        onChange={e => setBorrowForm({...borrowForm, amount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input 
                        type="date"
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-semibold"
                        value={borrowForm.date}
                        onChange={e => setBorrowForm({...borrowForm, date: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (Optional)</Label>
                      <Input 
                        placeholder="Any details..." 
                        className="rounded-xl h-12 bg-slate-100 dark:bg-white/5 border-none font-medium"
                        value={borrowForm.notes}
                        onChange={e => setBorrowForm({...borrowForm, notes: e.target.value})}
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl premium-gradient font-bold mt-2">
                      Save Record
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {borrowings.length > 0 ? (
                  borrowings.map((borrow, index) => (
                    <motion.div
                      key={borrow.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="p-5 rounded-[2rem] bg-white dark:bg-white/5 border-none shadow-xl shadow-slate-200/50 dark:shadow-none space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-500 overflow-hidden border border-indigo-100 dark:border-indigo-500/20">
                              {borrow.personPhoto ? (
                                <img src={borrow.personPhoto} className="h-full w-full object-cover" alt={borrow.personName} />
                              ) : (
                                <UserIcon className="h-7 w-7" />
                              )}
                            </div>
                            <div>
                              <p className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight">{borrow.personName}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Calendar className="h-3 w-3 text-slate-400" />
                                <span className="text-xs text-slate-400 font-bold uppercase tracking-tighter">Taken on {formatDate(borrow.date)}</span>
                              </div>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteBorrowing(borrow.id)}
                            className="h-10 w-10 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 py-2">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Initial Amount</p>
                            <p className="font-bold text-slate-600 dark:text-slate-300">{formatCurrency(borrow.amount, settings.currency)}</p>
                          </div>
                          <div className="space-y-1 text-right">
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Outstanding</p>
                            <p className="text-xl font-black text-rose-500">{formatCurrency(borrow.remainingBalance, settings.currency)}</p>
                          </div>
                        </div>

                        {borrow.notes && (
                          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                            <div className="flex items-start gap-2">
                              <FileText className="h-4 w-4 text-indigo-400 mt-0.5" />
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 italic leading-relaxed">&quot;{borrow.notes}&quot;</p>
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                           <Button 
                             className="w-full h-12 rounded-2xl bg-slate-900 dark:bg-white/10 text-white font-bold text-sm shadow-lg shadow-slate-900/10 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
                             onClick={() => {
                               const pay = prompt("How much would you like to repay?");
                               if (pay && !isNaN(Number(pay))) {
                                 const amount = Number(pay);
                                 updateBorrowing(borrow.id, { remainingBalance: Math.max(0, borrow.remainingBalance - amount) });
                               }
                             }}
                           >
                             Record Repayment
                             <ArrowRight className="h-4 w-4" />
                           </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-16 bg-white/50 dark:bg-white/5 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-white/10">
                    <Users className="h-14 w-14 text-slate-200 dark:text-white/10 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium text-sm">No borrowings recorded</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
