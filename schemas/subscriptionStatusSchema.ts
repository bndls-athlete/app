import { z } from "zod";

// Define the subscription status values as a tuple
export const subscriptionStatusValues = [
  "incomplete",
  "incomplete_expired",
  "trialing",
  "active",
  "past_due",
  "canceled",
  "unpaid",
  "paused",
] as const; // Use 'as const' to infer a tuple type

// Create the Zod schema using the values
export const subscriptionStatusSchema = z.enum(subscriptionStatusValues);

// Infer the type from the Zod schema
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
