import { createClient } from "@/lib/supabase/server";
import { publishAdSchema } from "@/lib/validations/moderation";
import { calculateRankScore } from "@/lib/utils/ranking";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: userData } = await supabase
      .from("users").select("role").eq("id", user.id).single();

    if (!userData || !["admin", "super_admin"].includes(userData.role)) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = publishAdSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { action, publish_at, is_featured, admin_boost, rejection_reason } = parsed.data;

    // Fetch ad with package and seller profile
    const { data: ad } = await supabase
      .from("ads")
      .select("*, package:packages(duration_days, weight), seller:seller_profiles!ads_user_id_fkey(is_verified)")
      .eq("id", id)
      .single();

    if (!ad) return Response.json({ success: false, error: "Ad not found" }, { status: 404 });

    // Must have verified payment to publish
    if (action !== "reject") {
      const { data: verifiedPayment } = await supabase
        .from("payments")
        .select("id")
        .eq("ad_id", id)
        .eq("status", "verified")
        .single();

      if (!verifiedPayment) {
        return Response.json(
          { success: false, error: "No verified payment found. Cannot publish without payment verification." },
          { status: 400 }
        );
      }
    }

    if (ad.status !== "Payment Verified" && action !== "reject") {
      return Response.json(
        { success: false, error: `Ad must be in "Payment Verified" status to publish. Current: "${ad.status}"` },
        { status: 400 }
      );
    }

    let newStatus: string;
    const updateData: Record<string, unknown> = {};

    if (action === "publish") {
      newStatus = "Published";
      const now = new Date();
      const durationDays = ad.package?.duration_days || 7;
      updateData.status = "Published";
      updateData.publish_at = now.toISOString();
      updateData.expire_at = new Date(now.getTime() + durationDays * 86400000).toISOString();
      updateData.is_featured = is_featured ?? ad.is_featured;
      updateData.admin_boost = admin_boost ?? ad.admin_boost;

      // Calculate rank score
      const { data: sellerProfile } = await supabase
        .from("seller_profiles").select("is_verified").eq("user_id", ad.user_id).single();

      updateData.rank_score = calculateRankScore({
        is_featured: (is_featured ?? ad.is_featured) as boolean,
        package_weight: ad.package?.weight || 1,
        published_at: now,
        admin_boost: admin_boost ?? ad.admin_boost ?? 0,
        seller_is_verified: sellerProfile?.is_verified ?? false,
      });
    } else if (action === "schedule") {
      if (!publish_at) {
        return Response.json({ success: false, error: "publish_at is required for scheduling" }, { status: 400 });
      }
      newStatus = "Scheduled";
      const durationDays = ad.package?.duration_days || 7;
      updateData.status = "Scheduled";
      updateData.publish_at = publish_at;
      updateData.expire_at = new Date(new Date(publish_at).getTime() + durationDays * 86400000).toISOString();
      updateData.is_featured = is_featured ?? ad.is_featured;
      updateData.admin_boost = admin_boost ?? ad.admin_boost;
    } else {
      newStatus = "Rejected";
      updateData.status = "Rejected";
      updateData.rejection_reason = rejection_reason || "Rejected by admin";
    }

    const { error } = await supabase.from("ads").update(updateData).eq("id", id);
    if (error) throw error;

    // Status history
    await supabase.from("ad_status_history").insert({
      ad_id: id, previous_status: ad.status, new_status: newStatus,
      changed_by: user.id, note: `Admin action: ${action}`,
    });

    // Notify client
    const messages: Record<string, string> = {
      publish: `Your ad "${ad.title}" is now live!`,
      schedule: `Your ad "${ad.title}" has been scheduled for publication.`,
      reject: `Your ad "${ad.title}" was rejected: ${rejection_reason}`,
    };
    await supabase.from("notifications").insert({
      user_id: ad.user_id,
      title: action === "reject" ? "Ad Rejected" : action === "publish" ? "Ad Published" : "Ad Scheduled",
      message: messages[action],
      type: action === "reject" ? "error" : "success",
      link: `/client`,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id, action_type: `admin_${action}`, target_type: "ad",
      target_id: id, old_value: { status: ad.status }, new_value: updateData,
    });

    return Response.json({ success: true, data: { id, status: newStatus } });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || "Failed to process ad" }, { status: 500 });
  }
}
