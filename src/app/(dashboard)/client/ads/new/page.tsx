"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateAdPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "", description: "", category_id: "", city_id: "", package_id: "",
    media_urls: [""],
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/packages").then((r) => r.json()),
    ]).then(([pkgRes]) => {
      if (pkgRes.success) setPackages(pkgRes.data);
    });
    // Fetch categories and cities using admin client (via supabase direct)
  }, []);

  function updateMediaUrl(index: number, value: string) {
    const urls = [...form.media_urls];
    urls[index] = value;
    setForm({ ...form, media_urls: urls });
  }

  function addMediaUrl() {
    if (form.media_urls.length < 10) {
      setForm({ ...form, media_urls: [...form.media_urls, ""] });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const mediaUrls = form.media_urls.filter((u) => u.trim() !== "");

    const res = await fetch("/api/client/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        category_id: form.category_id || undefined,
        city_id: form.city_id || undefined,
        package_id: form.package_id || undefined,
        media_urls: mediaUrls,
      }),
    });

    const data = await res.json();
    if (data.success) {
      router.push("/client");
      router.refresh();
    } else {
      setError(data.error || "Failed to create ad");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">Create New Ad</h1>
      <p className="text-sm text-muted mb-6">Fill in the details to create a new listing</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">{error}</div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Title *</label>
          <input
            type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Brand New MacBook Pro 16-inch" required minLength={5}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Description *</label>
          <textarea
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe your listing in detail (min 20 characters)..." required minLength={20} rows={5}
            className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
          />
        </div>

        {/* Package */}
        {packages.length > 0 && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Package</label>
            <select
              value={form.package_id} onChange={(e) => setForm({ ...form, package_id: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
            >
              <option value="">Select a package</option>
              {packages.map((pkg: any) => (
                <option key={pkg.id} value={pkg.id}>{pkg.name} — ${pkg.price} / {pkg.duration_days} days</option>
              ))}
            </select>
          </div>
        )}

        {/* Media URLs */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Media URLs</label>
          <p className="text-xs text-muted">Add image URLs or YouTube links</p>
          {form.media_urls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="url" value={url} onChange={(e) => updateMediaUrl(i, e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3.5 py-2.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
              />
              {form.media_urls.length > 1 && (
                <button type="button" onClick={() => setForm({ ...form, media_urls: form.media_urls.filter((_, j) => j !== i) })}
                  className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-colors">✗</button>
              )}
            </div>
          ))}
          {form.media_urls.length < 10 && (
            <button type="button" onClick={addMediaUrl}
              className="text-sm text-primary hover:text-primary-hover transition-colors">+ Add another URL</button>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50">
            {loading ? "Creating..." : "Create Draft"}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-6 py-2.5 rounded-lg border border-border text-sm text-muted hover:text-foreground transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
