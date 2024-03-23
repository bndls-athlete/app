"use client";

import React, { createContext, useContext, useState } from "react";

type AthleteCardVisibilityContextType = {
  isAthleteCardVisible: boolean;
  toggleAthleteCardVisible: () => void;
};

const AthleteCardVisibilityContext = createContext<
  AthleteCardVisibilityContextType | undefined
>(undefined);

export const AthleteCardVisibilityProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isAthleteCardVisible, setIsAthleteCardVisible] = useState(false);

  const toggleAthleteCardVisible = () => {
    setIsAthleteCardVisible((prevVisible) => !prevVisible);
  };

  return (
    <AthleteCardVisibilityContext.Provider
      value={{ isAthleteCardVisible, toggleAthleteCardVisible }}
    >
      {children}
    </AthleteCardVisibilityContext.Provider>
  );
};

export const useAthleteCardVisibility = () => {
  const context = useContext(AthleteCardVisibilityContext);
  if (!context) {
    throw new Error(
      "useAthleteCardVisibility must be used within an AthleteCardVisibilityProvider"
    );
  }
  return context;
};
