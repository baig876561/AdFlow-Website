"use client";

import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
  color?: "default" | "primary" | "success" | "warning" | "danger";
}

const colorMap = {
  default: "from-card to-card",
  primary: "from-primary/10 to-card",
  success: "from-success/10 to-card",
  warning: "from-warning/10 to-card",
  danger: "from-destructive/10 to-card",
};

const iconColorMap = {
  default: "text-muted",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  danger: "text-destructive",
};

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  color = "default",
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl border border-border bg-gradient-to-br transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        colorMap[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div className={cn("flex items-center gap-1 text-xs font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
              <span>{trend.isPositive ? "↑" : "↓"}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={cn("p-2 rounded-lg bg-background/50", iconColorMap[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
