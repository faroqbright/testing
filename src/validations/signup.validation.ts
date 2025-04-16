import { sign } from "crypto";
import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(4, { message: "name must contains at least 4 chars" })
      .max(25, { message: "name should be less than 25 chars" }),
    email: z.string().email(),
    password: z.string().min(8, { message: "password must contains at least 8 chars" }),
    confirm_password: z.string().min(8, { message: "confirm password must contains at least 8 chars" }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "confirm password does not matched",
    path: ["confirm_password"],
  });

export type SignUpValidationSchema = z.infer<typeof signUpSchema>;
