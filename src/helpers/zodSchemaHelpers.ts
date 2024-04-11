import { z } from "zod";

// Optional number validation: allows empty strings, undefined, or numbers above 0
export const validateNumber = z.preprocess(
  (val) => (val === "" ? undefined : val),
  z
    .union([z.string(), z.number(), z.undefined()])
    .optional()
    .transform((val) => {
      if (val === undefined || typeof val === "number") {
        return val;
      } else {
        const parsed = Number(val);
        return isNaN(parsed) ? undefined : parsed;
      }
    })
    .refine(
      (val) => val === undefined || (typeof val === "number" && val >= 0),
      {
        message: "Value must be a number above or equal to 0",
      }
    )
);

// Required number validation: requires a number above or equal to 0
export const validateNumberRequired = z.preprocess(
  (val) => val,
  z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "number") {
        return val;
      } else {
        const parsed = Number(val);
        return isNaN(parsed) ? undefined : parsed;
      }
    })
    .refine((val) => typeof val === "number" && val >= 0, {
      message: "Value must be a number above or equal to 0",
    })
);
