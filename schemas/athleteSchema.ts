import { z } from "zod";
import { subscriptionStatusSchema } from "./subscriptionStatusSchema";

const athleteSchema = z.object({
  userId: z.string(),
  fullName: z.string(),
  email: z.string().email("Invalid email format"),
  profilePicture: z.string(),
  phoneNumber: z.string(),
  gender: z.string(),
  receiveUpdates: z.boolean(),
  address: z.object({
    countryRegion: z.string(),
    streetName: z.string(),
    houseApartmentNumber: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  dateOfBirth: z
    .string()
    .transform((value) => (value ? new Date(value) : value)),
  registrationType: z.enum(["individual", "team"]),
  // Individual specific fields
  collegeUniversity: z.string(),
  graduationDate: z
    .string()
    .transform((value) => (value ? new Date(value) : value)),
  sport: z.string(),
  professionalSkills: z.array(z.string()),
  currentAcademicGPA: z.number(),
  professionalReferences: z.array(z.string()),
  athleticCareerHighlights: z.string().max(400, "Maximum 400 characters"),
  bio: z.string().max(400, "Maximum 400 characters"),
  reel: z.string(),
  // Team specific fields
  teamGender: z.string(),
  teamGPA: z.number(),
  teamBio: z.string(),
  teamHighlights: z.string(),
  // Common fields
  socialProfiles: z.object({
    instagram: z.string(),
    tiktok: z.string(),
    facebook: z.string(),
    twitter: z.string(),
  }),
  followers: z.number(),
  engagementRate: z.number(),
  athleteRating: z.number(),
  athleteTier: z.enum(["1", "2", "3"]),
  // Stripe
  stripeCustomerId: z.string(),
  stripeSubscriptionId: z.string(),
  stripeSubscriptionItemId: z.string(),
  priceId: z.string(),
  subscriptionStartDate: z.date(),
  subscriptionEndDate: z.date(),
  cancelAtPeriodEnd: z.boolean(),
  subscriptionStatus: subscriptionStatusSchema,
});

export type Athlete = z.infer<typeof athleteSchema>;

export { athleteSchema };
