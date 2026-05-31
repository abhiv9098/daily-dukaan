"use client";

import { AnimatedCard } from "@/components/cards/animated-card";
import { formatCurrency } from "@/lib/utils";
import { useHisaabContext } from "@/context/hisaab-context";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

/** @deprecated Prefer AnimatedCardGrid — kept for reports page compatibility */
export function StatCard({
  title,
  amount,
  icon,
  description,
  trend,
  className,
  iconClassName,
}: StatCardProps) {
  const { settings } = useHisaabContext();

  return (
    <AnimatedCard
      className={className}
      card={{
        id: title,
        title,
        value: formatCurrency(amount, settings.currency),
        description:
          description +
          (trend
            ? ` ${trend.isPositive ? "+" : "-"}${trend.value}%`
            : ""),
        icon,
        iconClassName: cn(
          iconClassName,
          "group-hover:bg-white/20 group-hover:text-white"
        ),
      }}
    />
  );
}
