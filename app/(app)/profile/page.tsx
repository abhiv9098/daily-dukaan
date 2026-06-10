"use client";

import { useState } from "react";
import { User, Globe, Moon, LogOut, CloudDownload, Trash2, ChevronRight } from "lucide-react";
import { useHisaabContext } from "@/context/hisaab-context";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { settings, updateSettings, user } = useHisaabContext();
  const [lang, setLang] = useState("en");
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-[24px] shadow-sm">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-foreground shrink-0">
          <User className="h-8 w-8" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">Local Merchant</h1>
          <p className="text-sm text-muted-foreground truncate">{user?.email || "Offline Account"}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Preferences</h2>
        <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-border/60">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"><Moon className="h-5 w-5" /></div>
              <span className="font-medium text-sm">Dark Mode</span>
            </div>
            <button 
              onClick={() => updateSettings({ darkMode: !settings.darkMode })}
              className={`w-12 h-7 rounded-full transition-colors ${settings.darkMode ? 'bg-primary' : 'bg-border'} relative`}
            >
              <span className={`absolute top-1 left-1 bg-background w-5 h-5 rounded-full shadow-sm transition-transform ${settings.darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center"><Globe className="h-5 w-5" /></div>
              <span className="font-medium text-sm">Language</span>
            </div>
            <div className="flex gap-1 bg-secondary rounded-xl p-1">
              <button onClick={() => setLang("en")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${lang === 'en' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>EN</button>
              <button onClick={() => setLang("hi")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${lang === 'hi' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>HI</button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest px-2">Data</h2>
        <div className="bg-card border border-border rounded-[24px] overflow-hidden shadow-sm">
          <button className="w-full flex items-center justify-between p-4 border-b border-border/60 hover:bg-secondary/50 transition-colors text-left" onClick={() => alert("Data is saved locally.")}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-foreground"><CloudDownload className="h-5 w-5" /></div>
              <span className="font-medium text-sm">Backup Settings</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          
          <button className="w-full flex items-center justify-between p-4 hover:bg-destructive/5 transition-colors text-left group">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/10 text-destructive flex items-center justify-center"><Trash2 className="h-5 w-5" /></div>
              <span className="font-medium text-sm text-destructive group-hover:underline">Clear Data</span>
            </div>
            <ChevronRight className="h-4 w-4 text-destructive/50" />
          </button>
        </div>
      </div>

      <div className="pt-4">
         <button onClick={() => router.push('/login')} className="w-full flex items-center justify-center gap-2 h-14 rounded-full bg-secondary text-foreground font-bold hover:bg-border transition-colors">
           <LogOut className="h-5 w-5" /> Sign Out
         </button>
      </div>
    </div>
  );
}
