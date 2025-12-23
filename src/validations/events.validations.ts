import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  location: z.string().min(1, "Location is required"),
  coverImage: z.string().startsWith("https://").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]).default("draft"),
  isFeatured: z.boolean().default(false),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventSchema = z.infer<typeof createEventSchema>;
export type UpdateEventSchema = z.infer<typeof updateEventSchema>;
