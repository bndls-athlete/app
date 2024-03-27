import { Brand } from "@/schemas/brandSchema";

export type BrandTierKey =
  | "BRAND_BASIC_MONTHLY"
  | "BRAND_PERFORMANCE_MONTHLY"
  | "BRAND_ADVANCED_MONTHLY"
  | "BRAND_BASIC_YEARLY"
  | "BRAND_PERFORMANCE_YEARLY"
  | "BRAND_ADVANCED_YEARLY";
export type BrandTierName = "BASIC" | "PERFORMANCE" | "ADVANCED";

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
  private tierOrder = ["BASIC", "PERFORMANCE", "ADVANCED"];

  private constructor() {}

  static getInstance(): BrandTierManager {
    if (!BrandTierManager.instance) {
      BrandTierManager.instance = new BrandTierManager();
    }
    return BrandTierManager.instance;
  }

  getTier(priceId: string): BrandTierKey | undefined {
    return Object.entries(this.priceIds).find(
      ([, value]) => value === priceId
    )?.[0] as BrandTierKey | undefined;
  }

  hasAccess(priceId: string, tierName: BrandTierName): boolean {
    const tierKey = this.getTier(priceId);
    if (!tierKey) return false;

    const userTier = tierKey.split("_")[1];
    return this.tierOrder.indexOf(userTier) >= this.tierOrder.indexOf(tierName);
  }
}

// Example function to check brand access
export async function checkBrandAccess(
  brand: Brand | null,
  tierName: BrandTierName
): Promise<boolean> {
  // Check if the brand exists and has an active subscription
  if (
    !brand ||
    !brand.subscriptionStatus ||
    !["active", "trialing"].includes(brand.subscriptionStatus) ||
    !brand.priceId
  ) {
    return false;
  }

  const manager = BrandTierManager.getInstance();

  // Check if the brand has access to the specified tier based on their priceId
  return manager.hasAccess(brand.priceId, tierName);
}
