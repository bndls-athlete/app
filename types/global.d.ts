export {};

import { z } from "zod";
import { EntityType } from "./entityTypes";

declare global {
  interface CustomJwtSessionClaims {
    userType: z.infer<typeof UserType>;
  }
}

const UserType = z.enum([
  EntityType.Athlete,
  EntityType.Team,
  EntityType.Company,
]);
