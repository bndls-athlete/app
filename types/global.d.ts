export {};

import { z } from "zod";

declare global {
  interface CustomJwtSessionClaims {
    userType: z.infer<typeof UserType>;
  }
}
