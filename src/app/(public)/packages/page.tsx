import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { PACKAGE_COLORS } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Packages" };

export default async function PackagesPage() {
  const supabase = createAdminClient();
  const { data: packages } = await supabase
    .from("packages").select("*").eq("is_active", true).order("weight");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-2">Choose Your Package</h1>
        <p className="text-muted max-w-lg mx-auto">
          Select the plan that fits your needs. All packages include expert moderation and guaranteed visibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {packages?.map((pkg) => {
          const slug = pkg.name.toLowerCase();
          const isPopular = slug === "standard";
          return (
            <div
              key={pkg.id}
              className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${isPopular ? "ring-2 ring-primary glow-primary" : ""}`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold tracking-wider uppercase">
                  Most Popular
                </span>
              )}

              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${PACKAGE_COLORS[slug] || PACKAGE_COLORS.basic} flex items-center justify-center text-white text-xl font-bold mb-4`}>
                {pkg.weight}x
              </div>

              <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
              <p className="text-4xl font-extrabold mb-1">
                {formatCurrency(pkg.price)}
              </p>
              <p className="text-sm text-muted mb-6">{pkg.duration_days} days listing</p>
              <p className="text-sm text-muted mb-6 leading-relaxed">{pkg.description}</p>

              <ul className="space-y-3 mb-8">
                <li className="text-sm flex items-center gap-2.5"><span className="text-success">✓</span> {pkg.duration_days} day listing duration</li>
                <li className="text-sm flex items-center gap-2.5"><span className="text-success">✓</span> Up to {pkg.max_images} images per ad</li>
                <li className="text-sm flex items-center gap-2.5"><span className="text-success">✓</span> {pkg.weight}x ranking weight</li>
                <li className="text-sm flex items-center gap-2.5">
                  <span className={pkg.is_featured ? "text-success" : "text-muted-foreground"}>
                    {pkg.is_featured ? "✓" : "✗"}
                  </span>
                  {pkg.is_featured ? "Featured homepage placement" : "Standard placement"}
                </li>
                <li className="text-sm flex items-center gap-2.5">
                  <span className={pkg.refresh_interval_days ? "text-success" : "text-muted-foreground"}>
                    {pkg.refresh_interval_days ? "✓" : "✗"}
                  </span>
                  {pkg.refresh_interval_days ? `Auto-refresh every ${pkg.refresh_interval_days} days` : "Manual refresh only"}
                </li>
              </ul>

              <Link
                href="/register"
                className={`block w-full text-center py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isPopular ? "bg-primary text-primary-foreground hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/25" : "bg-secondary text-foreground hover:bg-border"}`}
              >
                Get Started with {pkg.name}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
