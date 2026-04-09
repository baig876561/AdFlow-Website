"use client";

import { useEffect, useState } from "react";

export default function AdminHealthPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState<any>(null);

  useEffect(() => {
    // Fetch health logs from analytics
    fetch("/api/admin/analytics/summary")
      .then((r) => r.json())
      .then((r) => { if (r.success) setLogs(r.data.healthLogs || []); setLoading(false); })
      .catch(() => setLoading(false));

    // Ping DB
    fetch("/api/health/db")
      .then((r) => r.json())
      .then(setDbStatus);
  }, []);

  function triggerCron(type: "publish" | "expire") {
    const url = type === "publish" ? "/api/cron/publish-scheduled" : "/api/cron/expire-ads";
    fetch(url, { headers: { "x-cron-secret": "your-cron-secret-here-change-this" } })
      .then((r) => r.json())
      .then((data) => {
        alert(JSON.stringify(data, null, 2));
        window.location.reload();
      });
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 rounded-xl bg-card animate-pulse" />)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">System Health</h1>
        <p className="text-sm text-muted mt-1">Monitor cron jobs and database health</p>
      </div>

      {/* Live Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className={`inline-flex h-3 w-3 rounded-full ${dbStatus?.success ? "bg-success animate-pulse" : "bg-destructive"}`} />
            <h3 className="text-sm font-semibold">Database</h3>
          </div>
          <p className="text-xs text-muted">
            Status: <span className={dbStatus?.success ? "text-success" : "text-destructive"}>{dbStatus?.status || "checking..."}</span>
          </p>
          {dbStatus?.response_ms && (
            <p className="text-xs text-muted">Response: {dbStatus.response_ms}ms</p>
          )}
        </div>
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-sm font-semibold mb-3">Manual Cron Triggers</h3>
          <div className="flex gap-2">
            <button onClick={() => triggerCron("publish")}
              className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors">
              ▶ Publish Scheduled
            </button>
            <button onClick={() => triggerCron("expire")}
              className="flex-1 py-2 rounded-lg bg-accent text-black text-xs font-medium hover:bg-accent/80 transition-colors">
              ▶ Expire Ads
            </button>
          </div>
        </div>
      </div>

      {/* Health Logs (Heartbeat) */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold mb-4">💓 System Heartbeat</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted">No health logs yet. Trigger a cron job to see data.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="text-left pb-3">Source</th>
                  <th className="text-left pb-3">Status</th>
                  <th className="text-left pb-3">Response</th>
                  <th className="text-left pb-3">Message</th>
                  <th className="text-left pb-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 font-mono text-xs text-primary">{log.source}</td>
                    <td className="py-2.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs ${log.status === "ok" ? "text-success" : log.status === "error" ? "text-destructive" : "text-warning"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${log.status === "ok" ? "bg-success" : log.status === "error" ? "bg-destructive" : "bg-warning"}`} />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs text-muted">{log.response_ms}ms</td>
                    <td className="py-2.5 text-xs text-muted truncate max-w-xs">{log.message}</td>
                    <td className="py-2.5 text-xs text-muted-foreground">{new Date(log.checked_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
