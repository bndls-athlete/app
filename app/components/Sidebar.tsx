"use client";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  faSearch,
  faGear,
  faSignOut,
  faUser,
  faLightbulb,
  faCreditCard,
  faBookmark,
  faCircleQuestion,
  faPlus,
  faList,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "./Button";
import { EntityType } from "@/types/entityTypes";
import { useAthleteCard } from "@/context/AthleteCardProvider";
import { useEffect, useState } from "react";
import useUserType from "@/hooks/useUserType";
import { useAthleteData } from "@/hooks/useAthleteData";
import { useBrandData } from "@/hooks/useBrandData";

const SidebarTab: React.FC<{
  path: string;
  label: string;
  icon: any;
  active: boolean;
}> = ({ path, label, icon, active }) => {
  return (
    <Link href={path}>
      <li
        className={`my-2 transition-all duration-150 ease-in-out cursor-pointer hover:bg-primary hover:text-white p-2 rounded-lg flex items-center ${
          active ? "bg-primary text-white font-bold" : "text-gray-900"
        }`}
      >
        <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-2" />
        <span className="truncate">{label}</span>
      </li>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();
  const { invalidateAthlete, athlete } = useAthleteData();
  const { brand, invalidateBrand } = useBrandData();

  const { type } = useUserType();

  const links = [
    {
      path: `/${type}/discovery`,
      label: "Discovery",
      icon: faSearch,
      condition: type === EntityType.Company,
    },
    {
      path: `/${type}/jobs`,
      label: "Opportunities",
      icon: faLightbulb,
      condition: type !== EntityType.Company,
    },
    {
      path: `/${type}/create-job`,
      label: "Create Job",
      icon: faPencilAlt,
      condition: type == EntityType.Company,
    },
    {
      path: `/${type}/my-jobs`,
      label: "My Jobs",
      icon: faList,
      condition: type == EntityType.Company,
    },
    {
      path: `/${type}/plan`,
      label: "Plans & Billing",
      icon: faCreditCard,
      condition: true,
    },
    {
      path: `/${type}/saved-athletes`,
      label: "Saved Athlete Cards",
      icon: faBookmark,
      condition: type === EntityType.Company,
    },
  ];

  const title = () => {
    if (type === EntityType.Athlete) return "BNDLS Athlete";
    if (type === EntityType.Company) return "BNDLS Brand";
  };

  const { toggleAthleteCardVisible } = useAthleteCard();

  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-16 bg-white border-b border-gray-200 px-4 0 flex items-center justify-between lg:hidden">
        <h6 className="font-bold">BNDLS</h6>
        <FontAwesomeIcon
          icon={isOpen ? faTimes : faBars}
          className="w-6 h-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>

      <div
        className={`fixed top-16 lg:top-0 left-0 h-[calc(100%-4rem)] lg:h-full bg-sidebar lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-[-100%]"
        } transition-transform duration-300 ease-in-out w-[280px] flex flex-col`}
      >
        <div className="px-5 py-6 flex-grow overflow-y-auto">
          <h6 className="font-bold  pb-3">{title()}</h6>
          <ul>
            {links.map((link, index) => {
              if (link.condition) {
                return (
                  <SidebarTab
                    key={index}
                    path={link.path}
                    label={link.label}
                    icon={link.icon}
                    active={pathname === link.path}
                  />
                );
              }
            })}
            {type !== EntityType.Company && (
              <li
                className="my-2 transition-all duration-150 ease-in-out cursor-pointer hover:bg-primary hover:text-white p-2 rounded-lg flex items-center"
                onClick={toggleAthleteCardVisible}
              >
                <FontAwesomeIcon icon={faUser} className="w-5 h-5 mr-2" />
                <span className="truncate">View your Athlete Card</span>
              </li>
            )}
          </ul>
        </div>
        <div className="px-5 py-4">
          <ul>
            <SidebarTab
              path="/help-center"
              label="Help Center"
              icon={faCircleQuestion}
              active={false}
            />
            <SidebarTab
              path={`/${type}/settings`}
              label="Settings"
              icon={faGear}
              active={`/${type}/settings` === pathname}
            />
          </ul>
          <hr className="my-2 border-gray-900" />
          <div className="flex items-center p-2 gap-2">
            {/* <div className="transition duration-150 ease-in-out cursor-pointer flex items-center p-2 gap-2 hover:bg-primary hover:text-white rounded-lg"> */}
            <img
              className="w-10 h-10 object-cover rounded-full"
              src={
                type === EntityType.Athlete && athlete?.profilePicture
                  ? athlete.profilePicture
                  : type === EntityType.Company && brand?.profilePicture
                  ? brand.profilePicture
                  : "/images/Avatar.webp"
              }
              alt="Rounded avatar"
            />
            {user && (
              <div className="flex items-center">
                <div
                  className="flex flex-col flex-grow"
                  style={{ maxWidth: "calc(100% - 40px)" }}
                >
                  {" "}
                  {/* Set a maximum width */}
                  <h6 className="font-semibold truncate">
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim()}
                  </h6>
                  <span className="truncate">
                    {user.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
            )}
          </div>
          <Button
            className="my-2 w-full"
            onClick={async () => {
              if (window.confirm("Are you sure you want to logout?")) {
                if (type === EntityType.Athlete) {
                  invalidateAthlete();
                  invalidateBrand();
                }
                await signOut();
              }
            }}
          >
            Logout{" "}
            <FontAwesomeIcon
              icon={faSignOut}
              className="flex-shrink-0 w-5 h-5 ml-2"
            />
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
