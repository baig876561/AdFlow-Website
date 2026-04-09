import { createAdminClient } from "@/lib/supabase/admin";
import { MediaPreview } from "@/components/media-preview";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, formatCurrency } from "@/lib/utils";
import { PACKAGE_COLORS } from "@/lib/constants";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: ad } = await supabase
    .from("ads")
    .select(`*, category:categories(*), city:cities(*), package:packages(*), media:ad_media(*), user:users(id, name, avatar_url)`)
    .eq("slug", slug)
    .eq("status", "Published")
    .single();

  if (!ad) notFound();

  const { data: sellerProfile } = await supabase
    .from("seller_profiles")
    .select("*")
    .eq("user_id", ad.user_id)
    .single();

  const sortedMedia = (ad.media || []).sort((a: any, b: any) => a.display_order - b.display_order);
  const packageSlug = ad.package?.name?.toLowerCase() || "basic";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/explore" className="inline-flex items-center gap-1 text-sm text-muted hover:text-primary transition-colors mb-6">
        ← Back to listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Media */}
          {sortedMedia.length > 0 && (
            <div className="space-y-3">
              <MediaPreview
                url={sortedMedia[0].original_url}
                sourceType={sortedMedia[0].source_type}
                alt={ad.title}
                className="rounded-2xl"
              />
              {sortedMedia.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {sortedMedia.slice(1, 4).map((m: any) => (
                    <MediaPreview
                      key={m.id}
                      url={m.thumbnail_url || m.original_url}
                      sourceType="image"
                      alt={ad.title}
                      aspectRatio="square"
                      className="rounded-xl"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title & Meta */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{ad.title}</h1>
              {ad.is_featured && (
                <span className="shrink-0 px-3 py-1 rounded-full text-xs font-bold text-black bg-accent">
                  ★ Featured
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              {ad.category && <span className="px-2 py-0.5 rounded bg-secondary">{ad.category.name}</span>}
              {ad.city && <span className="px-2 py-0.5 rounded bg-secondary">📍 {ad.city.name}</span>}
              <span>Published {formatDate(ad.publish_at || ad.created_at)}</span>
              {ad.expire_at && <span>· Expires {formatDate(ad.expire_at)}</span>}
            </div>
          </div>

          {/* Description */}
          <div className="glass-card rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-sm text-muted leading-relaxed whitespace-pre-line">{ad.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Package Badge */}
          {ad.package && (
            <div className={`rounded-xl p-5 bg-gradient-to-br ${PACKAGE_COLORS[packageSlug] || PACKAGE_COLORS.basic} text-white`}>
              <p className="text-xs font-bold tracking-wider uppercase mb-1">{ad.package.name} Package</p>
              <p className="text-2xl font-extrabold">{formatCurrency(ad.package.price)}</p>
              <p className="text-xs opacity-80 mt-1">{ad.package.duration_days} day listing</p>
            </div>
          )}

          {/* Seller Info */}
          <div className="glass-card rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-3">Seller Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-sm">
                  {(sellerProfile?.display_name || ad.user?.name || "U")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{sellerProfile?.display_name || ad.user?.name}</p>
                  {sellerProfile?.is_verified && (
                    <span className="text-[10px] text-success font-medium">✓ Verified Seller</span>
                  )}
                </div>
              </div>
              {sellerProfile?.business_name && (
                <p className="text-xs text-muted">🏪 {sellerProfile.business_name}</p>
              )}
              {sellerProfile?.city && (
                <p className="text-xs text-muted">📍 {sellerProfile.city}</p>
              )}
            </div>
          </div>

          {/* Report */}
          <button className="w-full py-2.5 rounded-lg border border-border text-sm text-muted hover:text-destructive hover:border-destructive/30 transition-colors">
            🚩 Report this ad
          </button>
        </div>
      </div>
    </div>
  );
}
