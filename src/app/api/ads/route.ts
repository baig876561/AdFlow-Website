import { createAdminClient } from "@/lib/supabase/admin";
import { type NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    const searchParams = request.nextUrl.searchParams;

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const city = searchParams.get("city") || "";
    const sort = searchParams.get("sort") || "rank";
    const offset = (page - 1) * limit;

    // Build query — only published ads with valid expiry
    let query = supabase
      .from("ads")
      .select(
        `*, category:categories(*), city:cities(*), package:packages(*), media:ad_media(*)`,
        { count: "exact" }
      )
      .eq("status", "Published");

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }
    // Category filter
    if (category) {
      query = query.eq("category.slug", category);
    }
    // City filter
    if (city) {
      query = query.eq("city.slug", city);
    }

    // Sorting
    switch (sort) {
      case "newest":
        query = query.order("publish_at", { ascending: false, nullsFirst: false });
        break;
      case "oldest":
        query = query.order("publish_at", { ascending: true, nullsFirst: false });
        break;
      case "rank":
      default:
        query = query.order("rank_score", { ascending: false });
        break;
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;

    return Response.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch ads" },
      { status: 500 }
    );
  }
}
