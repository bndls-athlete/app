import { Brand } from "@/schemas/brandSchema";
import dayjs from "dayjs";
import { AthleteTierName, OptionsCardButtonText } from "./stripeAthleteManager";
import { MyPlanInfoButtonText } from "./stripeAthleteManager";
import { SubscriptionStatus } from "@/schemas/subscriptionStatusSchema";

type BrandPricingPlan = {
  tier: BrandTierName;
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
};

export type BrandTierKey =
  | "BRAND_BASIC_MONTHLY"
  | "BRAND_PERFORMANCE_MONTHLY"
  | "BRAND_ADVANCED_MONTHLY"
  | "BRAND_BASIC_YEARLY"
  | "BRAND_PERFORMANCE_YEARLY"
  | "BRAND_ADVANCED_YEARLY";
export type BrandTierName = "BASIC" | "PERFORMANCE" | "ADVANCED";

type GetBrandSubscriptionButtonDataParams = {
  brand: Brand | undefined;
  planPriceId: string;
  handleSwitch: () => void;
  handleManageBilling: () => void;
  proceedWithCheckout: (priceId: string) => void;
};

type ButtonData = { text: OptionsCardButtonText; action: () => void };

type GetMyBrandPlanInfoParams = {
  brand: Brand | undefined;
  handleManageBilling: () => void;
  handleRenew: () => void;
  handleReactivate: () => void;
  handleGetStarted: () => void;
};

type MyPlanInfoData = {
  planInfo: string;
  buttonText: MyPlanInfoButtonText;
  action: (() => void) | null;
};

class BrandTierManager {
  private static instance: BrandTierManager;
  private priceIds: Record<BrandTierKey, string> = {
    BRAND_BASIC_MONTHLY: process.env.NEXT_PUBLIC_BRAND_BASIC_MONTHLY_PRICE_ID!,
    BRAND_PERFORMANCE_MONTHLY:
      process.env.NEXT_PUBLIC_BRAND_PERFORMANCE_MONTHLY_PRICE_ID!,
    BRAND_ADVANCED_MONTHLY:
      process.env.NEXT_PUBLIC_BRAND_ADVANCED_MONTHLY_PRICE_ID!,
    BRAND_BASIC_YEARLY: process.env.NEXT_PUBLIC_BRAND_BASIC_YEARLY_PRICE_ID!,
    BRAND_PERFORMANCE_YEARLY:
      process.env.NEXT_PUBLIC_BRAND_PERFORMANCE_YEARLY_PRICE_ID!,
    BRAND_ADVANCED_YEARLY:
      process.env.NEXT_PUBLIC_BRAND_ADVANCED_YEARLY_PRICE_ID!,
  };

  public brandPricingPlans: BrandPricingPlan[] = [
    {
      tier: "BASIC",
      monthlyPriceId: this.priceIds.BRAND_BASIC_MONTHLY,
      yearlyPriceId: this.priceIds.BRAND_BASIC_YEARLY,
      monthlyPrice: "$49.99",
      annualPrice: "$599.88",
      features: [
        "Access to Tier 1 Athletes",
        "Athlete Information & Contact info",
        "Athlete Ratings and social media reports",
        "Promotion of products via BNDLS App & Boundless Ventures social media accounts",
      ],
    },
    {
      tier: "PERFORMANCE",
      monthlyPriceId: this.priceIds.BRAND_PERFORMANCE_MONTHLY,
      yearlyPriceId: this.priceIds.BRAND_PERFORMANCE_YEARLY,
      monthlyPrice: "$99.99",
      annualPrice: "$1,199.99",
      features: [
        "Access to Tier 1 & 2 Athletes",
        "Athlete Information & Contact info",
        "Athlete Ratings and social media reports",
        "Promotion of products via BNDLS App & Boundless Ventures social media accounts",
        "15 minute consultation once per month with Boundless Ventures marketing and management staff",
      ],
    },
    {
      tier: "ADVANCED",
      monthlyPriceId: this.priceIds.BRAND_ADVANCED_MONTHLY,
      yearlyPriceId: this.priceIds.BRAND_ADVANCED_YEARLY,
      monthlyPrice: "$149.99",
      annualPrice: "$1,799.88",
      features: [
        "Full access to all athletes across all 3 Tiers",
        "Athlete Information & Contact info",
        "Create any deals you want",
        "Athlete Ratings and social media reports",
        "Promotion of products via BNDLS App & Boundless Ventures social media accounts",
        "15 minute consultations twice per month with Boundless Ventures LLC marketing and management staff",
      ],
    },
  ];

  public tierOrder: BrandTierName[] = ["BASIC", "PERFORMANCE", "ADVANCED"];

  private constructor() {}

  static getInstance(): BrandTierManager {
    if (!BrandTierManager.instance) {
      BrandTierManager.instance = new BrandTierManager();
    }
    return BrandTierManager.instance;
  }

  getTier(priceId: string): BrandTierKey | undefined {
    return Object.keys(this.priceIds).find(
      (key) => this.priceIds[key as BrandTierKey] === priceId
    ) as BrandTierKey | undefined;
  }

  hasAccess(priceId: string, tierName: BrandTierName): boolean {
    const tierKey = this.getTier(priceId);
    if (!tierKey) return false;

    const userTier = tierKey.split("_")[1];
    const requestedTierIndex = this.tierOrder.indexOf(tierName);
    const userTierIndex = this.tierOrder.indexOf(userTier as BrandTierName);

    return userTierIndex >= requestedTierIndex;
  }

