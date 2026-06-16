"use client";

import { useState, useRef } from "react";
import { 
  User, 
  Globe, 
  Moon, 
  LogOut, 
  CloudDownload, 
  Trash2, 
  ChevronRight, 
  Shield, 
  FileJson,
  Upload,
  Bell,
  Camera,
  Check
} from "lucide-react";
import { useHisaabContext } from "@/context/hisaab-context";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const { settings, updateSettings, user } = useHisaabContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const data: Record<string, string | null> = {};
    const keys = ["hisaab_transactions", "hisaab_settings", "hisaab_budgets", "hisaab_savings", "hisaab_customers"];
    keys.forEach(key => data[key] = localStorage.getItem(key));
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dukaan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = JSON.parse(e.target?.result as string);
      Object.entries(data).forEach(([key, val]) => val && localStorage.setItem(key, val as string));
      window.location.reload();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Premium Profile Header */}
      <section className="flex flex-col items-center pt-8">
        <div className="relative">
          <div className="h-32 w-32 rounded-[2.5rem] purple-gradient flex items-center justify-center text-white shadow-2xl shadow-purple-500/20 relative group overflow-hidden">
            <User className="h-16 w-16" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
               <Camera className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-lg border-4 border-slate-50 dark:border-slate-900">
             <Check className="h-5 w-5 text-emerald-500" strokeWidth={3} />
          </div>
        </div>
        <div className="mt-6 text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Premium Merchant</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{user?.email || "Abhishek Sharma"}</p>
        </div>
      </section>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {/* Appearance & Security */}
        <section className="space-y-3 px-1">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Account Settings</h3>
          <div className="fintech-card overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400"><Moon className="h-5 w-5" /></div>
                <span className="font-bold text-sm">Dark Mode</span>
              </div>
              <button onClick={() => updateSettings({ darkMode: !settings.darkMode })} className={cn("w-12 h-6 rounded-full relative transition-colors", settings.darkMode ? "bg-primary" : "bg-slate-200")}>
                <motion.div animate={{ x: settings.darkMode ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400"><Shield className="h-5 w-5" /></div>
                <span className="font-bold text-sm">App Lock (PIN)</span>
              </div>
              <button onClick={() => updateSettings({ appLockEnabled: !settings.appLockEnabled })} className={cn("w-12 h-6 rounded-full relative transition-colors", settings.appLockEnabled ? "bg-primary" : "bg-slate-200")}>
                <motion.div animate={{ x: settings.appLockEnabled ? 24 : 4 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </button>
            </div>

            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400"><Globe className="h-5 w-5" /></div>
                <span className="font-bold text-sm">Language</span>
              </div>
              <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                 <button className="px-3 py-1 text-[10px] font-black rounded-lg bg-white shadow-sm">EN</button>
                 <button className="px-3 py-1 text-[10px] font-black rounded-lg text-slate-400">HI</button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications (Mocked) */}
        <section className="space-y-3 px-1">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Notifications</h3>
          <div className="fintech-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-600 dark:text-slate-400"><Bell className="h-5 w-5" /></div>
              <div className="space-y-0.5">
                <span className="font-bold text-sm block">Daily Reminder</span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Enabled</span>
              </div>
            </div>
            <button className="w-12 h-6 rounded-full bg-primary relative"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full" /></button>
          </div>
        </section>

        {/* Backup & Data */}
        <section className="space-y-3 px-1">
          <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">Data Center</h3>
          <div className="fintech-card overflow-hidden">
            <button onClick={exportData} className="w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary"><FileJson className="h-5 w-5" /></div>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Backup JSON</span>
              </div>
              <CloudDownload className="h-4 w-4 text-slate-300" />
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-primary"><Upload className="h-5 w-5" /></div>
                <span className="font-bold text-sm text-slate-700 dark:text-slate-300">Restore Data</span>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </button>
            <input type="file" ref={fileInputRef} onChange={importData} className="hidden" accept=".json" />
            <button className="w-full flex items-center justify-between p-5 hover:bg-rose-50 transition-colors">
               <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500"><Trash2 className="h-5 w-5" /></div>
                 <span className="font-bold text-sm text-rose-500">Reset Application</span>
               </div>
               <span className="text-[9px] font-black text-rose-300 uppercase">Warning</span>
            </button>
          </div>
        </section>
      </div>

      <div className="px-1 pt-4 pb-10">
        <Button variant="ghost" onClick={() => router.push('/login')} className="w-full h-14 rounded-2xl bg-slate-100 dark:bg-white/5 font-black text-slate-600 dark:text-slate-400">
           <LogOut className="h-5 w-5 mr-2" /> Log Out
        </Button>
        <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mt-8">Dukaan Premium v2.5</p>
      </div>
    </div>
  );
}
