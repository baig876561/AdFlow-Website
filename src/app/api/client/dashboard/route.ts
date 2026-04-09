import { createClient } from "@/lib/supabase/server";

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

    // Fetch all user data in parallel
    const [adsResult, paymentsResult, notificationsResult, profileResult] =
      await Promise.all([
        supabase
          .from("ads")
          .select(`*, category:categories(name), package:packages(name, badge_color), media:ad_media(thumbnail_url, display_order)`)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("payments")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(20),
        supabase
          .from("seller_profiles")
          .select("*")
          .eq("user_id", user.id)
          .single(),
      ]);

    const ads = adsResult.data || [];
    const summary = {
      total: ads.length,
      draft: ads.filter((a) => a.status === "Draft").length,
      submitted: ads.filter((a) => a.status === "Submitted").length,
      underReview: ads.filter((a) => a.status === "Under Review").length,
      paymentPending: ads.filter((a) => a.status === "Payment Pending").length,
      published: ads.filter((a) => a.status === "Published").length,
      expired: ads.filter((a) => a.status === "Expired").length,
      rejected: ads.filter((a) => a.status === "Rejected").length,
    };

    return Response.json({
      success: true,
      data: {
        ads,
        payments: paymentsResult.data || [],
        notifications: notificationsResult.data || [],
        profile: profileResult.data || null,
        summary,
      },
    });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
