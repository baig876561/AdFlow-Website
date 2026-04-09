"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/status-badge";

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [noteMap, setNoteMap] = useState<Record<string, string>>({});

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    setLoading(true);
    const res = await fetch("/api/admin/payment-queue");
    const data = await res.json();
    if (data.success) setPayments(data.data);
    setLoading(false);
  }

  async function handleVerify(paymentId: string, status: "verified" | "rejected") {
    setActionLoading(paymentId);
    await fetch(`/api/admin/payments/${paymentId}/verify`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, admin_note: noteMap[paymentId] || "" }),
    });
    setActionLoading(null);
    fetchPayments();
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-card animate-pulse" />)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Payment Verification</h1>
        <p className="text-sm text-muted mt-1">{payments.length} pending payment(s)</p>
      </div>

      {payments.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-medium">No pending payments</p>
          <p className="text-sm text-muted">All payments have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold">{p.ad?.title || "Unknown Ad"}</p>
                  <p className="text-xs text-muted">By: {p.ad?.user?.name || p.ad?.user?.email} · {formatDate(p.created_at)}</p>
                </div>
                <span className="text-lg font-bold text-primary">{formatCurrency(p.amount)}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-0.5">Method</p>
                  <p className="font-medium capitalize">{p.method.replace("_", " ")}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-0.5">Reference</p>
                  <p className="font-medium font-mono">{p.transaction_ref}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-0.5">Sender</p>
                  <p className="font-medium">{p.sender_name}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-muted-foreground mb-0.5">Screenshot</p>
                  {p.screenshot_url ? (
                    <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">View</a>
                  ) : <p className="font-medium text-muted">None</p>}
                </div>
              </div>
              <div className="space-y-2">
                <input
                  value={noteMap[p.id] || ""}
                  onChange={(e) => setNoteMap({ ...noteMap, [p.id]: e.target.value })}
                  placeholder="Admin note (optional)..."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(p.id, "verified")} disabled={actionLoading === p.id}
                    className="flex-1 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50">
                    ✓ Verify Payment
                  </button>
                  <button onClick={() => handleVerify(p.id, "rejected")} disabled={actionLoading === p.id}
                    className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">
                    ✗ Reject Payment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
