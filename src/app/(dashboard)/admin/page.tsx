"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/stats-card";
import Link from "next/link";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics/summary")
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-24 rounded-xl bg-card animate-pulse" />)}</div>;
  if (!data) return <div className="text-center py-20 text-muted">Failed to load dashboard</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted mt-1">Overview of your marketplace</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatsCard title="Total Ads" value={data.totalAds} color="primary" />
        <StatsCard title="Active (Published)" value={data.activeAds} color="success" />
        <StatsCard title="Pending Reviews" value={data.pendingReviews} color="warning" />
        <StatsCard title="Total Revenue" value={`$${data.totalRevenue.toFixed(2)}`} color="primary" subtitle={`${data.verifiedPayments} verified payments`} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/payments" className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all group">
          <p className="text-2xl mb-2">💳</p>
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">Payment Queue</p>
          <p className="text-xs text-muted">Verify pending payments</p>
        </Link>
        <Link href="/admin/analytics" className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all group">
          <p className="text-2xl mb-2">📈</p>
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">Analytics</p>
          <p className="text-xs text-muted">View detailed stats</p>
        </Link>
        <Link href="/admin/health" className="glass-card rounded-xl p-5 hover:border-primary/20 transition-all group">
          <p className="text-2xl mb-2">💓</p>
          <p className="text-sm font-semibold group-hover:text-primary transition-colors">System Health</p>
          <p className="text-xs text-muted">Monitor cron jobs</p>
        </Link>
      </div>

      {/* Status Distribution */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Ads by Status</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.adsByStatus.map((s: any) => (
            <div key={s.status} className="text-center p-3 rounded-lg bg-secondary/50">
              <p className="text-lg font-bold">{s.count}</p>
              <p className="text-[10px] text-muted truncate">{s.status}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category + City Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Ads by Category</h3>
          <div className="space-y-2">
            {data.adsByCategory.slice(0, 5).map((c: any) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="text-sm text-muted">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(100, (c.count / (data.totalAds || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Ads by City</h3>
          <div className="space-y-2">
            {data.adsByCity.slice(0, 5).map((c: any) => (
              <div key={c.name} className="flex items-center justify-between">
                <span className="text-sm text-muted">{c.name}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${Math.min(100, (c.count / (data.totalAds || 1)) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-medium w-6 text-right">{c.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
