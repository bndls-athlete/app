import React, { forwardRef, InputHTMLAttributes } from "react";

type InputGroupProps = InputHTMLAttributes<HTMLInputElement> & {
  withLabel?: string;
  desc?: string;
  error?: string;
};

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  ({ withLabel, desc, error, ...props }, ref) => {
    return (
      <div>
        <div className="join block">
          <button className="btn join-item rounded-l-lg">{withLabel}</button>
          <input
            className="input input-bordered text-sm join-item"
            {...props}
            ref={ref}
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

export default InputGroup;
