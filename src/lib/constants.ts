// ============================================================
// AdFlow Pro — Constants
// ============================================================

export const APP_NAME = "AdFlow Pro";
export const APP_DESCRIPTION = "Advanced Moderated Ads Marketplace";

export const AD_STATUSES_PUBLIC = ["Published"] as const;

export const AD_STATUS_COLORS: Record<string, string> = {
  Draft: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  Submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Under Review": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Payment Pending": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Payment Submitted": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Payment Verified": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Scheduled: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Expired: "bg-red-500/10 text-red-400 border-red-500/20",
  Archived: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  Rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

export const PACKAGE_COLORS: Record<string, string> = {
  basic: "from-zinc-600 to-zinc-800",
  standard: "from-blue-600 to-indigo-800",
  premium: "from-amber-500 to-orange-700",
};

export const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super Admin",
};

export const ITEMS_PER_PAGE = 12;

export const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x400/1a1a2e/e0e0e0?text=No+Image";
