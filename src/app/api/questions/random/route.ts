import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createAdminClient();

    // Get a random active question
    const { data, error } = await supabase
      .from("learning_questions")
      .select("*")
      .eq("is_active", true);

    if (error) throw error;

    if (!data || data.length === 0) {
      return Response.json({
        success: true,
        data: null,
        message: "No questions available",
      });
    }

    const randomIndex = Math.floor(Math.random() * data.length);
    return Response.json({ success: true, data: data[randomIndex] });
  } catch {
    return Response.json(
      { success: false, error: "Failed to fetch question" },
      { status: 500 }
    );
  }
}
