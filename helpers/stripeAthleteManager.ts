import { Athlete } from "@/schemas/athleteSchema";

export type AthleteTierKey =
  | "ATHLETE_TIER_1_MONTHLY"
  | "ATHLETE_TIER_2_MONTHLY"
  | "ATHLETE_TIER_3_MONTHLY"
  | "ATHLETE_TIER_1_YEARLY"
  | "ATHLETE_TIER_2_YEARLY"
  | "ATHLETE_TIER_3_YEARLY";
export type AthleteTierName = "TIER_1" | "TIER_2" | "TIER_3";

type ButtonText =
  | "Get Started"
  | "Upgrade"
  | "Downgrade"
  | "Current Plan"
  | "Renew"
  | "Switch to Monthly"
  | "Switch to Yearly"
  | "Complete Payment";

class AthleteTierManager {
  private static instance: AthleteTierManager;
  private priceIds: Record<AthleteTierKey, string> = {
    ATHLETE_TIER_1_MONTHLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_1_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_2_MONTHLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_2_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_3_MONTHLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_3_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_1_YEARLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_1_YEARLY_PRICE_ID!,
    ATHLETE_TIER_2_YEARLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_2_YEARLY_PRICE_ID!,
    ATHLETE_TIER_3_YEARLY:
      process.env.NEXT_PUBLIC_ATHLETE_TIER_3_YEARLY_PRICE_ID!,
  };

  private constructor() {}

  static getInstance(): AthleteTierManager {
    if (!AthleteTierManager.instance) {
      AthleteTierManager.instance = new AthleteTierManager();
    }
    return AthleteTierManager.instance;
  }

  getTier(priceId: string): AthleteTierKey | undefined {
    return Object.entries(this.priceIds).find(
      ([, value]) => value === priceId
    )?.[0] as AthleteTierKey | undefined;
  }

  hasAccess(priceId: string, tierName: AthleteTierName): boolean {
    const tierKey = this.getTier(priceId);
    if (!tierKey) return false;

    const userTier = `TIER_${tierKey.split("_")[2]}`;
    const userTierIndex = parseInt(userTier.split("_")[1], 10);
    const requestedTierIndex = parseInt(tierName.split("_")[1], 10);
    return userTierIndex <= requestedTierIndex;
  }
}

// Example function to check athlete access
export async function checkAthleteAccess(
  athlete: Athlete | null,
  tierName: AthleteTierName
): Promise<boolean> {
  // Check if the athlete exists and has an active subscription
  if (
    !athlete ||
    !athlete.subscriptionStatus ||
    !["active", "trialing"].includes(athlete.subscriptionStatus) ||
    !athlete.priceId
  ) {
    return false;
  }

  const manager = AthleteTierManager.getInstance();

  // Check if the athlete has access to the specified tier based on their priceId
  return manager.hasAccess(athlete.priceId, tierName);
}

export function getAthleteSubscriptionButtonText(
  athlete: Athlete | null,
  planPriceId: string
): ButtonText {
  // If athlete, subscription status, or priceId is missing, return "Get Started"
  if (!athlete || !athlete.subscriptionStatus || !athlete.priceId) {
    return "Get Started";
  }

  // Handle cases where the subscription is not in good standing
  switch (athlete.subscriptionStatus) {
    case "past_due":
    case "unpaid":
    case "incomplete":
      return "Complete Payment"; // Changed from "Renew" to "Complete Payment" for incomplete status
    case "incomplete_expired":
      return "Renew";
  }

  // If subscription is neither active nor trialing, return "Get Started"
  if (
    athlete.subscriptionStatus !== "active" &&
    athlete.subscriptionStatus !== "trialing"
  ) {
    return "Get Started";
  }

  // Get the current and plan tiers
  const manager = AthleteTierManager.getInstance();
  const currentTierKey = manager.getTier(athlete.priceId);
  const planTierKey = manager.getTier(planPriceId);

  // If either tier is missing, return "Get Started"
  if (!currentTierKey || !planTierKey) {
    return "Get Started";
  }

  // Determine if the current plan and the selected plan are monthly
  const isCurrentPlanMonthly = currentTierKey.includes("MONTHLY");
  const isPlanMonthly = planTierKey.includes("MONTHLY");

  // If the billing frequency is changing, return the appropriate switch message
  if (isPlanMonthly !== isCurrentPlanMonthly) {
    return isPlanMonthly ? "Switch to Monthly" : "Switch to Yearly";
  }

  // Compare the tier indices to determine if it's an upgrade or downgrade
  const currentTierIndex = parseInt(currentTierKey.split("_")[2], 10);
  const planTierIndex = parseInt(planTierKey.split("_")[2], 10);

  if (currentTierIndex === planTierIndex) {
    return "Current Plan";
  }

  return currentTierIndex < planTierIndex ? "Upgrade" : "Downgrade";
}
