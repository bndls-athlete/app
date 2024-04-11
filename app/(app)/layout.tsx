"use client";

import { AthleteCard } from "../components/AthleteCard";
import Sidebar from "../components/Sidebar";
import { useAthleteCard } from "@/context/AthleteCardProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAthleteCardVisible } = useAthleteCard();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div
        className={`flex-1 overflow-y-auto lg:ml-[280px] transition-all duration-300 ease-in-out ${
          isAthleteCardVisible ? "lg:mr-[360px]" : ""
        }`}
      >
        <div className="p-8 mt-16 lg:mt-0">{children}</div>
      </div>
      {isAthleteCardVisible && (
        <div className="fixed top-0 right-0 w-[360px] h-full overflow-y-auto">
          <AthleteCard />
        </div>
      )}
    </div>
  );
}
