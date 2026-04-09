"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdCard } from "@/components/ad-card";

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentCity = searchParams.get("city") || "";
  const currentSort = searchParams.get("sort") || "rank";
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    fetchAds();
    fetchFilters();
  }, [searchParams.toString()]);

  async function fetchAds() {
    setLoading(true);
    const params = new URLSearchParams();
    if (currentSearch) params.set("search", currentSearch);
    if (currentCategory) params.set("category", currentCategory);
    if (currentCity) params.set("city", currentCity);
    params.set("sort", currentSort);
    params.set("page", currentPage.toString());

    const res = await fetch(`/api/ads?${params}`);
    const data = await res.json();
    if (data.success) {
      setAds(data.data);
      setPagination(data.pagination);
    }
    setLoading(false);
  }

  async function fetchFilters() {
    const [catRes, cityRes] = await Promise.all([
      fetch("/api/categories").catch(() => null),
      fetch("/api/cities").catch(() => null),
    ]);

    // Use a simpler approach — fetch from the admin client
    // For now, we'll use placeholder data since these are public tables
  }

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== "page") params.set("page", "1");
    router.push(`/explore?${params}`);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Listings</h1>
        <p className="text-muted">Discover verified ads from trusted sellers</p>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-xl p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search ads..."
            defaultValue={currentSearch}
            onKeyDown={(e) => {
              if (e.key === "Enter") updateParams("search", (e.target as HTMLInputElement).value);
            }}
            className="flex-1 px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
          <select
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <option value="rank">Top Ranked</option>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-card" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-card rounded w-3/4" />
                <div className="h-3 bg-card rounded w-full" />
                <div className="h-3 bg-card rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : ads.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🔍</p>
          <h3 className="text-xl font-bold mb-2">No listings found</h3>
          <p className="text-muted">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {ads.map((ad) => (
            <AdCard key={ad.id} ad={ad} href={`/ads/${ad.slug}`} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => updateParams("page", page.toString())}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted hover:text-foreground hover:bg-border"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">
        Showing {ads.length} of {pagination.total} results
      </p>
    </div>
  );
}
