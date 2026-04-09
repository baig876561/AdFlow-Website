"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PayNowPage() {
  const router = useRouter();
  const params = useParams();
  const adId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [ad, setAd] = useState<any>(null);

  const [form, setForm] = useState({
    method: "bank_transfer",
    transaction_ref: "",
    sender_name: "",
    screenshot_url: "",
  });

  useEffect(() => {
    if (!adId) return;

    fetch(`/api/client/ads/${adId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data.status === "Payment Pending") {
          setAd(res.data);
        } else {
          setError(res.error || "Ad is not eligible for payment at this time.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load ad details.");
        setLoading(false);
      });
  }, [adId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const res = await fetch(`/api/client/ads/${adId}/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: ad.package?.price || 0,
      }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/client");
      router.refresh();
    } else {
      setError(data.error || "Failed to submit payment.");
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="p-10 text-center animate-pulse text-muted">Loading payment details...</div>;
  }

  if (error && !ad) {
    return (
      <div className="max-w-xl mx-auto text-center p-10 glass-card rounded-xl">
        <p className="text-3xl mb-4">⚠️</p>
        <p className="text-destructive font-medium mb-4">{error}</p>
        <button onClick={() => router.push("/client")} className="px-6 py-2 rounded-lg bg-secondary text-sm">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Submit Payment</h1>
      <p className="text-sm text-muted mb-8">Complete your payment to get your ad published.</p>

      <div className="glass-card rounded-xl p-6 mb-8">
        <h2 className="text-sm font-semibold text-muted mb-4">ORDER SUMMARY</h2>
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">{ad.title}</span>
          <span className="font-bold">${ad.package?.price || "0.00"}</span>
        </div>
        <p className="text-xs text-muted mb-4">Package: {ad.package?.name}</p>
        <div className="border-t border-border pt-4 flex justify-between items-center">
          <span className="font-semibold">Total Amount Due:</span>
          <span className="text-xl font-bold text-primary">${ad.package?.price || "0.00"}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Payment Method *</label>
          <select
            value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} required
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          >
            <option value="bank_transfer">Bank Transfer</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="card">Credit / Debit Card</option>
            <option value="crypto">Cryptocurrency</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Sender Name / Account Holder *</label>
          <input
            type="text" value={form.sender_name} onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
            placeholder="Name exactly as it appears on your payment account" required
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Transaction Reference / Receipt ID *</label>
          <input
            type="text" value={form.transaction_ref} onChange={(e) => setForm({ ...form, transaction_ref: e.target.value })}
            placeholder="e.g. TXN-98247294" required
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Screenshot URL (Optional)</label>
          <input
            type="url" value={form.screenshot_url} onChange={(e) => setForm({ ...form, screenshot_url: e.target.value })}
            placeholder="https://..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
          <p className="text-xs text-muted">Provide a link to a screenshot of your successful transaction receipt.</p>
        </div>

        <div className="flex gap-3 pt-6">
          <button type="submit" disabled={submitting}
            className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary-hover transition-colors disabled:opacity-50">
            {submitting ? "Submitting..." : "Confirm Payment"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-3 rounded-xl border border-border text-muted font-medium hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
