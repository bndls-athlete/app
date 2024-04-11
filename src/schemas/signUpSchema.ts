import { EntityType } from "@/types/entityTypes";
import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(1, "Full name is required")
      .regex(
        /^\s*([A-Za-z]+(?:\s+[A-Za-z]+)+)\s*$/,
        "Full name must contain at least two words"
      ),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
    userType: z.nativeEnum(EntityType),
    updates: z.boolean().optional(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
