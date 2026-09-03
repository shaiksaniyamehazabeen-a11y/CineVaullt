import { z } from "zod";

export const itemSchema = z.object({
  name: z
    .string()
    .min(2, "Movie name must be at least 2 characters"),

  summary: z
    .string()
    .min(10, "Summary must be at least 10 characters"),

  rating: z
    .number()
    .min(0, "Rating cannot be below 0")
    .max(10, "Rating cannot be above 10"),

  language: z
    .string()
    .min(2, "Language is required"),

  status: z.enum([
    "watched",
    "watching",
    "planned",
  ]),

  genres: z
    .string()
    .min(2, "Please enter at least one genre"),

  premiered: z
    .string()
    .optional(),
});

export type ItemForm = z.infer<
  typeof itemSchema
>;