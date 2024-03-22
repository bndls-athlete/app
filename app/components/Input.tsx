import React, { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  withLabel?: string;
  desc?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ withLabel, desc, error, className, type, ...rest }, ref) => {
    const inputClass = `input input-bordered w-full text-sm ${className || ""}`;

    return (
      <div className="form-control">
        {withLabel && (
          <label htmlFor={rest.id ?? ""} className="label">
            <span className="label-text">{withLabel}</span>
          </label>
        )}
        <input {...rest} ref={ref} type={type} className={inputClass} />
        {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        {error && <small className="text-xs text-red-500 mt-1">{error}</small>}
      </div>
    );
  }
);

export default Input;