import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Check role
    const adminSupabase = createAdminClient();
    const { data: userData } = await adminSupabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!userData || !["moderator", "admin", "super_admin"].includes(userData.role)) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    // Get ads in Submitted and Under Review status
    const { data, error } = await supabase
      .from("ads")
      .select(
        `*, user:users(name, email), category:categories(name), city:cities(name), package:packages(name), media:ad_media(*)`
      )
      .in("status", ["Submitted", "Under Review"])
      .order("created_at", { ascending: true });

    if (error) throw error;

    return Response.json({ success: true, data: data || [] });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch review queue" },
      { status: 500 }
    );
  }
}
