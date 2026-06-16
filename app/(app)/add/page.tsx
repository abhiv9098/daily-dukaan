"use client";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddPage() {
  const router = useRouter();

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
        <h1 className="text-lg font-bold tracking-tight">Hisaab Likhein (Add)</h1>
        <div className="w-10" /> {/* Spacer */}
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="p-4 md:p-8 max-w-2xl mx-auto w-full">
           <TransactionForm />
        </div>
      </div>
    </div>
  );
}
