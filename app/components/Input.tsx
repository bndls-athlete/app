"use client";

import React, { forwardRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  withLabel?: string;
  desc?: string;
  error?: string;
  passwordHide?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ withLabel, desc, error, className, type, passwordHide, ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputClass = `input input-bordered w-full ${className || ""}`;

    return (
      <div className="form-control">
        {withLabel && (
          <label htmlFor={rest.id ?? ""} className="label">
            <span className="label-text">{withLabel}</span>
          </label>
        )}
        <div className={`relative ${passwordHide ? "flex items-center" : ""}`}>
          <input
            {...rest}
            ref={ref}
            type={passwordHide && showPassword ? "text" : type}
            className={inputClass}
          />
          {passwordHide && (
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="absolute inset-y-0 right-3 my-auto h-full flex items-center w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
        </div>
        {desc && <p className=" text-gray-500 mt-1">{desc}</p>}
        {error && <p className=" text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

export default Input;
