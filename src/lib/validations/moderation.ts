import { z } from "zod";

export const reviewAdSchema = z.object({
  action: z.enum(["approve", "reject"]),
  moderation_notes: z.string().max(1000).optional(),
  rejection_reason: z.string().max(500).optional(),
});

export const publishAdSchema = z.object({
  action: z.enum(["publish", "schedule", "reject"]),
  publish_at: z.string().datetime().optional(),
  is_featured: z.boolean().optional(),
  admin_boost: z.number().min(0).max(100).optional(),
  rejection_reason: z.string().max(500).optional(),
});

export type ReviewAdInput = z.infer<typeof reviewAdSchema>;
export type PublishAdInput = z.infer<typeof publishAdSchema>;
