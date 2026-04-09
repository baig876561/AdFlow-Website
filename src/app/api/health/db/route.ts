import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  const supabase = createAdminClient();

  try {
    // Simple query to check DB connectivity
    const { error } = await supabase
      .from("system_health_logs")
      .select("id")
      .limit(1);

    const responseMs = Date.now() - startTime;

    if (error) throw error;

    await supabase.from("system_health_logs").insert({
      source: "db:heartbeat",
      status: "ok",
      response_ms: responseMs,
      message: "Database connection healthy.",
    });

    return Response.json({
      success: true,
      status: "ok",
      response_ms: responseMs,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    const responseMs = Date.now() - startTime;
    return Response.json(
      {
        success: false,
        status: "error",
        response_ms: responseMs,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
