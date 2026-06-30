"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Store, 
  Moon, 
  Shield, 
  KeyRound, 
  Check, 
  ChevronRight, 
  ArrowLeft,
  Coins,
  RefreshCw,
  Bell
} from "lucide-react";
import { useHisaabContext } from "@/context/hisaab-context";
import { useLanguage } from "@/context/language-context";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const CURRENCY_OPTIONS = [
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham (AED)" },
  { code: "SAR", symbol: "ر.स", label: "Saudi Riyal (SAR)" },
];

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useHisaabContext();
  const { t } = useLanguage();

  const [shopName, setShopName] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("1234");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (settings) {
      setShopName(settings.shopName || "Mera Hisab");
      setCurrency(settings.currency || "INR");
      setEmail(settings.email || "");
      setPhone(settings.phone || "");
    }
    const savedPin = localStorage.getItem("hisaab_app_lock_pin") || "1234";
    setPin(savedPin);
  }, [settings]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleSaveShopDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopName.trim()) return;
    await updateSettings({ shopName, currency, email, phone });
    showNotification("Shop details updated successfully!");
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setPinError("PIN must be exactly 4 digits.");
      return;
    }

    if (newPin !== confirmPin) {
      setPinError("PINs do not match.");
      return;
    }

    localStorage.setItem("hisaab_app_lock_pin", newPin);
    setPin(newPin);
    setNewPin("");
    setConfirmPin("");
    showNotification("PIN lock updated successfully!");
  };

  const handleToggleLock = async () => {
    const updatedStatus = !settings.appLockEnabled;
    await updateSettings({ appLockEnabled: updatedStatus });
    localStorage.setItem("hisaab_app_lock_enabled", String(updatedStatus));
    showNotification(updatedStatus ? "App lock enabled!" : "App lock disabled!");
  };

  const handleToggleDarkMode = async () => {
    await updateSettings({ darkMode: !settings.darkMode });
    showNotification(settings.darkMode ? "Light mode enabled!" : "Dark mode enabled!");
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.push("/")}
          className="rounded-xl border border-slate-200 dark:border-white/5 bg-card/50 backdrop-blur-xl hover:bg-slate-100 dark:hover:bg-white/5"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("settings")}
          </h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[9px] mt-0.5">
            Configure your business workspace
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[110] flex items-center gap-2 bg-emerald-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-xl shadow-emerald-500/20"
          >
            <Check className="h-5 w-5" strokeWidth={3} />
            <span className="text-sm">{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shop Configuration Card */}
        <Card className="flex flex-col">
          <form onSubmit={handleSaveShopDetails} className="p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="h-10 w-10 rounded-xl premium-gradient flex items-center justify-center text-white">
                  <Store className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Shop Details</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Manage shop branding & currencies</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Shop Name</label>
                <Input 
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Apna Bazar"
                  className="h-12 px-4 rounded-xl text-sm border-slate-200 dark:border-white/5 font-semibold"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gmail / Email</label>
                <Input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. abhishek@gmail.com"
                  className="h-12 px-4 rounded-xl text-sm border-slate-200 dark:border-white/5 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mobile Number</label>
                <Input 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="h-12 px-4 rounded-xl text-sm border-slate-200 dark:border-white/5 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Currency</label>
                <div className="grid grid-cols-2 gap-2">
                  {CURRENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      type="button"
                      onClick={() => setCurrency(opt.code)}
                      className={cn(
                        "flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all duration-200",
                        currency === opt.code 
                          ? "border-primary bg-primary/5 text-primary dark:bg-primary/10 font-bold" 
                          : "border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      )}
                    >
                      <span className="text-sm font-black w-6 text-center">{opt.symbol}</span>
                      <span className="text-xs font-semibold">{opt.code}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary text-white hover:bg-primary/95 transition-all">
              Save Shop Profile
            </Button>
          </form>
        </Card>

        {/* Security & Access Card */}
        <Card className="flex flex-col">
          <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base">App Lock Security</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Protect records from unauthorized access</p>
                  </div>
                </div>
                <button 
                  onClick={handleToggleLock} 
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors", 
                    settings.appLockEnabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
                  )}
                >
                  <motion.div 
                    animate={{ x: settings.appLockEnabled ? 24 : 4 }} 
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
                  />
                </button>
              </div>

              {settings.appLockEnabled ? (
                <motion.form 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleUpdatePin}
                  className="space-y-4 pt-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-4 rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2.5">
                      <KeyRound className="h-4 w-4 text-slate-400" />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current PIN</span>
                    </div>
                    <span className="text-sm font-black text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                      {pin}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">New 4-digit PIN</label>
                      <Input 
                        type="password"
                        pattern="\d*"
                        maxLength={4}
                        placeholder="••••"
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                        className="h-10 text-center font-bold text-lg border-slate-200 dark:border-white/5 rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confirm PIN</label>
                      <Input 
                        type="password"
                        pattern="\d*"
                        maxLength={4}
                        placeholder="••••"
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                        className="h-10 text-center font-bold text-lg border-slate-200 dark:border-white/5 rounded-lg"
                      />
                    </div>
                  </div>

                  {pinError && (
                    <p className="text-xs font-bold text-rose-500">{pinError}</p>
                  )}

                  <Button type="submit" variant="secondary" className="w-full h-11 rounded-lg font-bold text-xs bg-slate-100 dark:bg-white/5">
                    Update Passcode PIN
                  </Button>
                </motion.form>
              ) : (
                <div className="py-6 text-center text-slate-400 text-xs font-medium">
                  App lock security is currently turned off. Anyone can access your ledger.
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Display Preferences */}
      <Card className="p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
          <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Moon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-base">App Preferences</h3>
            <p className="text-[10px] text-slate-400 font-medium">Tailor your app interface experience</p>
          </div>
        </div>

        <div>
          {/* Dark Mode Preference */}
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-500">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-sm block">Dark Theme</span>
                <span className="text-[10px] text-slate-400 font-medium">Reduce strain in low light</span>
              </div>
            </div>
            <button 
              onClick={handleToggleDarkMode}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors", 
                settings.darkMode ? "bg-primary" : "bg-slate-200 dark:bg-slate-800"
              )}
            >
              <motion.div 
                animate={{ x: settings.darkMode ? 24 : 4 }} 
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" 
              />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
