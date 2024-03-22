export {};

import { z } from "zod";

declare global {
  interface CustomJwtSessionClaims {
    userType: z.infer<typeof UserType>;
  }
}

const UserType = z.enum(["athlete", "team", "company"]);
