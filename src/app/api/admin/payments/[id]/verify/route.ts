import { createClient } from "@/lib/supabase/server";
import { verifyPaymentSchema } from "@/lib/validations/payments";

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
    const parsed = verifyPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { status, admin_note } = parsed.data;

    // Fetch payment + ad
    const { data: payment } = await supabase
      .from("payments").select("*, ad:ads(id, status, title, user_id)").eq("id", id).single();

    if (!payment) return Response.json({ success: false, error: "Payment not found" }, { status: 404 });

    // Update payment
    const { error } = await supabase

      .from("payments")
      .update({
        status,
        admin_note: admin_note || null,
        verified_by: user.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) throw error;

    // Update ad status
    const newAdStatus = status === "verified" ? "Payment Verified" : "Rejected";
    await supabase.from("ads").update({ status: newAdStatus }).eq("id", payment.ad_id);

    // Status history
    await supabase.from("ad_status_history").insert({
      ad_id: payment.ad_id,
      previous_status: "Payment Submitted",
      new_status: newAdStatus,
      changed_by: user.id,
      note: status === "verified" ? "Payment verified by admin" : `Payment rejected: ${admin_note}`,
    });

    // Notify client
    await supabase.from("notifications").insert({
      user_id: payment.user_id,
      title: status === "verified" ? "Payment Verified" : "Payment Rejected",
      message: status === "verified"
        ? `Payment for "${payment.ad?.title}" has been verified. Your ad will be published soon.`
        : `Payment for "${payment.ad?.title}" was rejected: ${admin_note}`,
      type: status === "verified" ? "success" : "error",
      link: `/client`,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id, action_type: `payment_${status}`, target_type: "payment",
      target_id: id, new_value: { status, admin_note },
    });

    return Response.json({ success: true, data: { id, status, ad_status: newAdStatus } });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || "Failed to verify payment" }, { status: 500 });
  }
}
