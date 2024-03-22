import React from "react";

export const monthOptions = (): JSX.Element[] => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month) => (
    <option key={month} value={month}>
      {month}
    </option>
  ));
};
