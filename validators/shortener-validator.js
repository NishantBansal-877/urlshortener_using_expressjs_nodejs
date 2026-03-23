import z from "zod";

export const shortenerSchema = z.object({
  id: z.coerce.number().int().optional(),

  url: z
    .string({ required_error: "Url is required" })
    .trim()
    .url({ message: "Please enter a valid url" })
    .max(1024, { message: "url cannot be longer than 1024 characters" }),

  shortCode: z
    .string({ required_error: "Short code is required" })
    .trim()
    .min(3, { message: "Short code must be at least 3 chaaracters long." })
    .max(50, { message: "Short code cannot be longer than 50 characters" }),
});
