"use client";

import { EntityType } from "@/types/entityTypes";
import AthelteCard from "../components/AthleteCard";
import Sidebar from "../components/Sidebar";
import { useAthleteCardVisibility } from "@/context/AthleteCardVisibilityProvider";
import useUserType from "@/hooks/useUserType";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { type } = useUserType();
  const { isAthleteCardVisible } = useAthleteCardVisibility();

  return (
    <div className="flex h-screen ">
      <Sidebar />
      <div
        className={`flex-1 overflow-y-auto lg:ml-[280px] transition-all duration-300 ease-in-out pb-12 ${
          isAthleteCardVisible ? "lg:mr-[360px]" : ""
        }`}
      >
        <div className="p-4 lg:p-8 mt-16 lg:mt-0">{children}</div>
        {(type === EntityType.Athlete || type === EntityType.Team) && (
          <AthelteCard />
        )}
      </div>
    </div>
  );
}
