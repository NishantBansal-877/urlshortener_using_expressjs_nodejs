import { z } from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(100, { message: "Email must be no meor than 100 characters." }),

  password: z
    .string()
    .min(6, { message: "Password must be aat least 6 characters long." })
    .max(100, { message: "Passwordd must be no more than 100 characers." }),
});

export const registerUserSchema = loginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "name must be at least 3 charater long" })
    .max(100, { message: "name must be no more than 100 characters" }),
});
