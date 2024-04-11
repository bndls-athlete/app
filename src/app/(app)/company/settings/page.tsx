"use client";

import React from "react";
import BrandAccountSettings from "./components/BrandAccountSettings";
import SocialMedia from "./components/BrandSocialMedia";
import Security from "./components/Security";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { EntityType } from "@/types/entityTypes";
import Select from "@/app/components/Select";
import { useRouter } from "next/navigation";
import useUserType from "@/hooks/useUserType";
import { useBrandData } from "@/hooks/useBrandData";

const Settings = () => {
  const { type } = useUserType();
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "account-settings";
  const router = useRouter();

  const { brand, isLoading, error } = useBrandData();

  const links = [
    {
      path: `/${type}/settings/?menu=account-settings`,
      label: "Account Settings",
      condition: true,
    },
    {
      path: `/${type}/settings/?menu=athlete-information`,
      label: "Athlete Information",
      condition: type !== EntityType.Company,
    },
    // {
    //   path: `/${type}/settings/?menu=business-information`,
    //   label: "Business Information",
    //   condition: type === EntityType.Company,
    // },
    {
      path: `/${type}/settings/?menu=social-media`,
      label: "Social Media",
      condition: true,
    },
    {
      path: `/${type}/settings/?menu=security`,
      label: "Security",
      condition: true,
    },
  ];

  const componentActive = () => {
    if (!brand) {
      return null;
    }
    switch (menu) {
      case "account-settings":
        return <BrandAccountSettings brand={brand} />;
      // case "business-information":
      //   return <BusinessInformation />;
      case "social-media":
        return <SocialMedia brand={brand} />;
      case "security":
        return <Security />;
      default:
        return null;
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <>
      <div className="my-4 text-dark">
        <h1 className="text-3xl font-semibold">Brand Settings</h1>
        <div className="mt-4">
          <div className="hidden sm:block">
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
          <div className="sm:hidden">
            <Select
              onChange={handleSelectChange}
              value={`/${type}/settings/?menu=${menu}`}
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
        {isLoading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="animate-spin" size={16} />
          </div>
        ) : (
          <>
            <div>{componentActive()}</div>
          </>
        )}
      </div>
    </>
  );
};

export default Settings;
