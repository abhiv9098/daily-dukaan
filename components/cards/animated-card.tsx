"use client";

import { motion } from "framer-motion";
import { AnimatedCardData } from "@/types/card";
import { cn } from "@/lib/utils";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
  },
};

interface AnimatedCardProps {
  card: AnimatedCardData;
  className?: string;
}

export function AnimatedCard({ card, className }: AnimatedCardProps) {
  const Icon = card.icon;
  const sparkData = card.sparklineData?.map((v, i) => ({ value: v, id: i })) || [];
  const isPositive = sparkData.length > 0 && sparkData[sparkData.length - 1].value >= sparkData[0].value;

  return (
    <motion.article
      variants={cardVariants}
      whileHover={{
        y: -5,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={cn(
        "group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-card/40 p-5 shadow-xl backdrop-blur-2xl transition-all duration-300 dark:bg-[#09090b]/60",
        className
      )}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "rounded-xl p-2.5 shadow-inner transition-all duration-300 group-hover:scale-110",
              card.iconClassName
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          {card.sparklineData && (
            <div className="h-8 w-16">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkData}>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth={2}
                    fill={isPositive ? "#10b981" : "#ef4444"}
                    fillOpacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="space-y-1">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
            {card.title}
          </h3>
          <p className="text-2xl font-black tabular-nums tracking-tight text-foreground">
            {card.value}
          </p>
          <p className="text-[10px] font-semibold text-muted-foreground/80 leading-relaxed line-clamp-1">
            {card.description}
          </p>
        </div>
      </div>

      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.article>
  );
}
