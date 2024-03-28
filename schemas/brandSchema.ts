import { z } from "zod";
import { subscriptionStatusSchema } from "./subscriptionStatusSchema";

const brandSchema = z.object({
  userId: z.string().optional(),
  companyName: z.string().optional(),
  industry: z.string().optional(),
  bio: z.string().optional(),
  website: z.string().url().optional(),
  email: z.string().email("Invalid email format").optional(),
  phoneNumber: z.string().optional(),
  address: z
    .object({
      countryRegion: z.string().optional(),
      streetName: z.string().optional(),
      houseApartmentNumber: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  socialProfiles: z
    .object({
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  brandRating: z.number().optional(),
  companyInformation: z.string().optional(),
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
