"use client";

import AccountSettings from "../components/settings/AccountSettings";
import AthleteInformation from "../components/settings/AthleteInformation";
import SocialMedia from "../components/settings/SocialMedia";
import Security from "../components/settings/Security";
import BusinessInformation from "../components/settings/BusinessInformation";
import { usePathname, useSearchParams } from "next/navigation";
import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import Link from "next/link";

const Settings = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);
  const searchParams = useSearchParams();
  const menu = searchParams.get("menu") || "account-settings";

  const links = [
    {
      path: `/${type}/settings/?menu=account-settings`,
      label: "Account Settings",
      condition: true,
    },
    {
      path: `/${type}/settings/?menu=athlete-information`,
      label: "Athlete Information",
      condition: type !== "brand",
    },
    {
      path: `/${type}/settings/?menu=business-information`,
      label: "Business Information",
      condition: type === "brand",
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
        return <AccountSettings />;
      case "athlete-information":
        return <AthleteInformation />;
      case "business-information":
        return <BusinessInformation />;
      case "social-media":
        return <SocialMedia />;
      case "security":
        return <Security />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="my-6 text-dark">
        <h1 className="text-3xl font-semibold">Settings Athlete</h1>
        <div className="mt-4">
          <div className="join join-vertical lg:join-horizontal">
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
        {componentActive()}
      </div>
    </>
  );
};

export default Settings;
