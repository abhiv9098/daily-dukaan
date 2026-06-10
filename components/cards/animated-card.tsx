"use client";

import { motion } from "framer-motion";
import { AnimatedCardData } from "@/types/card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface AnimatedCardProps {
  card: AnimatedCardData;
  className?: string;
}

export function AnimatedCard({ card, className }: AnimatedCardProps) {
  const Icon = card.icon;
  const sparkData = card.sparklineData?.map((v, i) => ({ value: v, id: i })) || [];
  const isPositive = sparkData.length > 0 && sparkData[sparkData.length - 1].value >= sparkData[0].value;

  const content = (
    <>
      <div className="flex items-start justify-between mb-3">
        <div className={cn("rounded-xl p-2 bg-secondary text-foreground", card.iconClassName)}>
          <Icon className="h-4 w-4" />
        </div>
        {card.sparklineData && (
          <div className="h-6 w-12 opacity-50 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? "#10b981" : "#ef4444"}
                  strokeWidth={2}
                  fill="transparent"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <h3 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {card.title}
        </h3>
        <p className="text-xl font-bold tracking-tight text-foreground truncate">
          {card.value}
        </p>
      </div>
    </>
  );

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md",
        className
      )}
    >
      {card.href ? (
        <Link href={card.href} className="block">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
}
