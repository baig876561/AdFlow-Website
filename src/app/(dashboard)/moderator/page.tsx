"use client";

import { useState, useEffect } from "react";
import { StatusBadge } from "@/components/status-badge";
import { MediaPreview } from "@/components/media-preview";

export default function ModeratorDashboard() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => { fetchQueue(); }, []);

  async function fetchQueue() {
    setLoading(true);
    const res = await fetch("/api/moderator/review-queue");
    const data = await res.json();
    if (data.success) setQueue(data.data);
    setLoading(false);
  }

  async function handleReview(adId: string, action: "approve" | "reject") {
    setActionLoading(true);
    await fetch(`/api/moderator/ads/${adId}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        moderation_notes: notes,
        rejection_reason: action === "reject" ? reason : undefined,
      }),
    });
    setSelectedAd(null);
    setNotes("");
    setReason("");
    setActionLoading(false);
    fetchQueue();
  }

  if (loading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />)}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Moderation Queue</h1>
        <p className="text-sm text-muted mt-1">{queue.length} ad(s) awaiting review</p>
      </div>

      {queue.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-3xl mb-3">✅</p>
          <p className="font-medium">Queue is empty!</p>
          <p className="text-sm text-muted">All caught up — no ads to review right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {queue.map((ad) => (
            <div key={ad.id} className="glass-card rounded-xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-card shrink-0">
                  {ad.media?.[0] ? (
                    <MediaPreview url={ad.media[0].thumbnail_url || ad.media[0].original_url} sourceType="image" alt={ad.title} aspectRatio="square" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl text-muted">📷</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold truncate">{ad.title}</h3>
                    <StatusBadge status={ad.status} />
                  </div>
                  <p className="text-xs text-muted line-clamp-2 mb-2">{ad.description}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>By: {ad.user?.name || ad.user?.email}</span>
                    <span>Category: {ad.category?.name || "—"}</span>
                    <span>City: {ad.city?.name || "—"}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAd(selectedAd?.id === ad.id ? null : ad)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary-hover transition-colors shrink-0"
                >
                  Review
                </button>
              </div>

              {/* Review panel */}
              {selectedAd?.id === ad.id && (
                <div className="mt-4 pt-4 border-t border-border space-y-3">
                  {/* Media gallery */}
                  {ad.media?.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {ad.media.map((m: any) => (
                        <MediaPreview key={m.id} url={m.original_url} sourceType={m.source_type} alt="" aspectRatio="video" />
                      ))}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Moderation Notes</label>
                    <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Internal notes..."
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium">Rejection Reason (if rejecting)</label>
                    <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason for rejection..."
                      className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleReview(ad.id, "approve")} disabled={actionLoading}
                      className="flex-1 py-2 rounded-lg bg-success text-white text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50">
                      ✓ Approve
                    </button>
                    <button onClick={() => handleReview(ad.id, "reject")} disabled={actionLoading || !reason}
                      className="flex-1 py-2 rounded-lg bg-destructive text-white text-sm font-medium hover:bg-destructive/90 transition-colors disabled:opacity-50">
                      ✗ Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
