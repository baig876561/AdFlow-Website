import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";

export const metadata = { title: "Categories" };

export default async function CategoriesPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from("categories").select("*").eq("is_active", true).order("name");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse by Category</h1>
      <p className="text-muted mb-8">Find exactly what you&apos;re looking for</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 stagger-children">
        {categories?.map((cat) => (
          <Link
            key={cat.id} href={`/explore?category=${cat.slug}`}
            className="glass-card rounded-xl p-5 text-center hover:scale-[1.03] transition-all duration-300 hover:border-primary/30 group"
          >
            <span className="text-3xl block mb-2">{cat.icon || "📁"}</span>
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{cat.name}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
