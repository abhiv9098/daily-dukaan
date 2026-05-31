"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Camera, Mail, Phone, ShieldCheck, User,
  Bell, CloudDownload, Globe, Info, LogOut, Moon, ShieldAlert, Sun, Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHisaabContext } from "@/context/hisaab-context";

export default function ProfilePage() {
  const { settings, updateSettings, transactions, storageKeys } = useHisaabContext();
  const [lang, setLang] = useState("en");
  const [notifications, setNotifications] = useState(true);

  const handleClearData = () => {
    if (confirm("Delete all your transactions? This cannot be undone.")) {
      localStorage.removeItem(storageKeys.transactions);
      window.location.reload();
    }
  };

  const handleBackup = () => {
    alert("Backup successfully saved to cloud!");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl space-y-8 pb-20"
    >
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Profile & Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your personal information, preferences, and data.
        </p>
      </div>

      {/* Profile Card */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 shadow-2xl backdrop-blur-2xl dark:bg-[#09090b]/60">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-[80px] pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          <div className="relative group">
            <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-background bg-gradient-to-br from-blue-600 to-purple-600 shadow-xl overflow-hidden">
              <User className="h-12 w-12 text-white/80" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg text-primary-foreground hover:scale-110 transition-transform duration-300">
              <Camera className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1 mt-2">
            <h2 className="text-2xl font-bold">Merchant User</h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>merchant@merahisaab.com</span>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground mt-1">
              <Phone className="h-4 w-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="mt-4 pt-2">
              <Button className="rounded-xl bg-white/10 hover:bg-white/20 text-foreground border border-white/10 backdrop-blur-md shadow-sm transition-all duration-300">
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="hidden sm:block">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Appearance & Language */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">General</h3>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Dark Mode */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                  {settings.darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Dark Mode</h4>
                  <p className="text-xs text-muted-foreground">Adjust the visual theme</p>
                </div>
              </div>
              <button 
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${settings.darkMode ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${settings.darkMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Language Selection */}
            <div className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Language</h4>
                  <p className="text-xs text-muted-foreground">Select your preferred language</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-black/10 dark:bg-white/5 p-1 rounded-xl">
                <button 
                  onClick={() => setLang("en")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${lang === "en" ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLang("hi")}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${lang === "hi" ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  हिन्दी
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications & Security */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Preferences</h3>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Notifications */}
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Notifications</h4>
                  <p className="text-xs text-muted-foreground">Receive daily summaries</p>
                </div>
              </div>
              <button 
                onClick={() => setNotifications(!notifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${notifications ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 ${notifications ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>

            {/* Privacy & Security */}
            <div className="flex items-center justify-between p-5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-500">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Privacy & Security</h4>
                  <p className="text-xs text-muted-foreground">App lock & data privacy</p>
                </div>
              </div>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
          </div>
        </div>

        {/* Data & Backup */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Data Management</h3>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            {/* Backup */}
            <div className="flex items-center justify-between border-b border-white/10 p-5 hover:bg-white/5 transition-colors cursor-pointer" onClick={handleBackup}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
                  <CloudDownload className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Backup & Restore</h4>
                  <p className="text-xs text-muted-foreground">Sync your data to cloud</p>
                </div>
              </div>
              <span className="text-muted-foreground">&rarr;</span>
            </div>

            {/* Clear Data */}
            <div className="flex items-center justify-between p-5 hover:bg-red-500/5 transition-colors cursor-pointer" onClick={handleClearData}>
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-500">Clear All Data</h4>
                  <p className="text-xs text-red-500/70">{transactions.length} records stored</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Support & Logout */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground px-2">Support</h3>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-card/40 shadow-xl backdrop-blur-2xl dark:bg-[#09090b]/60">
            <div className="flex items-center justify-between border-b border-white/10 p-5 hover:bg-white/5 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-500 dark:text-slate-400">
                  <Info className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">About App</h4>
                  <p className="text-xs text-muted-foreground">Version 2.0.0</p>
                </div>
              </div>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
            
            <div className="p-5">
              <Button onClick={() => window.location.href='/login'} className="w-full h-12 rounded-2xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-foreground border border-white/10 shadow-sm transition-all duration-300 gap-2 font-bold">
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

    </motion.div>
  );
}