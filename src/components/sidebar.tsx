"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import type { UserRole } from "@/lib/types";

interface SidebarProps {
  role: UserRole;
  userName: string;
}

const roleMenus: Record<UserRole, { href: string; label: string; icon: string }[]> = {
  client: [
    { href: "/client", label: "Dashboard", icon: "📊" },
    { href: "/client/ads/new", label: "Create Ad", icon: "➕" },
    { href: "/", label: "Back to Site", icon: "🏠" },
  ],
  moderator: [
    { href: "/moderator", label: "Review Queue", icon: "📋" },
    { href: "/", label: "Back to Site", icon: "🏠" },
  ],
  admin: [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/payments", label: "Payments", icon: "💳" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/health", label: "System Health", icon: "💓" },
    { href: "/", label: "Back to Site", icon: "🏠" },
  ],
  super_admin: [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/payments", label: "Payments", icon: "💳" },
    { href: "/admin/analytics", label: "Analytics", icon: "📈" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/health", label: "System Health", icon: "💓" },
    { href: "/", label: "Back to Site", icon: "🏠" },
  ],
};

const roleStyles: Record<
  UserRole,
  {
    sidebarBg: string;
    logoGradient: string;
    activeItemBg: string;
    activeItemText: string;
    roleBadge: string;
  }
> = {
  client: {
    sidebarBg: "bg-card/50",
    logoGradient: "from-blue-500 to-indigo-600",
    activeItemBg: "bg-blue-500/10",
    activeItemText: "text-blue-600 dark:text-blue-400",
    roleBadge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  moderator: {
    sidebarBg: "bg-amber-50/50 dark:bg-amber-950/20",
    logoGradient: "from-amber-500 to-orange-600",
    activeItemBg: "bg-amber-500/15",
    activeItemText: "text-amber-700 dark:text-amber-400",
    roleBadge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  },
  admin: {
    sidebarBg: "bg-emerald-50/50 dark:bg-emerald-950/20",
    logoGradient: "from-emerald-500 to-emerald-700",
    activeItemBg: "bg-emerald-500/15",
    activeItemText: "text-emerald-700 dark:text-emerald-400",
    roleBadge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  },
  super_admin: {
    sidebarBg: "bg-purple-50/50 dark:bg-purple-950/20",
    logoGradient: "from-purple-600 to-indigo-800",
    activeItemBg: "bg-purple-500/15",
    activeItemText: "text-purple-700 dark:text-purple-400",
    roleBadge: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  },
};

export function Sidebar({ role, userName }: SidebarProps) {
  const pathname = usePathname();
  const menu = roleMenus[role] || roleMenus.client;
  const styles = roleStyles[role] || roleStyles.client;

  return (
    <aside
      className={cn(
        "w-64 min-h-screen border-r border-border/50 backdrop-blur-xl flex flex-col transition-colors duration-300",
        styles.sidebarBg
      )}
    >
      {/* Logo */}
      <div className="p-5 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2.5">
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm",
              styles.logoGradient
            )}
          >
            AF
          </div>
          <span className="text-lg font-bold gradient-text">{APP_NAME}</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border/50">
        <p className="text-sm font-medium text-foreground truncate">{userName}</p>
        <div className="mt-1 flex items-center">
          <span
            className={cn(
              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
              styles.roleBadge
            )}
          >
            {role.replace("_", " ")}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menu.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? cn(styles.activeItemBg, styles.activeItemText, "shadow-sm")
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-border/50">
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <span className="text-base">🚪</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
