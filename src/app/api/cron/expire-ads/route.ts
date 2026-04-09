import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  // Verify cron secret via header or query param
  const secret =
    request.headers.get("x-cron-secret") ||
    request.nextUrl.searchParams.get("key");

  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startTime = Date.now();
  const supabase = createAdminClient();

  try {
    // Find ads that are Published and expire_at < now
    const { data: ads, error } = await supabase
      .from("ads")
      .update({ status: "Expired" })
      .eq("status", "Published")
      .lt("expire_at", new Date().toISOString())
      .not("expire_at", "is", null)
      .select("id, title, user_id");

    if (error) throw error;

    const expiredCount = ads?.length || 0;

    // Log status history & notify owners
    if (ads && ads.length > 0) {
      for (const ad of ads) {
        await supabase.from("ad_status_history").insert({
          ad_id: ad.id,
          previous_status: "Published",
          new_status: "Expired",
          note: "Auto-expired by cron job",
        });

        await supabase.from("notifications").insert({
          user_id: ad.user_id,
          title: "Ad Expired",
          message: `Your ad "${ad.title}" has expired. Consider renewing your listing.`,
          type: "warning",
          link: `/client/ads/${ad.id}`,
        });
      }
    }

    const responseMs = Date.now() - startTime;

    await supabase.from("system_health_logs").insert({
      source: "cron:expire-ads",
      status: "ok",
      response_ms: responseMs,
      message: `Expired ${expiredCount} ad(s).`,
    });

    return Response.json({
      success: true,
      expired: expiredCount,
      ads: ads?.map((a) => a.title) || [],
      duration_ms: responseMs,
    });
  } catch (err: any) {
    const responseMs = Date.now() - startTime;

    await supabase.from("system_health_logs").insert({
      source: "cron:expire-ads",
      status: "error",
      response_ms: responseMs,
      message: err.message,
    });

    return Response.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
