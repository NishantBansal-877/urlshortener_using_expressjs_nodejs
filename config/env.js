import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();
export const env = z
  .object({
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    GITHUB_CLIENT_ID: z.string().min(1),
    GITHUB_CLIENT_SECRET: z.string().min(1),
    FRONTEND_URL: z.string().url().trim().min(1),
  })
  .parse(process.env);
