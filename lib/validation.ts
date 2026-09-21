import { z } from "zod";

export const createLinkSchema = z.object({
  url: z
    .string()
    .trim()
    .url("Invalid URL")
    .refine(
      (value) => {
        const parsed = new URL(value);

        return (
          parsed.protocol === "http:" ||
          parsed.protocol === "https:"
        );
      },
      {
        message: "Only HTTP and HTTPS URLs are allowed",
      }
    ),

  alias: z
    .string()
    .trim()
    .min(3, "Alias must be at least 3 characters")
    .max(32, "Alias must be at most 32 characters")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Alias can only contain letters, numbers, hyphens and underscores"
    )
    .optional()
    .or(z.literal("")),

  expiresAt: z
    .string()
    .datetime({ offset: true })
    .optional()
    .or(z.literal("")),
});