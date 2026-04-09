import { createClient } from "@/lib/supabase/server";
import { updateAdSchema } from "@/lib/validations/ads";
import { normalizeMedia } from "@/lib/utils/media";
import { ALLOWED_TRANSITIONS, type AdStatus } from "@/lib/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data: ad, error } = await supabase
      .from("ads")
      .select("*, media:ad_media(original_url)")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !ad) return Response.json({ success: false, error: "Ad not found" }, { status: 404 });

    return Response.json({ success: true, data: ad });
  } catch (err: any) {
    return Response.json({ success: false, error: "Failed to fetch ad" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Fetch existing ad
    const { data: existingAd } = await supabase
      .from("ads")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!existingAd) {
      return Response.json({ success: false, error: "Ad not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updateAdSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { media_urls, status: newStatus, ...updateData } = parsed.data;

    // Validate status transition if status is changing
    if (newStatus && newStatus !== existingAd.status) {
      const allowed = ALLOWED_TRANSITIONS[existingAd.status as AdStatus] || [];
      if (!allowed.includes(newStatus as AdStatus)) {
        return Response.json(
          {
            success: false,
            error: `Cannot transition from "${existingAd.status}" to "${newStatus}"`,
          },
          { status: 400 }
        );
      }
    }

    // Only allow editing if in Draft or Rejected
    if (!["Draft", "Rejected"].includes(existingAd.status) && !newStatus) {
      return Response.json(
        { success: false, error: "Can only edit ads in Draft or Rejected status" },
        { status: 400 }
      );
    }

    // Update ad
    const { data: updatedAd, error } = await supabase
      .from("ads")
      .update({
        ...updateData,
        ...(newStatus ? { status: newStatus } : {}),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Update media if provided
    if (media_urls) {
      await supabase.from("ad_media").delete().eq("ad_id", id);
      if (media_urls.length > 0) {
        const mediaEntries = media_urls.map((url, index) => {
          const normalized = normalizeMedia(url);
          return {
            ad_id: id,
            source_type: normalized.source_type,
            original_url: normalized.original_url,
            thumbnail_url: normalized.thumbnail_url,
            validation_status: normalized.validation_status,
            display_order: index,
          };
        });
        await supabase.from("ad_media").insert(mediaEntries);
      }
    }

    // Status history
    if (newStatus && newStatus !== existingAd.status) {
      await supabase.from("ad_status_history").insert({
        ad_id: id,
        previous_status: existingAd.status,
        new_status: newStatus,
        changed_by: user.id,
        note: `Client changed status to ${newStatus}`,
      });
    }

    // Audit log
    await supabase.from("audit_logs").insert({
      actor_id: user.id,
      action_type: "update",
      target_type: "ad",
      target_id: id,
      old_value: { status: existingAd.status },
      new_value: { ...updateData, status: newStatus || existingAd.status },
    });

    return Response.json({ success: true, data: updatedAd });
  } catch (err: any) {
    return Response.json(
      { success: false, error: err.message || "Failed to update ad" },
      { status: 500 }
    );
  }
}
