"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, Delete, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppLockProps {
  children: React.ReactNode;
}

export function AppLock({ children }: AppLockProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState(false);
  const [correctPin, setCorrectPin] = useState("1234");

  useEffect(() => {
    setIsMounted(true);
    const storedLock = localStorage.getItem("hisaab_app_lock_enabled");
    if (storedLock === "false") {
      setIsLocked(false);
    }
    const storedPin = localStorage.getItem("hisaab_app_lock_pin");
    if (storedPin) {
      setCorrectPin(storedPin);
    }
  }, []);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === correctPin) {
          setIsLocked(false);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  if (!isMounted) return null;

  if (!isLocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xs flex flex-col items-center"
      >
        <div className="h-20 w-20 rounded-3xl premium-gradient flex items-center justify-center mb-8 shadow-xl shadow-primary/20">
          <Lock className="h-10 w-10 text-white" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
        <p className="text-muted-foreground text-sm mb-12">Enter your 4-digit PIN to continue</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
              className={cn(
                "h-4 w-4 rounded-full border-2 transition-all duration-200",
                pin.length > i 
                  ? "bg-primary border-primary scale-110 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                  : "border-muted-foreground/30",
                error && "border-destructive bg-destructive"
              )}
            />
          ))}
        </div>

        {/* Number Pad */}
        <div className="grid grid-cols-3 gap-6 w-full">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="h-16 w-16 rounded-2xl bg-secondary hover:bg-muted active:scale-90 transition-all flex items-center justify-center text-xl font-bold border border-border/50"
            >
              {num}
            </button>
          ))}
          <div className="h-16 w-16" />
          <button
            onClick={() => handleKeyPress("0")}
            className="h-16 w-16 rounded-2xl bg-secondary hover:bg-muted active:scale-90 transition-all flex items-center justify-center text-xl font-bold border border-border/50"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-16 w-16 rounded-2xl text-muted-foreground hover:text-foreground active:scale-90 transition-all flex items-center justify-center"
          >
            <Delete className="h-6 w-6" />
          </button>
        </div>

        <button 
          onClick={() => {
            // In a real app, this might logout or clear data
            localStorage.removeItem("hisaab_app_lock_enabled");
            window.location.reload();
          }}
          className="mt-12 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          Forgot PIN?
        </button>
      </motion.div>
    </div>
  );
}
