"use client";

import { getTypeFromPathname } from "@/helpers/getTypeFromPathname";
import {
  faSearch,
  faGear,
  faSignOut,
  faUser,
  faLightbulb,
  faCreditCard,
  faBookmark,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarTab: React.FC<{
  path: string;
  label: string;
  icon: any;
  active: boolean;
}> = ({ path, label, icon, active }) => {
  return (
    <Link href={`${path}`}>
      <li
        className={`my-2 transition-all duration-150 ease-in-out cursor-pointer hover:bg-primary hover:text-white p-2 rounded-lg flex items-center ${
          active ? "bg-primary text-white font-bold" : "text-gray-900"
        }`}
      >
        <FontAwesomeIcon icon={icon} className="w-5 h-5 mr-2" />
        <span className="text-[14px] truncate">{label}</span>
      </li>
    </Link>
  );
};

const Sidebar = () => {
  const pathname = usePathname();
  const type = getTypeFromPathname(pathname);

  const links = [
    {
      path: `/${type}/discovery`,
      label: "Discovery",
      icon: faSearch,
      condition: type === "brand",
    },
    {
      path: `/${type}/opportunities`,
      label: type === "brand" ? "Opportunities" : "My Applied Opportunities",
      icon: faLightbulb,
      condition: true,
    },
    {
      path: `/${type}/plan`,
      label: "Plans & Billing",
      icon: faCreditCard,
      condition: true,
    },
    {
      path: `/${type}/athlete-card`,
      label: "View your Athlete Card",
      icon: faUser,
      condition: type !== "brand",
    },
    {
      path: `/${type}/saved-athlete`,
      label: "Saved Athlete Cards",
      icon: faBookmark,
      condition: type === "brand",
    },
  ];

  const title = () => {
    if (type === "athlete") return "BNDLS Athlete";
    if (type === "brand") return "BNDLS Brand";
    if (type === "team") return "BNDLS Team";
  };

  console.log(pathname);

  return (
    <div className="fixed top-0 left-0 h-full bg-sidebar lg:translate-x-0 translate-x-[-100%] transition-transform duration-300 ease-in-out w-[280px] flex flex-col">
      <div className="px-5 py-6 flex-grow overflow-y-auto">
        <h6 className="font-bold text-lg pb-3">{title()}</h6>
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
        </ul>
      </div>
      <div className="px-5 py-4">
        <ul>
          <SidebarTab
            path="help-center"
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
        <div className="transition duration-150 ease-in-out cursor-pointer flex items-center p-2 gap-2 hover:bg-primary hover:text-white rounded-lg">
          <img
            className="w-10 h-10 rounded-full"
            src="/images/Avatar.webp"
            alt="Rounded avatar"
          />
          <div className="flex flex-col">
            <h6 className="font-semibold text-sm">Olivia Rhye</h6>
            <span className="text-xs">olivia@untitledui.com</span>
          </div>
          <FontAwesomeIcon icon={faSignOut} className="ml-auto" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
