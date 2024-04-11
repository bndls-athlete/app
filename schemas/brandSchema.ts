import { z } from "zod";
import { subscriptionStatusSchema } from "./subscriptionStatusSchema";

const brandSchema = z.object({
  userId: z.string(),
  companyName: z.string(),
  receiveUpdates: z.boolean(),
  profilePicture: z.string(),
  industry: z.string(),
  bio: z.string(),
  website: z.string().url().optional().or(z.literal("")),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string(),
  address: z.object({
    countryRegion: z.string(),
    streetAddress: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
  socialProfiles: z.object({
    instagram: z.string(),
    tiktok: z.string(),
    youtube: z.string(),
    twitter: z.string(),
  }),
  brandRating: z.number(),
  companyInformation: z.string(),
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

export type Brand = z.infer<typeof brandSchema>;

export { brandSchema };
