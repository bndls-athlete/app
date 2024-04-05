"use client";

import UpgradeOptionsCard from "./UpgradeOptionsCard";
import Accordion from "@/app/components/Accordian";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { BrandTierManager } from "@/helpers/stripeBrandManager";
import { useBrandData } from "@/hooks/useBrandData";

const UpgradeOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pricing = searchParams.get("pricing") || "monthly";

  // Getting the singleton instance of BrandTierManager
  const manager = BrandTierManager.getInstance();

  // Accessing pricing plans from the BrandTierManager instance
  const brandPricingPlans = manager.brandPricingPlans;

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const { brand, isLoading, error } = useBrandData();

  return (
    <>
      <div className="my-3">
        <div className="text-center my-6">
          <h1 className="text-3xl font-semibold mb-2">
            Pricing Plans for Brands
          </h1>
          <span className="text-subtitle">
            Choose the plan that best fits your needs and start optimizing your
            performance today!
          </span>
        </div>
        <div className="flex justify-center">
          <div className="flex bg-sidebar gap-1 p-2 rounded-lg">
            <div
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("pricing", "monthly")
                );
              }}
              className={`transition duration-150 ease-in-out font-semibold text-sm py-2 px-3 rounded cursor-pointer ${
                pricing === "monthly"
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-black"
              }`}
            >
              Monthly Pricing
            </div>
            <div
              onClick={() => {
                router.push(
                  pathname + "?" + createQueryString("pricing", "annual")
                );
              }}
              className={`transition duration-150 ease-in-out font-semibold text-sm py-2 px-3 rounded cursor-pointer ${
                pricing === "annual"
                  ? "bg-white text-black shadow"
                  : "bg-transparent text-black"
              }`}
            >
              Annual Pricing
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 my-6">
          {brandPricingPlans.map((plan) => (
            <UpgradeOptionsCard
              priceId={
                pricing === "monthly" ? plan.monthlyPriceId : plan.yearlyPriceId
              }
              key={plan.tier}
              tier={plan.tier}
              price={
                pricing === "monthly" ? plan.monthlyPrice : plan.annualPrice
              }
              features={plan.features}
              brand={brand}
            />
          ))}
        </div>
        {/* <div className="bg-sidebar pt-24 pb-12 rounded">
          <div className="text-center my-6">
            <h1 className="text-3xl font-semibold mb-2">
              Frequently Asked Questions
            </h1>
            <span className="text-subtitle">
              Everything you need to know about the product and billing.
            </span>
          </div>
          <div className="lg:w-[60%] md:w-[75%] w-full px-3 mx-auto">
            <Accordion>
              <Accordion.Item
                title="Is there a free trial available?"
                text="Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
              />
            </Accordion>
          </div>
          <div className="bg-white my-6 mt-16">
            <div className="flex justify-center py-12">
              <div className="text-center">
                <h3 className="font-semibold text-2xl mb-2">
                  Still have questions?
                </h3>
                <span className="text-subtitle">
                  Can’t find the answer you’re looking for? Please chat to our
                  friendly team.
                </span>
                <div className="py-6 mx-auto">
                  <Button className="text-sm py-2">Get in Touch</Button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default UpgradeOptions;
