"use client";

import UpgradeOptionsCard from "./UpgradeOptionsCard";
import Accordion from "@/app/components/Accordian";
import { useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import { athletePricingPlans } from "@/helpers/athletePricingPlans";
import { useAthleteData } from "@/hooks/useAthleteData";

const UpgradeOptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pricing = searchParams.get("pricing") || "monthly";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const { athlete, isLoading, error } = useAthleteData();

  return (
    <>
      <div className="my-3">
        <div className="text-center my-6">
          <h1 className="text-3xl font-semibold mb-2">
            Pricing Plans for Athletes
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
          {athletePricingPlans.map((plan) => (
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
              athlete={athlete}
            />
          ))}
        </div>
        <div className="bg-sidebar pt-24 pb-12 rounded">
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
              {/* Add more accordion items here */}
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
        </div>
      </div>
    </>
  );
};

export default UpgradeOptions;

// import UpgradeOptionsCard from "./UpgradeOptionsCard";
// import Accordion from "@/app/components/Accordian";
// import Button from "@/app/components/Button";
// import avatar from "../../../assets/img/Avatar.webp";
// import { useSearchParams } from "next/navigation";

// const UpgradeOptions = () => {
//   const searchParams = useSearchParams();
//   const pricing = searchParams.get("pricing") || "monthly";

//   const handleParams = (value: "monthly" | "annual") => {
//     searchParams.set("pricing", value);
//   };

//   const features = [
//     "Access to basic features",
//     "Basic reporting and analytics",
//     "Up to 10 individual users",
//     "20GB individual data each user",
//     "Basic chat and email support",
//   ];

//   return (
//     <>
//       <div className="my-3">
//         <div className="text-center my-6">
//           <h1 className="text-3xl font-semibold mb-2">Pricing Plans</h1>
//           <span className="text-subtitle">
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium
//             quibusdam praesentium voluptatibus!
//           </span>
//         </div>
//         <div className="flex justify-center">
//           <div className="flex bg-sidebar gap-1 p-2 rounded-lg">
//             <div
//               onClick={() => handleParams("monthly")}
//               className={`transition duration-150 ease-in-out font-semibold text-sm py-2 px-3 rounded cursor-pointer ${
//                 pricing == "monthly"
//                   ? "bg-white shadow"
//                   : "active:bg-white/[0.5] hover:bg-white hover:shadow"
//               }`}
//             >
//               Monthly Pricing
//             </div>
//             <div
//               onClick={() => handleParams("annual")}
//               className={`transition duration-150 ease-in-out font-semibold text-sm py-2 px-3 rounded cursor-pointer ${
//                 pricing == "annual"
//                   ? "bg-white shadow"
//                   : "active:bg-white/[0.5] hover:bg-white hover:shadow"
//               }`}
//             >
//               Annual Pricing
//             </div>
//           </div>
//         </div>
//         {type == "brand" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-6 gap-3 grid-flow-col">
//             <UpgradeOptionsCard
//               tier="Basic"
//               price={pricing == "monthly" ? "$49.99" : "$599.88"}
//               features={[
//                 "Access to Tier 1 Athletes",
//                 "Athlete Information & Contact Info",
//                 "Athlete Ratings and Social Media Reports",
//                 "Promotion of Products via BNDLS App & Boundless Ventures social media accounts",
//               ]}
//             />
//             <UpgradeOptionsCard
//               tier="Performance"
//               price={pricing == "monthly" ? "$99.99" : "$1199.99"}
//               withPopular={true}
//               features={[
//                 "Access to Tier 1 & 2 Athletes",
//                 "Athlete Information & Contact Info",
//                 "Athlete Ratings and Social Media Reports",
//                 "Promotion of Products via BNDLS App & Boundless Ventures social media accounts",
//                 "15 minute consultation once per month with Boundless Ventures marketing and management staff ",
//               ]}
//             />
//             <UpgradeOptionsCard
//               tier="Advanced"
//               price={pricing == "monthly" ? "$149.99" : "$1799.88"}
//               features={[
//                 "Full access to all athletes accross all 3 Tiers",
//                 "Athlete Information & Contact Info",
//                 "Create any deals you wan",
//                 "Athlete Ratings and Social Media Reports",
//                 "Promotion of Products via BNDLS App & Boundless Ventures social media accounts",
//                 "15 minute consultation once per month with Boundless Ventures marketing and management staff ",
//               ]}
//             />
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 my-6 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
//             <UpgradeOptionsCard
//               withTeam={true}
//               tier="Tier 1"
//               price={pricing == "monthly" ? "$99.99" : "$1199.88"}
//               features={features}
//             />
//             <UpgradeOptionsCard
//               withTeam={true}
//               tier="Tier 2"
//               price={pricing == "monthly" ? "$149.99" : "$1799.88"}
//               features={features}
//               withPopular
//             />
//             <UpgradeOptionsCard
//               withTeam={true}
//               tier="Tier 3"
//               price={pricing == "monthly" ? "$199.99" : "$2399.88"}
//               features={features}
//             />
//             <UpgradeOptionsCard
//               withTeam={true}
//               tier="Organization Wide"
//               price="Contact Us"
//               features={features}
//             />
//           </div>
//         )}
//         <div className="bg-sidebar pt-24 pb-12 rounded">
//           <div className="text-center my-6">
//             <h1 className="text-3xl font-semibold mb-2">
//               Frequently asked questions
//             </h1>
//             <span className="text-subtitle">
//               Everything you need to know about the product and billing.
//             </span>
//           </div>
//           <div className="lg:w-[60%] md:w-[75%] w-full px-3 mx-auto">
//             <Accordion>
//               <Accordion.Item
//                 title="Is there a free trial available?"
//                 text="Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
//               />
//               <Accordion.Item
//                 title="Is there a free trial available?"
//                 text="Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
//               />
//               <Accordion.Item
//                 title="Is there a free trial available?"
//                 text="Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
//               />
//               <Accordion.Item
//                 title="Is there a free trial available?"
//                 text="Yes, you can try us for free for 30 days. If you want, we’ll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible."
//               />
//             </Accordion>
//           </div>
//           <div className="bg-white my-6 mt-16">
//             <div className="flex justify-center py-12">
//               <div className="text-center">
//                 {/* <div className="mb-6">
//                   <div className="flex justify-center">
//                     <div className="relative">
//                       <img
//                         className="w-12 h-12 absolute top-3 -ml-8 z-1 rounded-full"
//                         src={avatar}
//                         alt="Rounded avatar"
//                       />
//                       <img
//                         className="w-16 h-16 relative border-white border-2 z-20 rounded-full"
//                         src={avatar}
//                         alt="Rounded avatar"
//                       />
//                       <img
//                         className="w-12 h-12 absolute top-3 ml-12 z-1 rounded-full"
//                         src={avatar}
//                         alt="Rounded avatar"
//                       />
//                     </div>
//                   </div>
//                 </div> */}
//                 <h3 className="font-semibold text-2xl mb-2">
//                   Still have questions?
//                 </h3>
//                 <span className="text-subtitle">
//                   Can’t find the answer you’re looking for? Please chat to our
//                   friendly team.
//                 </span>
//                 <div className="py-6 md:w-[20%] sm:w-[30%] w-[40%] mx-auto">
//                   <Button className="text-sm py-2">Get in Touch</Button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UpgradeOptions;
