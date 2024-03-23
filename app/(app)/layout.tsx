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
    <div className="flex">
      <Sidebar />
      <div
        className={`flex-1 lg:ml-[280px] transition-all duration-300 ease-in-out ${
          isAthleteCardVisible ? "lg:mr-[360px]" : ""
        }`}
      >
        {/* Set a maximum width for large screens */}
        <div className="p-4 lg:p-8 mt-16 lg:mt-0">{children}</div>

        {(user?.publicMetadata.userType === EntityType.Athlete ||
          user?.publicMetadata.userType === EntityType.Team) && <AthelteCard />}
      </div>
    </div>
  );
}
