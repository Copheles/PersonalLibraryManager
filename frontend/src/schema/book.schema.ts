import { z } from "zod";

export const createBookSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(50, "Author name must be less than 50 characters"),
  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  review: z
    .string()
    .min(10, "Review must be at least 10 characters")
    .max(1000, "Review must be less than 1000 characters"),
  status: z
    .enum(["reading", "completed", "wishList"])
    .refine((val) => val !== undefined, {
      message: "Please select a status",
    }),
});

export type CreateBookFormData = z.infer<typeof createBookSchema>;
