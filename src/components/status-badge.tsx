"use client";

import { AD_STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors = AD_STATUS_COLORS[status] || "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        colors,
        className
      )}
    >
      {status}
    </span>
  );
}
