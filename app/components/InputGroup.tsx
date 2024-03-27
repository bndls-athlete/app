"use client";

import React, { forwardRef, InputHTMLAttributes } from "react";

type InputGroupProps = InputHTMLAttributes<HTMLInputElement> & {
  withLabel?: string;
  desc?: string;
  error?: string;
};

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  ({ withLabel, desc, error, ...props }, ref) => {
    return (
      <div className="flex items-center w-full">
        {withLabel && (
          <button className="btn rounded-l-lg rounded-r-none shrink-0 flex-none px-2 sm:px-4">
            {withLabel}
          </button>
        )}
        <input
          className="input input-bordered rounded-l-none rounded-r-lg flex-1 min-w-0"
          {...props}
          ref={ref}
        />
        {error && <p className="text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

export default InputGroup;
