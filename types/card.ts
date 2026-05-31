import { LucideIcon } from "lucide-react";

export interface AnimatedCardData {
  id: string;
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  sparklineData?: number[];
}
