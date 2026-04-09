import { z } from "zod";

export const createAdSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(200),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000),
  category_id: z.string().uuid("Invalid category").optional(),
  city_id: z.string().uuid("Invalid city").optional(),
  package_id: z.string().uuid("Invalid package").optional(),
  media_urls: z
    .array(z.string().url("Invalid media URL"))
    .max(10, "Maximum 10 media items")
    .optional()
    .default([]),
});

export const updateAdSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200)
    .optional(),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(5000)
    .optional(),
  category_id: z.string().uuid("Invalid category").optional(),
  city_id: z.string().uuid("Invalid city").optional(),
  package_id: z.string().uuid("Invalid package").optional(),
  status: z.enum(["Draft", "Submitted"]).optional(),
  media_urls: z
    .array(z.string().url("Invalid media URL"))
    .max(10, "Maximum 10 media items")
    .optional(),
});

export type CreateAdInput = z.infer<typeof createAdSchema>;
export type UpdateAdInput = z.infer<typeof updateAdSchema>;
