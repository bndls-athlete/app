import { Athlete } from "@/schemas/athleteSchema";
import { SubscriptionStatus } from "@/schemas/subscriptionStatusSchema";
import dayjs from "dayjs";
import {
  AthletePricingPlan,
  AthleteTierKey,
  AthleteTierName,
  ButtonData,
  GetAthleteSubscriptionButtonDataParams,
  GetMyPlanInfoParams,
  MyPlanInfoButtonText,
  MyPlanInfoData,
  OptionsCardButtonText,
} from "./stripeAthleteManager";

class TeamTierManager {
  private static instance: TeamTierManager;
  private priceIds: Record<AthleteTierKey, string> = {
    ATHLETE_TIER_1_MONTHLY:
      process.env.NEXT_PUBLIC_TEAM_TIER_1_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_2_MONTHLY:
      process.env.NEXT_PUBLIC_TEAM_TIER_2_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_3_MONTHLY:
      process.env.NEXT_PUBLIC_TEAM_TIER_3_MONTHLY_PRICE_ID!,
    ATHLETE_TIER_1_YEARLY: process.env.NEXT_PUBLIC_TEAM_TIER_1_YEARLY_PRICE_ID!,
    ATHLETE_TIER_2_YEARLY: process.env.NEXT_PUBLIC_TEAM_TIER_2_YEARLY_PRICE_ID!,
    ATHLETE_TIER_3_YEARLY: process.env.NEXT_PUBLIC_TEAM_TIER_3_YEARLY_PRICE_ID!,
  };

  public athletePricingPlans: AthletePricingPlan[] = [
    {
      tier: "Tier 3 Plan (Available to all teams)",
      monthlyPriceId: this.priceIds.ATHLETE_TIER_3_MONTHLY,
      yearlyPriceId: this.priceIds.ATHLETE_TIER_3_YEARLY,
      monthlyPrice: "$99.99",
      annualPrice: "$1199.88",
      features: ["Access to Tier 3 job postings", "Unlimited job applications"],
    },
    {
      tier: "Tier 2 Plan (For Tier 1 and Tier 2 teams)",
      monthlyPriceId: this.priceIds.ATHLETE_TIER_2_MONTHLY,
      yearlyPriceId: this.priceIds.ATHLETE_TIER_2_YEARLY,
      monthlyPrice: "$149.99",
      annualPrice: "$1799.88",
      features: [
        "Access to Tier 2 and Tier 3 job postings",
        "Unlimited job applications",
      ],
    },
    {
      tier: "Tier 1 Plan (Exclusive for Tier 1 teams)",
      monthlyPriceId: this.priceIds.ATHLETE_TIER_1_MONTHLY,
      yearlyPriceId: this.priceIds.ATHLETE_TIER_1_YEARLY,
      monthlyPrice: "$199.99",
      annualPrice: "$2399.88",
      features: [
        "Access to all job postings, including Tier 1, Tier 2, and Tier 3",
        "Unlimited job applications",
      ],
    },
  ];

  private constructor() {}

