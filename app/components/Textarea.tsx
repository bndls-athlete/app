"use client";

import React, { forwardRef, TextareaHTMLAttributes, ReactNode } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  withLabel?: string;
  desc?: string;
  error?: string;
  children?: ReactNode;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ children, withLabel, desc, error, ...props }, ref) => {
    const textareaClassName = `textarea textarea-bordered text-base ${
      props.className ?? ""
    }`;

    return (
      <div className="form-control">
        {withLabel && (
          <label htmlFor={props.id ?? ""} className="label">
            <span className="label-text">{withLabel}</span>
          </label>
        )}
        <textarea {...props} className={textareaClassName} ref={ref}>
          {children}
        </textarea>
        {desc && <p className=" text-neutral-400 mt-1">{desc}</p>}
        {error && <p className=" text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

export default Textarea;
