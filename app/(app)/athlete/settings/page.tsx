"use client";

import React from "react";
import AccountSettings from "./components/AccountSettings";
import AthleteInformation from "./components/AthleteInformation";
import SocialMedia from "./components/SocialMedia";
import Security from "./components/Security";
import BusinessInformation from "./components/BusinessInformation";
import { usePathname, useSearchParams } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { EntityType } from "@/types/entityTypes";
import Select from "@/app/components/Select";
import { useRouter } from "next/navigation";
import { useAthleteData } from "@/hooks/useAthleteData";

const Settings = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "account-settings";
  const router = useRouter();

  const { athlete, isLoading, error } = useAthleteData();

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
    {
      path: `/${type}/settings/?menu=business-information`,
      label: "Business Information",
      condition: type === EntityType.Company,
    },
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
    switch (menu) {
      case "account-settings":
        return <AccountSettings athlete={athlete!} />;
      case "athlete-information":
        return <AthleteInformation athlete={athlete!} />;
      case "business-information":
        return <BusinessInformation />;
      case "social-media":
        return <SocialMedia athlete={athlete!} />;
      case "security":
        return <Security />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" size={16} />
      </div>
    );
  }

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(e.target.value);
  };

  return (
    <>
      <div className="my-6 text-dark">
        <h1 className="text-3xl font-semibold">Settings Athlete</h1>
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
        {componentActive()}
      </div>
    </>
  );
};

export default Settings;
