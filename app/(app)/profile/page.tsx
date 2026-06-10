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
  Settings,
  Store
} from "lucide-react";
import { useHisaabContext } from "@/context/hisaab-context";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { settings, updateSettings, user } = useHisaabContext();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const data: Record<string, string | null> = {};
    const keys = [
      "hisaab_transactions",
      "hisaab_settings",
      "hisaab_budgets",
      "hisaab_savings",
      "hisaab_customers",
      "hisaab_credit_transactions"
    ];
    
    keys.forEach(key => {
      data[key] = localStorage.getItem(key);
    });

    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dukaan_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (value) localStorage.setItem(key, value as string);
        });
        alert("Backup restored successfully! The app will reload.");
        window.location.reload();
      } catch (err) {
        alert("Failed to restore backup. Invalid file format.");
      }
    };
    reader.readAsText(file);
  };

  const clearAllData = () => {
    if (confirm("Are you sure? This will delete all your transactions and settings permanently.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Profile Header */}
      <section className="flex flex-col items-center pt-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-[2.5rem] premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/30">
            <User className="h-12 w-12" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-md">
             <div className="h-4 w-4 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-bold tracking-tight">Premium Merchant</h2>
        <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{user?.email || "Offline Local Account"}</p>
      </section>

      {/* Preferences Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Preferences</h3>
        <Card className="glass-card border-none overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><Moon className="h-5 w-5" /></div>
              <span className="font-bold text-sm">Dark Appearance</span>
            </div>
            <button 
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-7 rounded-full transition-all duration-300 ${settings.darkMode ? 'bg-primary' : 'bg-secondary'} relative`}
            >
              <motion.span 
                animate={{ x: settings.darkMode ? 20 : 0 }}
                className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><Shield className="h-5 w-5" /></div>
              <span className="font-bold text-sm">App Lock (PIN)</span>
            </div>
            <button 
              onClick={() => {
                const newValue = !settings.appLockEnabled;
                updateSettings({ appLockEnabled: newValue });
                localStorage.setItem("hisaab_app_lock_enabled", newValue.toString());
              }}
              className={`w-12 h-7 rounded-full transition-all duration-300 ${settings.appLockEnabled ? 'bg-primary' : 'bg-secondary'} relative`}
            >
              <motion.span 
                animate={{ x: settings.appLockEnabled ? 20 : 0 }}
                className="absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-md"
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><Globe className="h-5 w-5" /></div>
              <span className="font-bold text-sm">Language</span>
            </div>
            <div className="flex gap-1 bg-secondary/50 rounded-xl p-1">
              <button className="px-4 py-1.5 text-[10px] font-black rounded-lg bg-white shadow-sm">EN</button>
              <button className="px-4 py-1.5 text-[10px] font-black rounded-lg text-muted-foreground">HI</button>
            </div>
          </div>
        </Card>
      </div>

      {/* Data Management */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Data & Security</h3>
        <Card className="glass-card border-none overflow-hidden">
          <button onClick={exportData} className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors text-left group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><FileJson className="h-5 w-5" /></div>
              <span className="font-bold text-sm">Backup to JSON File</span>
            </div>
            <CloudDownload className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          
          <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-between p-4 border-b border-border/50 hover:bg-secondary/30 transition-colors text-left group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-primary"><Upload className="h-5 w-5" /></div>
              <span className="font-bold text-sm">Restore from Backup</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={importData} 
            accept=".json" 
            className="hidden" 
          />
          
          <button onClick={clearAllData} className="w-full flex items-center justify-between p-4 hover:bg-rose-500/5 transition-colors text-left group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center"><Trash2 className="h-5 w-5" /></div>
              <span className="font-bold text-sm text-rose-500">Reset All Data</span>
            </div>
            <span className="text-[10px] font-black text-rose-500/50 uppercase">Danger</span>
          </button>
        </Card>
      </div>

      {/* Sign Out */}
      <div className="pt-4">
         <Button 
           variant="secondary" 
           onClick={() => router.push('/login')} 
           className="w-full h-14 rounded-2xl font-bold bg-secondary hover:bg-muted border border-border/50 shadow-sm"
         >
           <LogOut className="h-5 w-5 mr-2" /> Sign Out
         </Button>
         <p className="mt-4 text-center text-[10px] text-muted-foreground font-black uppercase tracking-[0.3em]">Dukaan Premium v2.0</p>
      </div>
    </div>
  );
}

