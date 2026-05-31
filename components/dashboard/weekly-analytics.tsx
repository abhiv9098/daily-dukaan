"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types";
import {
  eachDayOfInterval,
  format,
  isSameDay,
  parseISO,
  subDays,
} from "date-fns";

interface WeeklyAnalyticsProps {
  transactions: Transaction[];
}

export function WeeklyAnalytics({ transactions }: WeeklyAnalyticsProps) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const days = eachDayOfInterval({
      start: subDays(now, 6),
      end: now,
    });

    return days.map((day) => {
      const dayTx = transactions.filter((t) =>
        isSameDay(parseISO(t.date), day)
      );
      const income = dayTx
        .filter((t) => t.type === "income")
        .reduce((s, t) => s + Number(t.amount), 0);
      const expense = dayTx
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + Number(t.amount), 0);
      
      return {
        name: format(day, "EEE"),
        income,
        expense,
      };
    });
  }, [transactions]);

  return (
    <Card className="border-border bg-card shadow-xl transition-all duration-500 dark:bg-[#09090b]/80 dark:backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Weekly Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
              <XAxis 
                dataKey="name" 
                tickLine={false} 
                axisLine={false} 
                fontSize={12} 
                tick={{ fill: 'currentColor', opacity: 0.5 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  backdropFilter: 'blur(8px)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: 'var(--foreground)'
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#incomeGrad)"
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#expenseGrad)"
                name="Expense"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
