"use client";

import React, { createContext, useContext, useState } from "react";

type AthleteCardContextType = {
  isAthleteCardVisible: boolean;
  toggleAthleteCardVisible: () => void;
  athleteUserId: string | null;
  setathleteUserId: (id: string | null) => void;
  showAthleteCard: (id: string) => void;
};

const AthleteCardContext = createContext<AthleteCardContextType | undefined>(
  undefined
);

export const AthleteCardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAthleteCardVisible, setIsAthleteCardVisible] = useState(false);
  const [athleteUserId, setathleteUserId] = useState<string | null>(null);

  const toggleAthleteCardVisible = () => {
    setIsAthleteCardVisible((prevVisible) => !prevVisible);
  };

  const showAthleteCard = (id: string) => {
    if (id === athleteUserId && isAthleteCardVisible) {
      setIsAthleteCardVisible(false);
    } else {
      setathleteUserId(id);
      setIsAthleteCardVisible(true);
    }
  };

  return (
    <AthleteCardContext.Provider
      value={{
        isAthleteCardVisible,
        toggleAthleteCardVisible,
        athleteUserId,
        setathleteUserId,
        showAthleteCard,
      }}
    >
      {children}
    </AthleteCardContext.Provider>
  );
};

export const useAthleteCard = () => {
  const context = useContext(AthleteCardContext);
  if (!context) {
    throw new Error(
      "useAthleteCard must be used within an AthleteCardProvider"
    );
  }
  return context;
};
