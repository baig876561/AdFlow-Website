"use client";

import Link from "next/link";
import { MediaPreview } from "@/components/media-preview";
import { StatusBadge } from "@/components/status-badge";
import { formatDate, truncate } from "@/lib/utils";
import { PACKAGE_COLORS } from "@/lib/constants";

interface AdCardProps {
  ad: {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: string;
    is_featured: boolean;
    publish_at: string | null;
    expire_at: string | null;
    created_at: string;
    category?: { name: string } | null;
    city?: { name: string } | null;
    package?: { name: string; badge_color: string } | null;
    media?: { thumbnail_url: string | null; source_type: string; display_order: number }[];
  };
  showStatus?: boolean;
  href?: string;
}

export function AdCard({ ad, showStatus = false, href }: AdCardProps) {
  const thumbnail =
    ad.media?.sort((a, b) => a.display_order - b.display_order)[0]?.thumbnail_url || null;
  const packageSlug = ad.package?.name?.toLowerCase() || "basic";

  const CardWrapper = href ? Link : "div";
  const linkProps = href ? { href } : {};

  return (
    <CardWrapper
      {...(linkProps as any)}
      className="group glass-card rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 flex flex-col"
    >
      {/* Image */}
      <div className="relative">
        <MediaPreview
          url={thumbnail || ""}
          sourceType="image"
          alt={ad.title}
          aspectRatio="video"
        />
        {/* Package badge */}
        {ad.package && (
          <span
            className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white bg-gradient-to-r ${PACKAGE_COLORS[packageSlug] || PACKAGE_COLORS.basic}`}
          >
            {ad.package.name}
          </span>
        )}
        {/* Featured badge */}
        {ad.is_featured && (
          <span className="absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-black bg-accent">
            ★ Featured
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {ad.title}
          </h3>
          {showStatus && <StatusBadge status={ad.status} />}
        </div>

        <p className="text-xs text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
          {truncate(ad.description, 100)}
        </p>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            {ad.category && (
              <span className="text-primary/70">{ad.category.name}</span>
            )}
            {ad.category && ad.city && <span>·</span>}
            {ad.city && <span>{ad.city.name}</span>}
          </div>
          <span>{formatDate(ad.publish_at || ad.created_at)}</span>
        </div>
      </div>
    </CardWrapper>
  );
}
