import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const metadata = { title: "Cities" };

export default async function CitiesPage() {
  const supabase = createAdminClient();
  const { data: cities } = await supabase
    .from("cities").select("*").eq("is_active", true).order("name");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse by City</h1>
      <p className="text-muted mb-8">Discover local listings near you</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 stagger-children">
        {cities?.map((city) => (
          <Link
            key={city.id} href={`/explore?city=${city.slug}`}
            className="glass-card rounded-xl p-5 text-center hover:scale-[1.03] transition-all duration-300 hover:border-primary/30 group"
          >
            <span className="text-3xl block mb-2">📍</span>
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{city.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
