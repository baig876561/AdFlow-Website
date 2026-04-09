"use client";

import { useEffect, useState } from "react";
import { AdCard } from "@/components/ad-card";
import { StatsCard } from "@/components/stats-card";
import { StatusBadge } from "@/components/status-badge";
import Link from "next/link";

export default function ClientDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/client/dashboard")
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}</div>;
  if (!data) return <div className="text-center py-20 text-muted">Failed to load dashboard</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Dashboard</h1>
          <p className="text-sm text-muted mt-1">Manage your listings and track performance</p>
        </div>
        <Link href="/client/ads/new" className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover transition-colors">
          + Create Ad
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Ads" value={data.summary.total} color="primary" />
        <StatsCard title="Published" value={data.summary.published} color="success" />
        <StatsCard title="Under Review" value={data.summary.underReview + data.summary.submitted} color="warning" />
        <StatsCard title="Rejected" value={data.summary.rejected} color="danger" />
      </div>

      {/* Notifications */}
      {data.notifications.filter((n: any) => !n.is_read).length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-3">🔔 Unread Notifications</h3>
          <div className="space-y-2">
            {data.notifications.filter((n: any) => !n.is_read).slice(0, 3).map((n: any) => (
              <div key={n.id} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/50">
                <span className={`mt-0.5 text-sm ${n.type === "success" ? "text-success" : n.type === "error" ? "text-destructive" : n.type === "warning" ? "text-warning" : "text-info"}`}>
                  {n.type === "success" ? "✓" : n.type === "error" ? "✗" : n.type === "warning" ? "⚠" : "ℹ"}
                </span>
                <div>
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-xs text-muted">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ads List */}
      <div>
        <h3 className="text-lg font-semibold mb-4">My Listings</h3>
        {data.ads.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center">
            <p className="text-3xl mb-3">📝</p>
            <p className="font-medium mb-1">No listings yet</p>
            <p className="text-sm text-muted mb-4">Create your first ad to get started</p>
            <Link href="/client/ads/new" className="inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
              Create Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.ads.map((ad: any) => (
              <div key={ad.id} className="glass-card rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 transition-colors">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-card shrink-0">
                  {ad.media?.[0]?.thumbnail_url ? (
                    <img src={ad.media[0].thumbnail_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl text-muted">📷</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold truncate">{ad.title}</p>
                    <StatusBadge status={ad.status} />
                  </div>
                  <p className="text-xs text-muted">
                    {ad.category?.name || "No category"} · Created {new Date(ad.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {["Draft", "Rejected"].includes(ad.status) && (
                    <Link href={`/client/ads/${ad.id}/edit`} className="px-3 py-1.5 rounded-lg bg-secondary text-xs font-medium hover:bg-border transition-colors">
                      Edit
                    </Link>
                  )}
                  {ad.status === "Draft" && (
                    <button
                      onClick={async () => {
                        await fetch(`/api/client/ads/${ad.id}`, {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ status: "Submitted" }),
                        });
                        window.location.reload();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors"
                    >
                      Submit
                    </button>
                  )}
                  {ad.status === "Payment Pending" && (
                    <Link href={`/client/ads/${ad.id}/payment`} className="px-3 py-1.5 rounded-lg bg-accent text-black text-xs font-medium hover:bg-accent/80 transition-colors">
                      Pay Now
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
