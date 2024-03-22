import React, { forwardRef, ReactNode, ChangeEvent } from "react";

type SelectProps = {
  children: ReactNode;
  withLabel?: string;
  desc?: string;
  error?: string;
  id?: string;
  className?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, withLabel, desc, error, value, className, ...props }, ref) => {
    const selectClassName = `select select-bordered w-full text-sm ${
      className || ""
    }`;

    return (
      <div className="form-control">
        {withLabel && (
          <label htmlFor={props.id ?? ""} className="label">
            <span className="label-text">{withLabel}</span>
          </label>
        )}
        <select {...props} value={value} className={selectClassName} ref={ref}>
          {children}
        </select>
        {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

export default Select;
