import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return Response.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    // Fetch user role using admin client to bypass RLS (since cookies aren't fully flushed yet for the auth client)
    const adminSupabase = createAdminClient();
    const { data: userData } = await adminSupabase
      .from("users")
      .select("role, name, status")
      .eq("id", data.user.id)
      .single();

    if (userData?.status === "banned" || userData?.status === "suspended") {
      await supabase.auth.signOut();
      return Response.json(
        { success: false, error: "Your account has been suspended" },
        { status: 403 }
      );
    }

    return Response.json({
      success: true,
      data: {
        user: data.user,
        role: userData?.role || "client",
        name: userData?.name || "",
      },
    });
  } catch {
    return Response.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
