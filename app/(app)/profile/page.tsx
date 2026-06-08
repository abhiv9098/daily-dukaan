"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Camera, Mail, Phone, ShieldCheck, User,
  Bell, CloudDownload, Globe, Info, LogOut, Moon, ShieldAlert, Sun, Trash2, Sparkles, HardDrive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { settings, updateSettings, transactions, user } = useHisaabContext();
  const [lang, setLang] = useState("en");
  const [notifications, setNotifications] = useState(true);
  const router = useRouter();

  const handleClearData = () => {
    if (confirm("Delete all your transactions? This cannot be undone.")) {
      localStorage.removeItem("hisaab_transactions");
      localStorage.removeItem("hisaab_settings");
      window.location.reload();
    }
  };

  const handleBackup = () => {
    alert("Data is saved locally on your device.");
  };

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl space-y-10 pb-20"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent uppercase">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground font-medium">
          Manage your business account, preferences, and security.
        </p>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-card/40 p-8 shadow-2xl backdrop-blur-2xl dark:bg-[#09090b]/60">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
          <div className="relative group">
            <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border-4 border-white/10 bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl overflow-hidden group-hover:scale-105 transition-transform duration-500">
              <User className="h-14 w-14 text-white/90" />
            </div>
            <button className="absolute -bottom-2 -right-2 p-3 bg-purple-600 rounded-2xl shadow-xl text-white hover:bg-purple-700 hover:scale-110 transition-all duration-300">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h2 className="text-3xl font-bold text-foreground">Local Merchant</h2>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-widest">
                  <HardDrive className="h-3 w-3" />
                  Offline Mode
                </div>
              </div>
              <p className="text-muted-foreground font-medium">{user?.email}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground/80 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-purple-500" />
                <span>Local Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-blue-500" />
                <span>Privacy First</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center md:justify-start">
              <Button className="rounded-xl bg-white/5 hover:bg-white/10 text-foreground border border-white/10 backdrop-blur-md transition-all duration-300 px-6 font-bold">
                Update Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Appearance & Language */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Personalization
          </h3>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Dark Mode */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-500">
                  {settings.darkMode ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Toggle visual appearance</p>
                </div>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${settings.darkMode ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">Language</h4>
                  <p className="text-xs text-muted-foreground">Select system language</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/10 dark:bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setLang("en")}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${lang === "en" ? 'bg-purple-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  EN
                </button>
                <button 
                  onClick={() => setLang("hi")}
                  className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all ${lang === "hi" ? 'bg-purple-600 text-white shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  HI
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Notifications */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
            <Bell className="h-3 w-3" />
            Security & Prefs
          </h3>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Notifications */}
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500">
                  <Bell className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">Smart Alerts</h4>
                  <p className="text-xs text-muted-foreground">Receive daily summaries</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 ${notifications ? 'bg-purple-600 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-300 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Privacy & Security */}
            <div className="flex items-center justify-between p-6 hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500/20 transition-colors">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">Device Security</h4>
                  <p className="text-xs text-muted-foreground">Manage app lock & privacy</p>
                </div>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
            <CloudDownload className="h-3 w-3" />
            Data Management
          </h3>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Backup */}
            <div className="flex items-center justify-between border-b border-white/5 p-6 hover:bg-white/5 transition-colors cursor-pointer group" onClick={handleBackup}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-500 group-hover:bg-cyan-500/20 transition-colors">
                  <CloudDownload className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">Local Backup</h4>
                  <p className="text-xs text-muted-foreground">Export your data to JSON</p>
                </div>
              </div>
              <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">&rarr;</span>
            </div>

            {/* Clear Data */}
            <div className="flex items-center justify-between p-6 hover:bg-red-500/10 transition-colors cursor-pointer group" onClick={handleClearData}>
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-red-500 uppercase tracking-tight text-sm">Reset Database</h4>
                  <p className="text-xs text-red-500/70 font-bold uppercase tracking-widest">{transactions.length} Records Stored</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System & Support */}
        <div className="space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/60 px-2 flex items-center gap-2">
            <Info className="h-3 w-3" />
            System
          </h3>
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            <div className="flex items-center justify-between border-b border-white/5 p-6 group">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-500/10 text-slate-500 dark:text-slate-400">
                  <Info className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground uppercase tracking-tight text-sm">App Version</h4>
                  <p className="text-xs text-muted-foreground">v2.1.0-offline</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <Button onClick={handleLogout} className="w-full h-14 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-foreground border border-white/10 shadow-xl transition-all duration-300 gap-3 font-black uppercase tracking-widest">
                <LogOut className="h-5 w-5" />
                Switch to Guest Mode
              </Button>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}
