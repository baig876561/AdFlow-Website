import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdCard } from "@/components/ad-card";

export default async function HomePage() {
  const supabase = createAdminClient();

  // Fetch featured/published ads
  const { data: featuredAds } = await supabase
    .from("ads")
    .select(`*, category:categories(name), city:cities(name), package:packages(name, badge_color), media:ad_media(thumbnail_url, source_type, display_order)`)
    .eq("status", "Published")
    .eq("is_featured", true)
    .order("rank_score", { ascending: false })
    .limit(3);

  const { data: recentAds } = await supabase
    .from("ads")
    .select(`*, category:categories(name), city:cities(name), package:packages(name, badge_color), media:ad_media(thumbnail_url, source_type, display_order)`)
    .eq("status", "Published")
    .order("publish_at", { ascending: false })
    .limit(6);

  const { data: packages } = await supabase
    .from("packages").select("*").eq("is_active", true).order("weight");

  // Random question
  const { data: questions } = await supabase
    .from("learning_questions").select("*").eq("is_active", true);
  const question = questions?.[Math.floor(Math.random() * (questions?.length || 1))];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Trusted Marketplace
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Sell Smarter with{" "}
              <span className="gradient-text">AdFlow Pro</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted leading-relaxed mb-10">
              The advanced moderated ads marketplace. Submit your listings, get reviewed by our expert team, and reach thousands of verified buyers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 text-center"
              >
                Start Selling Free
              </Link>
              <Link
                href="/explore"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary transition-colors text-center"
              >
                Browse Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-y border-border/50 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "500+", label: "Active Listings" },
              { value: "99.9%", label: "Uptime" },
              { value: "24h", label: "Review Time" },
              { value: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-xs text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Ads */}
      {featuredAds && featuredAds.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">⭐ Featured Listings</h2>
              <p className="text-sm text-muted mt-1">Premium ads hand-picked for quality</p>
            </div>
            <Link href="/explore" className="text-sm text-primary hover:text-primary-hover transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {featuredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} href={`/ads/${ad.slug}`} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Ads */}
      {recentAds && recentAds.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">🆕 Recent Listings</h2>
              <p className="text-sm text-muted mt-1">Fresh ads just posted</p>
            </div>
            <Link href="/explore" className="text-sm text-primary hover:text-primary-hover transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
            {recentAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} href={`/ads/${ad.slug}`} />
            ))}
          </div>
        </section>
      )}

      {/* Packages */}
      {packages && packages.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-2">📦 Choose Your Package</h2>
            <p className="text-sm text-muted">Flexible plans to match your selling goals</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg: any) => {
              const isPopular = pkg.slug === "standard";
              return (
                <div
                  key={pkg.id}
                  className={`relative glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] ${isPopular ? "ring-2 ring-primary glow-primary" : ""}`}
                >
                  {isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold tracking-wider uppercase">
                      Most Popular
                    </span>
                  )}
                  <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                  <p className="text-4xl font-extrabold mb-4">
                    ${pkg.price}
                    <span className="text-sm text-muted font-normal">/{pkg.duration_days} days</span>
                  </p>
                  <p className="text-sm text-muted mb-6">{pkg.description}</p>
                  <ul className="space-y-2 mb-6">
                    <li className="text-sm flex items-center gap-2"><span className="text-success">✓</span> {pkg.duration_days} days listing</li>
                    <li className="text-sm flex items-center gap-2"><span className="text-success">✓</span> Up to {pkg.max_images} images</li>
                    <li className="text-sm flex items-center gap-2"><span className="text-success">✓</span> {pkg.is_featured ? "Featured placement" : "Standard placement"}</li>
                    {pkg.refresh_interval_days && (
                      <li className="text-sm flex items-center gap-2"><span className="text-success">✓</span> Auto-refresh every {pkg.refresh_interval_days} days</li>
                    )}
                  </ul>
                  <Link
                    href="/register"
                    className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${isPopular ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "bg-secondary text-foreground hover:bg-border"}`}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Learning Question Widget */}
      {question && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 border-t border-border/50">
          <div className="max-w-2xl mx-auto glass-card rounded-2xl p-8 text-center">
            <span className="text-3xl mb-4 block">🧠</span>
            <h3 className="text-lg font-bold mb-3">Did You Know?</h3>
            <p className="text-sm text-primary font-medium mb-2">{question.question}</p>
            <p className="text-sm text-muted">{question.answer}</p>
            <span className="inline-block mt-3 px-2 py-0.5 rounded-full bg-secondary text-[10px] text-muted uppercase tracking-wider">
              {question.topic} · {question.difficulty}
            </span>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 border-t border-border/50">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-card to-accent/20 p-10 sm:p-16 text-center">
          <div className="absolute top-0 left-1/4 w-40 h-40 bg-primary/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-accent/20 rounded-full blur-[80px]" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ready to reach more buyers?</h2>
            <p className="text-muted mb-8 max-w-lg mx-auto">
              Join thousands of sellers on AdFlow Pro. Create your listing in minutes and start selling today.
            </p>
            <Link
              href="/register"
              className="inline-flex px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary-hover transition-all duration-300 hover:shadow-lg hover:shadow-primary/25"
            >
              Create Your First Ad
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
