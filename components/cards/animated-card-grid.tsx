"use client";

import { motion } from "framer-motion";
import { AnimatedCard } from "@/components/cards/animated-card";
import { AnimatedCardData } from "@/types/card";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

interface AnimatedCardGridProps {
  cards: AnimatedCardData[];
  className?: string;
}

export function AnimatedCardGrid({ cards, className }: AnimatedCardGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4",
        className
      )}
    >
      {cards.map((card) => (
        <AnimatedCard key={card.id} card={card} />
      ))}
    </motion.div>
  );
}
