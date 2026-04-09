import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { amount, method, transaction_ref, sender_name, screenshot_url } = body;

    if (!method || !transaction_ref || !sender_name) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Ensure ad is Payment Pending and belongs to user
    const { data: ad, error: adError } = await supabase
      .from("ads")
      .select("id, status, package_id")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (adError || !ad) {
      return Response.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    if (ad.status !== "Payment Pending") {
      return Response.json({ success: false, error: "Ad must be in Payment Pending status" }, { status: 400 });
    }

    // Insert payment
    const { error: paymentError } = await supabase.from("payments").insert({
      ad_id: id,
      user_id: user.id,
      amount: Number(amount) || 0,
      method,
      transaction_ref,
      sender_name,
      screenshot_url: screenshot_url || null,
      status: "pending"
    });

    if (paymentError) throw paymentError;

    // Change status to Payment Submitted
    await supabase.from("ads").update({ status: "Payment Submitted" }).eq("id", id);
    
    await supabase.from("ad_status_history").insert({
      ad_id: id,
      previous_status: "Payment Pending",
      new_status: "Payment Submitted",
      changed_by: user.id,
      note: "Payment submitted by client"
    });

    return Response.json({ success: true });
  } catch (err: any) {
    return Response.json({ success: false, error: err.message || "Failed to submit payment" }, { status: 500 });
  }
}
