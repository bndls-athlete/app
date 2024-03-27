"use client";

import React from "react";
import MyPlan from "./components/MyPlan";
// import Billing from "./components/Billing";
import UpgradeOptions from "./components/UpgradeOptions";
import Breadcrumb from "@/app/components/Breadcrumb";
import Select from "@/app/components/Select";
import { faCreditCard } from "@fortawesome/free-regular-svg-icons";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import Link from "next/link";

const Plan = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "my-plan";
  const router = useRouter();

  const links = [
    {
      path: `/${type}/plan/?menu=my-plan`,
      label: "My Plan",
      condition: true,
    },
    // {
    //   path: `/${type}/plan/?menu=billing`,
    //   label: "Billing",
    //   condition: true,
    // },
    {
      path: `/${type}/plan/?menu=upgrade-options`,
      label: "Upgrade Options",
      condition: true,
    },
  ];

  const componentActive = () => {
    switch (menu) {
      case "my-plan":
        return <MyPlan />;
      // case "billing":
      //   return <Billing />;
      case "upgrade-options":
        return <UpgradeOptions />;
      default:
        return null;
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <>
      <Breadcrumb menu="Plans & Billing" icon={faCreditCard} />
      <div className="my-6 text-dark">
        <h1 className="text-3xl font-semibold">Plans & Billing</h1>
        <div className="mt-4">
          <div className="hidden lg:block">
            <div className="join join-horizontal">
              {links.map((link) =>
                link.condition ? (
                  <Link
                    key={link.label}
                    className={`btn ${
                      menu === link.label.toLowerCase().replace(/ /g, "-")
                        ? "btn-active btn-primary"
                        : "btn-white"
                    } join-item`}
                    href={link.path}
                  >
                    {link.label}
                  </Link>
                ) : null
              )}
            </div>
          </div>
          <div className="lg:hidden">
            <Select
              onChange={handleSelectChange}
              value={`/${type}/plan/?menu=${menu}`}
            >
              {links.map(
                (link) =>
                  link.condition && (
                    <option key={link.label} value={link.path}>
                      {link.label}
                    </option>
                  )
              )}
            </Select>
          </div>
        </div>
        {componentActive()}
      </div>
    </>
  );
};

export default Plan;
