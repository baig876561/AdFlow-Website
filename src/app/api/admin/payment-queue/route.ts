import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users").select("role").eq("id", user.id).single();

    if (!userData || !["admin", "super_admin"].includes(userData.role)) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("payments")
      .select(`*, ad:ads(id, title, slug, status, user_id, user:users(name, email))`)
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) throw error;

    return Response.json({ success: true, data: data || [] });
  } catch {
    return Response.json({ success: false, error: "Failed to fetch payment queue" }, { status: 500 });
  }
}
