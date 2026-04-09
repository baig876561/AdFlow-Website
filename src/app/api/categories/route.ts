import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories").select("*").eq("is_active", true).order("name");

    if (error) throw error;
    return Response.json({ success: true, data: data || [] });
  } catch {
    return Response.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}