  static getInstance(): TeamTierManager {
    if (!TeamTierManager.instance) {
      TeamTierManager.instance = new TeamTierManager();
    }
    return TeamTierManager.instance;
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

  /**
   * Checks if an athlete has access to a specific tier based on their current subscription.
   *
   * @param athlete The athlete object to check access for.
   * @param tierName The name of the tier to check access against.
   * @returns true if the athlete has access to the specified tier, false otherwise.
   */
  checkAthleteAccess(
    athlete: Athlete | null,
    tierName: AthleteTierName
  ): boolean {
    // Define the allowed subscription statuses
    const allowedStatuses: SubscriptionStatus[] = ["active", "trialing"];

    // Checks if the athlete exists and has an allowed subscription status
    if (
      !athlete ||
      !athlete.subscriptionStatus ||
      !allowedStatuses.includes(athlete.subscriptionStatus)
    ) {
      return false;
    }

    // For trialing status, always return true
    if (athlete.subscriptionStatus === "trialing") {
      return true;
    }

    // For active subscriptions, check if the athlete has a priceId
    if (!athlete.priceId) {
      return false;
    }

    // Utilizes hasAccess for the actual check for active subscriptions
    return this.hasAccess(athlete.priceId, tierName);
  }

  /**
   * Checks if an athlete has access to purchase a subscription tier based on their current tier.
   *
   * @param athleteTier The tier level of the athlete (e.g., "1").
   * @param requestedPriceId The price ID of the tier the athlete wants to purchase.
   * @returns true if the athlete has access to purchase the requested tier, false otherwise.
   */
  checkAthleteAccessToPurchase(
    athleteTier: string,
    requestedPriceId: string
  ): boolean {
    // Determine the tier for the requested price ID
    const requestedTierKey = this.getTier(requestedPriceId);
    if (!requestedTierKey) {
      // If the requested price ID does not correspond to a known tier, access is denied
      return false;
    }
    // Extract the numerical tier level from the requested tier key
    const requestedTierLevel = parseInt(requestedTierKey.split("_")[2], 10);
    // Athlete has access if their tier level is less than or equal to the requested tier level
    return parseInt(athleteTier, 10) <= requestedTierLevel;
  }
}

function getTeamPlanInfo({
  athlete,
  handleManageBilling,
  handleRenew,
  handleGetStarted,
}: GetMyPlanInfoParams): MyPlanInfoData {
  const manager = TeamTierManager.getInstance();
  let planInfo =
    "You currently do not have an active subscription. Please add your billing details to initiate your subscription.";
  let buttonText: MyPlanInfoButtonText = "Get Started";
  let action: (() => void) | null = handleGetStarted;

  if (!athlete) {
    return { planInfo, buttonText, action };
  }

  if (athlete.subscriptionStatus === "trialing") {
    planInfo = "Your team is currently on a trial subscription.";
    buttonText = "Manage Plan";
    action = handleManageBilling;
    return { planInfo, buttonText, action };
  }

  if (!athlete.stripeSubscriptionId) {
    buttonText = "Get Started";
    action = handleGetStarted;
  } else {
    const currentTier = manager.athletePricingPlans.find(
      (plan) =>
        plan.monthlyPriceId === athlete.priceId ||
        plan.yearlyPriceId === athlete.priceId
    );

    switch (athlete.subscriptionStatus) {
      case "active":
        if (athlete.cancelAtPeriodEnd && athlete.subscriptionEndDate) {
          const endDate = dayjs(athlete.subscriptionEndDate);
          const formattedDate = endDate.format("MM/DD/YYYY");
          planInfo = `Your team's plan will be canceled on ${formattedDate}.`;
          buttonText = "Manage Plan";
          action = handleManageBilling;
        } else if (currentTier) {
          const isMonthly = athlete.priceId === currentTier.monthlyPriceId;
          planInfo = `Current Plan: ${currentTier.tier} - ${
            isMonthly ? currentTier.monthlyPrice : currentTier.annualPrice
          } / ${isMonthly ? "month" : "year"}`;
          buttonText = "Manage Plan";
          action = handleManageBilling;
        }
        break;
      case "past_due":
      case "unpaid":
        planInfo =
          "Your team's subscription payment is overdue. Please update your billing details to continue your subscription.";
        buttonText = "Renew";
        action = handleRenew;
        break;
      case "canceled":
        planInfo =
          "Your team's subscription has been canceled. You can start a new subscription at any time.";
        buttonText = "Get Started";
        action = handleGetStarted;
        break;
      case "incomplete":
      case "incomplete_expired":
        planInfo =
          "Your team currently does not have an active subscription. Please add your billing details to initiate your subscription.";
        buttonText = "Get Started";
        action = handleGetStarted;
        break;
      default:
        // For other statuses, you can add custom messages, button texts, and actions as needed
        break;
    }
  }

  return { planInfo, buttonText, action };
}

function getTeamSubscriptionButtonData({
  athlete,
  planPriceId,
  handleSwitch,
  handleManageBilling,
  proceedWithCheckout,
  checkAccess = true, // Default value if not provided
}: GetAthleteSubscriptionButtonDataParams): ButtonData {
  const manager = TeamTierManager.getInstance();
  let text: OptionsCardButtonText = "Get Started";
  let action = () => proceedWithCheckout(planPriceId);

  if (checkAccess && athlete && athlete.athleteTier) {
    const hasAccess = manager.checkAthleteAccessToPurchase(
      athlete.athleteTier,
      planPriceId
    );
    if (!hasAccess) {
      text = "Locked";
      action = () => {}; // No operation if locked
      return { text, action };
    }
  }

  // If there is no subscription status or priceId, return with "Get Started"
  if (!athlete || !athlete.subscriptionStatus || !athlete.priceId) {
    return { text, action };
  }

  // Handle different subscription statuses
  switch (athlete.subscriptionStatus) {
    case "past_due":
    case "unpaid":
      text = "Locked";
      action = () => {}; // No operation if locked
      // text = "Renew";
      // action = handleManageBilling;
      break;
    case "active":
    case "trialing":
      const currentTierKey = manager.getTier(athlete.priceId);
      const planTierKey = manager.getTier(planPriceId);

      if (currentTierKey && planTierKey) {
        const isCurrentPlanMonthly = currentTierKey.includes("MONTHLY");
        const isPlanMonthly = planTierKey.includes("MONTHLY");
        if (isPlanMonthly !== isCurrentPlanMonthly) {
          text = isPlanMonthly ? "Switch to Monthly" : "Switch to Yearly";
          action = handleSwitch;
        } else {
          const currentTierIndex = parseInt(currentTierKey.split("_")[2], 10);
          const planTierIndex = parseInt(planTierKey.split("_")[2], 10);

          if (currentTierIndex === planTierIndex) {
            text = "Current Plan";
            action = handleManageBilling;
          } else {
            text = currentTierIndex > planTierIndex ? "Upgrade" : "Downgrade";
            action = handleSwitch;
          }
        }
      } else {
        action = () => proceedWithCheckout(planPriceId);
      }
      break;
    default:
      action = () => proceedWithCheckout(planPriceId);
      break;
  }

  return { text, action };
}

export { TeamTierManager, getTeamSubscriptionButtonData, getTeamPlanInfo };
