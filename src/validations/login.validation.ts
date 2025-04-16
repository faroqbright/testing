import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(4, { message: "name must contains at least 4 chars" })
    .max(25, { message: "name should be less than 25 chars" }),
  password: z.string().min(8, { message: "password must contains at least 8 chars" }),
});
