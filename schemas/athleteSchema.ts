import { z } from "zod";
import { subscriptionStatusSchema } from "./subscriptionStatusSchema";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";
import mongoose from "mongoose";

export const sportSchema = z.enum(["basketball", "soccer", "baseball", ""]);
export const genderSchema = z.enum(["Male", "Female", "Other", ""]);
export type Sport = z.infer<typeof sportSchema>;
export type Gender = z.infer<typeof genderSchema>;
export const sportsEnum = sportSchema.enum;
export const genderEnum = genderSchema.enum;

export const athleteTierSchema = z.enum(["1", "2", "3"]);
export type AthleteTier = z.infer<typeof athleteTierSchema>;
export const athleteTierEnum = athleteTierSchema.enum;

// Allowed stats source URLs
export const allowedStatsSourceURLs = [
  "https://www.perfectgame.org/",
  "https://www.prepbaseballreport.com/",
  "https://maxpreps.com/",
  "https://247sports.com/",
];

// Custom validation for statsSourceURL
export const validateStatsSourceURL = z
  .string()
  .min(1, "Stats source URL is required") // Check if the field is required
  .url("Invalid URL format") // Check if it's a valid URL
  .refine((url) => {
    return allowedStatsSourceURLs.some((allowedUrl) =>
      url.startsWith(allowedUrl)
    );
  }, "URL must be from an allowed source"); // Check if it's one of the allowed URLs

export const socialMediaPlatformSchema = z.enum([
  "instagram",
  "twitter",
  "tiktok",
  "youtube",
]);
export type SocialMediaPlatform = z.infer<typeof socialMediaPlatformSchema>;
export const socialMediaPlatformEnum = socialMediaPlatformSchema.enum;

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
  registrationType: z.enum([
    AthleteRegistrationType.Individual,
    AthleteRegistrationType.Team,
  ]),
  // Individual specific fields
  collegeUniversity: z.string(),
  graduationDate: z
    .string()
    .transform((value) => (value ? new Date(value) : value)),
  sport: sportSchema,
  baseballStats: z.object({
    winsAboveReplacement: z.number(),
    isolatedPower: z.number(),
    weightedOnBaseAverage: z.number(),
  }),
  basketballStats: z.object({
    points: z.number(),
    assists: z.number(),
    rebounds: z.number(),
    blocks: z.number(),
    steals: z.number(),
  }),
  soccerStats: z.object({
    cleanSheets: z.number(),
    goalsScored: z.number(),
    assists: z.number(),
  }),
  professionalSkills: z.array(z.string()),
  currentAcademicGPA: z.number(),
  professionalReferences: z.array(z.string()),
  statsSourceURL: validateStatsSourceURL,
  bio: z.string().max(400, "Maximum 400 characters"),
  reel: z.string(),
  // Team specific fields
  // teamGender: z.string(),
  // teamGPA: z.number(),
  // teamBio: z.string(),
  // Common fields
  socialProfiles: z.object({
    instagram: z.string(),
    tiktok: z.string(),
    youtube: z.string(),
    twitter: z.string(),
  }),
  followers: z.object({
    instagram: z.number(),
    tiktok: z.number(),
    youtube: z.number(),
    twitter: z.number(),
  }),
  // engagementRate: z.number(),
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

export type Athlete = z.infer<typeof athleteSchema> & {
  _id: mongoose.Types.ObjectId;
};

export { athleteSchema };
