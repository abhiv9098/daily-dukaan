"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const DateInput = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => {
  return (
    <div className="date-input-wrapper w-full">
      <input
        ref={ref}
        type="date"
        className={cn(
          "h-8 w-full rounded-xl border border-white/10 bg-black/5 px-2 text-xs transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:bg-white/5",
          className
        )}
        {...props}
      />
    </div>
  );
});
DateInput.displayName = "DateInput";

export { DateInput };
