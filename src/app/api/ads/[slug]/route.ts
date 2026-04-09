import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("ads")
      .select(
        `*, category:categories(*), city:cities(*), package:packages(*), media:ad_media(*), user:users(id, name, avatar_url), seller_profile:seller_profiles!ads_user_id_fkey(*)`
      )
      .eq("slug", slug)
      .eq("status", "Published")
      .single();

    if (error || !data) {
      return Response.json(
        { success: false, error: "Ad not found" },
        { status: 404 }
      );
    }

    // Fetch seller profile separately via user_id
    const { data: sellerProfile } = await supabase
      .from("seller_profiles")
      .select("*")
      .eq("user_id", data.user_id)
      .single();

    return Response.json({
      success: true,
      data: { ...data, seller_profile: sellerProfile },
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch ad" },
      { status: 500 }
    );
  }
}
