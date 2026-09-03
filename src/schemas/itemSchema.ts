import { z } from "zod";

export const itemSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  image: z
    .string()
    .url("Please enter a valid image URL")
    .optional()
    .or(z.literal("")),

  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters"),

  rating: z
    .number()
    .min(0, "Rating cannot be negative")
    .max(10, "Rating cannot exceed 10"),

  language: z.string().min(2, "Language is required"),

  status: z.enum(["watched", "watching", "planned"]),

  genres: z.string().min(2, "Enter at least one genre"),

  premiered: z.string().optional(),
});

export type ItemForm = z.infer<typeof itemSchema>;