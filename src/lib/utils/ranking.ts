// ============================================================
// Ranking Algorithm
// ============================================================

import { differenceInHours } from "date-fns";

interface RankingInput {
  is_featured: boolean;
  package_weight: number; // 1 = Basic, 2 = Standard, 3 = Premium
  published_at: string | Date;
  admin_boost: number; // 0–100, set by admin
  seller_is_verified: boolean;
}

/**
 * Calculate the rank score for an ad.
 *
 * Formula:
 *   rankScore = (featured ? 50 : 0)
 *             + (packageWeight * 10)
 *             + freshnessPoints
 *             + adminBoost
 *             + verifiedSellerPoints
 *
 * - freshnessPoints: 0–30, decays over 72 hours
 * - verifiedSellerPoints: 5 if seller is verified
 */
export function calculateRankScore(input: RankingInput): number {
  const featuredPoints = input.is_featured ? 50 : 0;
  const packagePoints = input.package_weight * 10;

  // Freshness: 30 points for brand-new, decays to 0 over 72 hours
  const hoursOld = differenceInHours(
    new Date(),
    new Date(input.published_at)
  );
  const freshnessPoints = Math.max(0, 30 - (hoursOld / 72) * 30);

  const adminBoostPoints = Math.min(input.admin_boost, 100);
  const verifiedSellerPoints = input.seller_is_verified ? 5 : 0;

  return Math.round(
    (featuredPoints +
      packagePoints +
      freshnessPoints +
      adminBoostPoints +
      verifiedSellerPoints) *
      100
  ) / 100;
}
