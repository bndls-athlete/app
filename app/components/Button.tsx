"use client";

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  theme?: "primary" | "light" | "secondary" | "outline-primary";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  theme = "primary",
  ...props
}) => {
  const themes = {
    light: "btn btn-outline text-black bg-white border border-gray-300",
    secondary: "btn btn-secondary",
    "outline-primary": "btn btn-outline btn-primary",
    primary: "btn btn-primary",
  };

  const variant = themes[theme] || themes.primary;

  return (
    <button {...props} className={`${variant} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
