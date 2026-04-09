import { createClient } from "@/lib/supabase/server";
import { submitPaymentSchema } from "@/lib/validations/payments";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = submitPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { ad_id, amount, method, transaction_ref, sender_name, screenshot_url } = parsed.data;

    // Verify the ad belongs to this user and is in Payment Pending status
    const { data: ad } = await supabase
      .from("ads")
      .select("id, status, title")
      .eq("id", ad_id)
      .eq("user_id", user.id)
      .single();

    if (!ad) {
      return Response.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    if (ad.status !== "Payment Pending") {
      return Response.json(
        { success: false, error: `Ad is in "${ad.status}" status. Payment only accepted in "Payment Pending" status.` },
        { status: 400 }
      );
    }

    // Check for duplicate transaction ref
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id")
      .eq("transaction_ref", transaction_ref)
      .single();

    if (existingPayment) {
      return Response.json(
        { success: false, error: "This transaction reference has already been used" },
        { status: 400 }
      );
    }

    // Create payment
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        ad_id,
        user_id: user.id,
        amount,
        method,
        transaction_ref,
        sender_name,
        screenshot_url: screenshot_url || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    // Update ad status to Payment Submitted
    await supabase
      .from("ads")
      .update({ status: "Payment Submitted" })
      .eq("id", ad_id);

    // Status history
    await supabase.from("ad_status_history").insert({
      ad_id,
      previous_status: "Payment Pending",
      new_status: "Payment Submitted",
      changed_by: user.id,
      note: `Payment submitted: ${transaction_ref}`,
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action_type: "payment_submit",
      target_type: "payment",
      target_id: payment.id,
      new_value: { amount, method, transaction_ref },
    });

    // Notify admins
    const { data: admins } = await supabase
      .from("users")
      .select("id")
      .in("role", ["admin", "super_admin"]);

    if (admins) {
      const adminNotifications = admins.map((admin) => ({
        user_id: admin.id,
        title: "New Payment Submitted",
        message: `Payment for "${ad.title}" needs verification.`,
        type: "info" as const,
        link: `/admin/payments`,
      }));
      await supabase.from("notifications").insert(adminNotifications);
    }

    return Response.json({ success: true, data: payment }, { status: 201 });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to submit payment" },
      { status: 500 }
    );
  }
}
