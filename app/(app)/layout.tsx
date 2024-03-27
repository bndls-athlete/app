"use client";

import { EntityType } from "@/types/entityTypes";
import AthelteCard from "../components/AthleteCard";
import Sidebar from "../components/Sidebar";
import { useUser } from "@clerk/nextjs";
import { useAthleteCardVisibility } from "@/context/AthleteCardVisibilityProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useUser();
  const { isAthleteCardVisible } = useAthleteCardVisibility();

  return (
    <div className="flex h-screen">
      {" "}
      <Sidebar />
      <div
        className={`flex-1 overflow-y-auto lg:ml-[280px] transition-all duration-300 ease-in-out ${
          isAthleteCardVisible ? "lg:mr-[360px]" : ""
        }`}
      >
        <div className="p-4 lg:p-8 mt-16 lg:mt-0 h-full">{children}</div>
        {(user?.publicMetadata.userType === EntityType.Athlete ||
          user?.publicMetadata.userType === EntityType.Team) && <AthelteCard />}
      </div>
    </div>
  );
}
