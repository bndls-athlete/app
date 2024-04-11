"use client";

import React, { FC, HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card: FC<CardProps> & {
  Header: FC<CardProps>;
  Body: FC<CardProps>;
  Footer: FC<CardProps>;
} = ({ children, className, ...props }) => {
  return (
    <div className={`border p-5 rounded-xl py-6 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const Header: FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={`font-semibold  mb-2 ${className || ""}`} {...props}>
      {children}
    </div>
  );
};

const Body: FC<CardProps> = ({ children, ...props }) => {
  return (
    <div className="my-6" {...props}>
      {children}
    </div>
  );
};

const Footer: FC<CardProps> = ({ children, ...props }) => {
  return (
    <div className="my-2" {...props}>
      {children}
    </div>
  );
};

Card.Header = Header;
Card.Body = Body;
Card.Footer = Footer;

export default Card;
