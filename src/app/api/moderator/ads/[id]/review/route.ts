import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { reviewAdSchema } from "@/lib/validations/moderation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    const { data: userData } = await adminSupabase
      .from("users").select("role").eq("id", user.id).single();

    if (!userData || !["moderator", "admin", "super_admin"].includes(userData.role)) {
      return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = reviewAdSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { action, moderation_notes, rejection_reason } = parsed.data;

    // Fetch ad
    const { data: ad } = await supabase
      .from("ads").select("id, status, title, user_id").eq("id", id).single();

    if (!ad) {
      return Response.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    if (!["Submitted", "Under Review"].includes(ad.status)) {
      return Response.json(
        { success: false, error: `Ad is in "${ad.status}" status, cannot review` },
        { status: 400 }
      );
    }

    let newStatus: string;
    let updateData: Record<string, unknown> = {};

    if (action === "approve") {
      newStatus = "Payment Pending";
      updateData = { status: newStatus, moderation_notes: moderation_notes || null };
    } else {
      newStatus = "Rejected";
      updateData = {
        status: newStatus,
        rejection_reason: rejection_reason || "Content did not meet our guidelines.",
        moderation_notes: moderation_notes || null,
      };
    }

    const { error } = await supabase.from("ads").update(updateData).eq("id", id);
    if (error) throw error;

    // Status history
    await supabase.from("ad_status_history").insert({
      ad_id: id, previous_status: ad.status, new_status: newStatus,
      changed_by: user.id, note: action === "approve" ? "Content approved by moderator" : `Rejected: ${rejection_reason}`,
    });

    // Notify client
    await supabase.from("notifications").insert({
      user_id: ad.user_id,
      title: action === "approve" ? "Ad Approved" : "Ad Rejected",
      message: action === "approve"
        ? `Your ad "${ad.title}" has been approved. Please submit payment to proceed.`
        : `Your ad "${ad.title}" was rejected: ${rejection_reason}`,
      type: action === "approve" ? "success" : "error",
      link: `/client`,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id, action_type: `moderation_${action}`, target_type: "ad",
      target_id: id, old_value: { status: ad.status }, new_value: { status: newStatus },
    });

    return Response.json({ success: true, data: { id, status: newStatus } });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || "Failed to review ad" }, { status: 500 });
  }
}
