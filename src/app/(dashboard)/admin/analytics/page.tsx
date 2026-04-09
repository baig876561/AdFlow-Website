"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/stats-card";
import { formatCurrency } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics/summary")
      .then((r) => r.json())
      .then((r) => { if (r.success) setData(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="space-y-4">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-32 rounded-xl bg-card animate-pulse" />)}</div>;
  if (!data) return <div className="text-center py-20 text-muted">Failed to load analytics</div>;

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m: any) => m.revenue), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted mt-1">Detailed marketplace insights</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Revenue" value={formatCurrency(data.totalRevenue)} color="primary" />
        <StatsCard title="Verified Payments" value={data.verifiedPayments} color="success" />
        <StatsCard title="Approval Rate" value={`${data.approvalRate}%`} color="success" />
        <StatsCard title="Rejection Rate" value={`${data.rejectionRate}%`} color="danger" />
      </div>

      {/* Monthly Revenue Chart */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-sm font-semibold mb-6">Monthly Revenue</h3>
        <div className="flex items-end gap-3 h-48">
          {data.monthlyRevenue.map((m: any) => (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] font-medium text-foreground">{formatCurrency(m.revenue)}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-primary/50 to-primary transition-all duration-500"
                style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 100)}%` }} />
              <span className="text-[10px] text-muted">{m.month.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Top Categories</h3>
          <div className="space-y-3">
            {data.adsByCategory.slice(0, 6).map((c: any) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-sm text-muted w-24 truncate">{c.name}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-hover rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (c.count / (data.totalAds || 1)) * 100)}%` }} />
                </div>
                <span className="text-xs font-medium w-6 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-4">Top Cities</h3>
          <div className="space-y-3">
            {data.adsByCity.slice(0, 6).map((c: any) => (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-sm text-muted w-24 truncate">{c.name}</span>
                <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-accent to-warning rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (c.count / (data.totalAds || 1)) * 100)}%` }} />
                </div>
                <span className="text-xs font-medium w-6 text-right">{c.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">Ads by Status</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {data.adsByStatus.map((s: any) => (
            <div key={s.status} className="text-center p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
              <p className="text-xl font-bold">{s.count}</p>
              <p className="text-[10px] text-muted truncate">{s.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
