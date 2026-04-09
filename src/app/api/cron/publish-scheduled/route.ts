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
    // Find ads that are Scheduled and publish_at <= now
    const { data: ads, error } = await supabase
      .from("ads")
      .update({ status: "Published" })
      .eq("status", "Scheduled")
      .lte("publish_at", new Date().toISOString())
      .select("id, title");

    if (error) throw error;

    const publishedCount = ads?.length || 0;

    // Log status history for each published ad
    if (ads && ads.length > 0) {
      for (const ad of ads) {
        await supabase.from("ad_status_history").insert({
          ad_id: ad.id,
          previous_status: "Scheduled",
          new_status: "Published",
          note: "Auto-published by cron job",
        });
      }
    }

    const responseMs = Date.now() - startTime;

    // Log to system_health_logs
    await supabase.from("system_health_logs").insert({
      source: "cron:publish-scheduled",
      status: "ok",
      response_ms: responseMs,
      message: `Published ${publishedCount} ad(s).`,
    });

    return Response.json({
      success: true,
      published: publishedCount,
      ads: ads?.map((a) => a.title) || [],
      duration_ms: responseMs,
    });
  } catch (err: any) {
    const responseMs = Date.now() - startTime;

    await supabase.from("system_health_logs").insert({
      source: "cron:publish-scheduled",
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
