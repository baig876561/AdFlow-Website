import { createClient } from "@/lib/supabase/server";
import { createAdSchema } from "@/lib/validations/ads";
import { normalizeMedia } from "@/lib/utils/media";
import { slugify } from "@/lib/utils";

// GET — list own ads (client dashboard)
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("ads")
      .select(`*, category:categories(*), city:cities(*), package:packages(*), media:ad_media(*)`)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return Response.json({ success: true, data: data || [] });
  } catch {
    return Response.json({ success: false, error: "Failed to fetch ads" }, { status: 500 });
  }
}

// POST — create new ad draft
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
    const parsed = createAdSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, description, category_id, city_id, package_id, media_urls } = parsed.data;
    const slug = slugify(title) + "-" + Date.now().toString(36);

    // Create ad
    const { data: ad, error } = await supabase
      .from("ads")
      .insert({
        user_id: user.id,
        title,
        slug,
        description,
        category_id: category_id || null,
        city_id: city_id || null,
        package_id: package_id || null,
        status: "Draft",
      })
      .select()
      .single();

    if (error) throw error;

    // Process media URLs
    if (media_urls && media_urls.length > 0) {
      const mediaEntries = media_urls.map((url, index) => {
        const normalized = normalizeMedia(url);
        return {
          ad_id: ad.id,
          source_type: normalized.source_type,
          original_url: normalized.original_url,
          thumbnail_url: normalized.thumbnail_url,
          validation_status: normalized.validation_status,
          display_order: index,
        };
      });

      await supabase.from("ad_media").insert(mediaEntries);
    }

    // Status history
    await supabase.from("ad_status_history").insert({
      ad_id: ad.id,
      previous_status: null,
      new_status: "Draft",
      changed_by: user.id,
      note: "Ad created",
    });

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action_type: "create",
      target_type: "ad",
      target_id: ad.id,
      new_value: { title, status: "Draft" },
    });

    return Response.json({ success: true, data: ad }, { status: 201 });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to create ad" },
      { status: 500 }
    );
  }
}
