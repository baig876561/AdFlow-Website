import { z } from "zod";

export const submitPaymentSchema = z.object({
  ad_id: z.string().uuid("Invalid ad ID"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(["bank_transfer", "mobile_money", "card", "crypto", "other"]),
  transaction_ref: z
    .string()
    .min(3, "Transaction reference is required")
    .max(100),
  sender_name: z.string().min(2, "Sender name is required").max(100),
  screenshot_url: z.string().url("Invalid screenshot URL").optional().or(z.literal("")),
});

export const verifyPaymentSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  admin_note: z.string().max(500).optional(),
});

export type SubmitPaymentInput = z.infer<typeof submitPaymentSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