  hasActiveSubscription(brand: Brand | undefined): boolean {
    if (!brand || !brand.subscriptionStatus) {
      return false;
    }

    const allowedStatuses: SubscriptionStatus[] = ["active", "trialing"];
    return allowedStatuses.includes(brand.subscriptionStatus);
  }

  checkBrandAccessToAthlete(
    brand: Brand | undefined,
    athleteTiers: AthleteTierName[]
  ): boolean {
    if (!brand || !brand.subscriptionStatus || !brand.priceId) {
      return false;
    }

    const allowedStatuses: SubscriptionStatus[] = ["active", "trialing"];
    if (!allowedStatuses.includes(brand.subscriptionStatus)) {
      return false;
    }

    const brandTier = this.getTier(brand.priceId);
    if (!brandTier) {
      return false;
    }

    const brandTierName = brandTier.split("_")[1] as BrandTierName;

    switch (brandTierName) {
      case "BASIC":
        return athleteTiers.every((tier) => tier === "TIER_3");
      case "PERFORMANCE":
        return athleteTiers.every((tier) =>
          ["TIER_2", "TIER_3"].includes(tier)
        );
      case "ADVANCED":
        return true;
      default:
        return false;
    }
  }
}

function getMyBrandPlanInfo({
  brand,
  handleManageBilling,
  handleRenew,
  handleGetStarted,
}: GetMyBrandPlanInfoParams): MyPlanInfoData {
  const manager = BrandTierManager.getInstance();
  let planInfo =
    "You currently do not have an active subscription. Please add your billing details to initiate your subscription.";
  let buttonText: MyPlanInfoButtonText = "Get Started";
  let action: (() => void) | null = handleGetStarted;

  if (!brand) {
    return { planInfo, buttonText, action };
  }

  if (!brand.stripeSubscriptionId) {
    buttonText = "Get Started";
    action = handleGetStarted;
  } else {
    const currentTier = manager.brandPricingPlans.find(
      (plan) =>
        plan.monthlyPriceId === brand.priceId ||
        plan.yearlyPriceId === brand.priceId
    );

    switch (brand.subscriptionStatus) {
      case "active":
        if (brand.cancelAtPeriodEnd && brand.subscriptionEndDate) {
          const endDate = dayjs(brand.subscriptionEndDate);
          const formattedDate = endDate.format("MM/DD/YYYY");
          planInfo = `Your plan will be canceled on ${formattedDate}.`;
          buttonText = "Manage Plan";
          action = handleManageBilling;
        } else if (currentTier) {
          const isMonthly = brand.priceId === currentTier.monthlyPriceId;
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
          "Your subscription payment is overdue. Please update your billing details to continue your subscription.";
        buttonText = "Renew";
        action = handleRenew;
        break;
      case "canceled":
        planInfo =
          "Your subscription has been canceled. You can start a new subscription at any time.";
        buttonText = "Get Started";
        action = handleGetStarted;
        break;
      case "incomplete":
      case "incomplete_expired":
        planInfo =
          "You currently do not have an active subscription. Please add your billing details to initiate your subscription.";
        buttonText = "Get Started";
        action = handleGetStarted;
        break;
      default:
        // For other statuses like 'trialing' or 'paused', you can add custom messages, button texts, and actions as needed
        break;
    }
  }

  return { planInfo, buttonText, action };
}

function getBrandSubscriptionButtonData({
  brand,
  planPriceId,
  handleSwitch,
  handleManageBilling,
  proceedWithCheckout,
}: GetBrandSubscriptionButtonDataParams): ButtonData {
  const manager = BrandTierManager.getInstance();
  let text: OptionsCardButtonText = "Get Started";
  let action = () => proceedWithCheckout(planPriceId);

  // If there is no subscription status or priceId, return with "Get Started"
  if (!brand || !brand.subscriptionStatus || !brand.priceId) {
    return { text, action };
  }

  // Handle different subscription statuses
  switch (brand.subscriptionStatus) {
    case "past_due":
    case "unpaid":
      text = "Locked";
      action = () => {}; // No operation if locked
      break;
    case "active":
    case "trialing":
      const currentTierKey = manager.getTier(brand.priceId);
      const planTierKey = manager.getTier(planPriceId);

      if (currentTierKey && planTierKey) {
        const isCurrentPlanMonthly = currentTierKey.includes("MONTHLY");
        const isPlanMonthly = planTierKey.includes("MONTHLY");
        if (isPlanMonthly !== isCurrentPlanMonthly) {
          text = isPlanMonthly ? "Switch to Monthly" : "Switch to Yearly";
          action = handleSwitch;
        } else {
          const currentTierIndex = manager.tierOrder.indexOf(
            currentTierKey.split("_")[1] as BrandTierName
          );
          const planTierIndex = manager.tierOrder.indexOf(
            planTierKey.split("_")[1] as BrandTierName
          );

          if (currentTierIndex === planTierIndex) {
            text = "Current Plan";
            action = handleManageBilling;
          } else {
            text = currentTierIndex < planTierIndex ? "Upgrade" : "Downgrade";
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

export { BrandTierManager, getBrandSubscriptionButtonData, getMyBrandPlanInfo };
