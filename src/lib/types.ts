// ============================================================
// AdFlow Pro — Shared TypeScript Types
// ============================================================

// ----- Enums -----
export type UserRole = "client" | "moderator" | "admin" | "super_admin";

export type AdStatus =
  | "Draft"
  | "Submitted"
  | "Under Review"
  | "Payment Pending"
  | "Payment Submitted"
  | "Payment Verified"
  | "Scheduled"
  | "Published"
  | "Expired"
  | "Archived"
  | "Rejected";

export type PaymentStatus = "pending" | "verified" | "rejected";
export type PaymentMethod = "bank_transfer" | "mobile_money" | "card" | "crypto" | "other";
export type MediaSourceType = "image" | "youtube" | "video";
export type MediaValidationStatus = "valid" | "invalid" | "pending";

// ----- Database Row Types -----
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "suspended" | "banned";
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  display_name: string;
  business_name: string | null;
  phone: string | null;
  city: string | null;
  bio: string | null;
  is_verified: boolean;
  created_at: string;
}

export interface Package {
  id: string;
  name: string;
  slug: string;
  duration_days: number;
  weight: number;
  is_featured: boolean;
  price: number;
  description: string | null;
  badge_color: string;
  max_images: number;
  refresh_interval_days: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  is_active: boolean;
  created_at: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
}

export interface Ad {
  id: string;
  user_id: string;
  package_id: string | null;
  title: string;
  slug: string;
  category_id: string | null;
  city_id: string | null;
  description: string;
  status: AdStatus;
  admin_boost: number;
  is_featured: boolean;
  publish_at: string | null;
  expire_at: string | null;
  rank_score: number;
  rejection_reason: string | null;
  moderation_notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  user?: User;
  seller_profile?: SellerProfile;
  package?: Package;
  category?: Category;
  city?: City;
  media?: AdMedia[];
  payments?: Payment[];
}

export interface AdMedia {
  id: string;
  ad_id: string;
  source_type: MediaSourceType;
  original_url: string;
  thumbnail_url: string | null;
  validation_status: MediaValidationStatus;
  display_order: number;
  created_at: string;
}

export interface Payment {
  id: string;
  ad_id: string;
  user_id: string;
  amount: number;
  method: PaymentMethod;
  transaction_ref: string;
  sender_name: string;
  screenshot_url: string | null;
  status: PaymentStatus;
  admin_note: string | null;
  verified_by: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action_type: string;
  target_type: string;
  target_id: string;
  old_value: Record<string, unknown> | null;
  new_value: Record<string, unknown> | null;
  created_at: string;
}

export interface AdStatusHistory {
  id: string;
  ad_id: string;
  previous_status: AdStatus | null;
  new_status: AdStatus;
  changed_by: string | null;
  note: string | null;
  changed_at: string;
}

export interface LearningQuestion {
  id: string;
  question: string;
  answer: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  is_active: boolean;
  created_at: string;
}

export interface SystemHealthLog {
  id: string;
  source: string;
  status: "ok" | "error" | "warning";
  response_ms: number | null;
  message: string | null;
  checked_at: string;
}

// ----- API Response Types -----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ----- Dashboard Types -----
export interface AnalyticsSummary {
  totalAds: number;
  activeAds: number;
  pendingReviews: number;
  expiredAds: number;
  totalRevenue: number;
  verifiedPayments: number;
  monthlyRevenue: { month: string; revenue: number }[];
  adsByCategory: { name: string; count: number }[];
  adsByCity: { name: string; count: number }[];
  adsByStatus: { status: string; count: number }[];
  approvalRate: number;
  rejectionRate: number;
}

// ----- Allowed Status Transitions -----
export const ALLOWED_TRANSITIONS: Record<AdStatus, AdStatus[]> = {
  Draft: ["Submitted"],
  Submitted: ["Under Review"],
  "Under Review": ["Payment Pending", "Rejected"],
  "Payment Pending": ["Payment Submitted"],
  "Payment Submitted": ["Payment Verified", "Rejected"],
  "Payment Verified": ["Scheduled", "Published"],
  Scheduled: ["Published"],
  Published: ["Expired", "Archived"],
  Expired: ["Archived", "Draft"],
  Archived: ["Draft"],
  Rejected: ["Draft"],
};
