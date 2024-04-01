import { z } from "zod";

export const validateNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z.coerce.number().min(0, { message: "Value cannot be below 0" }).optional()
);

export const validateNumberRequired = z.preprocess(
  (val) => val,
  z
    .string()
    .min(1, { message: "This field is required" })
    .transform((val) => Number(val))
    .refine((val) => val >= 0, { message: "Value cannot be below 0" })
);
