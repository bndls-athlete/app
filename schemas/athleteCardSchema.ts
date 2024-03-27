import { z } from "zod";

const athleteCardSchema = z.object({
  fullName: z.string(),
  //   username: z.string(),
  email: z.string().email("Invalid email format"),
  tier: z.string(),
  location: z.string(),
  followers: z.number().nullable(),
  engagementRate: z.number().nullable(),
  athleteRating: z.number().nullable(),
  //   athleteInformation: z.string(),
  careerStats: z.number(),
  academicPerformance: z.number(),
  preseasonAwards: z.number(),
  personalPreferences: z.number(),
  bio: z.string(),
  reel: z.string(),
  socialProfiles: z.object({
    instagram: z.string(),
    tiktok: z.string(),
    facebook: z.string(),
    twitter: z.string(),
  }),
});

export type AthleteCard = z.infer<typeof athleteCardSchema>;

export { athleteCardSchema };
