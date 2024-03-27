type AthletePricingPlan = {
  tier: string;
  monthlyPriceId: string;
  yearlyPriceId: string;
  monthlyPrice: string;
  annualPrice: string;
  features: string[];
};

export const athletePricingPlans: AthletePricingPlan[] = [
  {
    tier: "Tier 3",
    monthlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_3_MONTHLY_PRICE_ID!,
    yearlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_3_YEARLY_PRICE_ID!,
    monthlyPrice: "$5",
    annualPrice: "$50", // 12 * $5 - 2 * $5
    features: [
      "Access to basic job postings",
      "Apply to up to 5 jobs per month",
    ],
  },
  {
    tier: "Tier 2",
    monthlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_2_MONTHLY_PRICE_ID!,
    yearlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_2_YEARLY_PRICE_ID!,
    monthlyPrice: "$10",
    annualPrice: "$100", // 12 * $10 - 2 * $10
    features: [
      "Access to premium job postings",
      "Apply to up to 15 jobs per month",
    ],
  },
  {
    tier: "Tier 1",
    monthlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_1_MONTHLY_PRICE_ID!,
    yearlyPriceId: process.env.NEXT_PUBLIC_ATHLETE_TIER_1_YEARLY_PRICE_ID!,
    monthlyPrice: "$15",
    annualPrice: "$150", // 12 * $15 - 2 * $15
    features: [
      "Access to all job postings, including exclusive listings",
      "Unlimited job applications",
    ],
  },
];
