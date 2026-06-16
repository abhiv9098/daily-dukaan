"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transaction } from "@/types";
import {
  format,
  parseISO,
  subMonths,
} from "date-fns";
import { useMemo } from "react";
import { TrendingUp, Users, Landmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReportsChartsProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label, prefix = "₹" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/90 p-4 shadow-2xl backdrop-blur-xl">
        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color || entry.fill }} 
                />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{entry.name}:</span>
              </div>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {prefix}{Number(entry.value).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export function ReportsCharts({ transactions }: ReportsChartsProps) {
  const monthlyTrend = useMemo(() => {
    const now = new Date();
    const months = [0, 1, 2, 3, 4, 5].map((i) => subMonths(now, 5 - i));
    return months.map((month) => {
      const label = format(month, "MMM");
      let income = 0;
      let expense = 0;
      transactions.forEach((t) => {
        const d = parseISO(t.date);
        if (d.getMonth() === month.getMonth() && d.getFullYear() === month.getFullYear()) {
          const amt = Number(t.amount);
          if (t.type === "income") income += amt;
          else expense += amt;
        }
      });
      return { name: label, income, expense, profit: income - expense };
    });
  }, [transactions]);

  const borrowedTrend = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map(m => ({
      name: m,
      borrowed: Math.floor(Math.random() * 50000) + 10000,
      recovered: Math.floor(Math.random() * 40000) + 5000,
    }));
  }, []);

  if (transactions.length === 0) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center fintech-card">
        <TrendingUp className="h-12 w-12 text-slate-200 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Data Found</h3>
        <p className="text-sm text-slate-500 text-center px-8">Start adding transactions to see charts.</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Income vs Expense Chart */}
      <Card className="fintech-card p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Income vs Expense</h3>
          </div>
          <TrendingUp className="h-6 w-6 text-indigo-500" />
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Monthly Savings Chart */}
      <Card className="fintech-card p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Growth</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly Savings</h3>
          </div>
          <Landmark className="h-6 w-6 text-purple-500" />
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="savGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="profit" stroke="#7c3aed" fillOpacity={1} fill="url(#savGrad)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Borrowed vs Recovered Chart */}
      <Card className="fintech-card p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Liabilities</h4>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Borrowed vs Recovered</h3>
          </div>
          <Users className="h-6 w-6 text-amber-500" />
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={borrowedTrend}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="borrowed" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="recovered" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
