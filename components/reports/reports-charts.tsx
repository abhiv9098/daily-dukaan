"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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
import { IndianRupee, TrendingUp } from "lucide-react";

interface ReportsChartsProps {
  transactions: Transaction[];
}

const CustomTooltip = ({ active, payload, label, prefix = "₹" }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-2xl backdrop-blur-xl dark:bg-black/80">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ backgroundColor: entry.color || entry.fill }} 
                />
                <span className="text-sm font-medium text-foreground/80">{entry.name}:</span>
              </div>
              <span className="text-sm font-bold text-foreground">
                {prefix}{Number(entry.value).toLocaleString("en-IN")}
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

  if (transactions.length === 0) {
    return (
      <Card className="flex h-[400px] flex-col items-center justify-center rounded-2xl border-white/10 bg-white shadow-xl dark:bg-[#09090b]/60">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-500 mb-4 animate-bounce">
          <TrendingUp className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">No Data Available</h3>
        <p className="text-sm text-muted-foreground max-w-[240px] text-center mt-1">
          Start recording your dukaan entries to see beautiful analytics and trends.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      {/* Revenue vs Expenses Chart */}
      <Card className="rounded-2xl border-white/10 bg-white p-6 shadow-xl dark:bg-[#09090b]/60 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Growth Insights</h4>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              Revenue vs Expenses
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            </h3>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
            <IndianRupee className="h-5 w-5" />
          </div>
        </div>

        <div className="h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barGap={8}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={1} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                tick={{ fill: 'currentColor', opacity: 0.4 }} 
                dy={10}
              />
              <YAxis 
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000) + 'k' : v}`} 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                tick={{ fill: 'currentColor', opacity: 0.4 }} 
              />
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(168, 85, 247, 0.03)' }}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                iconType="circle" 
                wrapperStyle={{ paddingBottom: '30px', fontSize: '12px', fontWeight: 'bold' }} 
              />
              <Bar 
                dataKey="income" 
                fill="url(#incomeGradient)" 
                radius={[6, 6, 0, 0]} 
                name="Income" 
                animationDuration={1500}
                barSize={32}
              />
              <Bar 
                dataKey="expense" 
                fill="url(#expenseGradient)" 
                radius={[6, 6, 0, 0]} 
                name="Expense" 
                animationDuration={2000}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Net Profit Trend Chart */}
      <Card className="rounded-2xl border-white/10 bg-white p-6 shadow-xl dark:bg-[#09090b]/60 overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Efficiency</h4>
            <h3 className="text-xl font-bold text-foreground">Net Profit Trend</h3>
          </div>
          <div className="flex gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2" />
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Positive Margin</span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="profitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="rgba(0,0,0,0.05)" className="dark:stroke-white/5" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                tick={{ fill: 'currentColor', opacity: 0.4 }} 
                dy={10}
              />
              <YAxis 
                tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000) + 'k' : v}`} 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                tick={{ fill: 'currentColor', opacity: 0.4 }} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="profit" 
                stroke="#10b981" 
                fill="url(#profitAreaGrad)" 
                strokeWidth={3} 
                animationDuration={2500}
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
