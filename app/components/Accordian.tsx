"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useRef, ReactNode } from "react";

interface AccordionProps {
  children: ReactNode;
}

const Accordion = ({ children }: AccordionProps) => {
  return <>{children}</>;
};

interface ItemProps {
  title: string;
  text: string;
}

const Item = ({ title, text }: ItemProps) => {
  const child = useRef<HTMLDivElement>(null);
  const plus = useRef<HTMLSpanElement>(null);
  const minus = useRef<HTMLSpanElement>(null);

  const handleChild = () => {
    if (child.current && plus.current && minus.current) {
      if (child.current.className.includes("hidden")) {
        child.current.className = child.current.className.replaceAll(
          "hidden",
          ""
        );
        plus.current.className += " hidden";
        minus.current.className = minus.current.className.replaceAll(
          "hidden",
          ""
        );
      } else {
        child.current.className += " hidden";
        minus.current.className += " hidden";
        plus.current.className = plus.current.className.replaceAll(
          "hidden",
          ""
        );
      }
    }
  };

  return (
    <>
      <div className="border-b border-black w-full py-3">
        <div
          onClick={handleChild}
          className="h-full transition duration-150 ease-in flex justify-between cursor-pointer hover:bg-black/[0.03] active:bg-black/[0.02] py-2 px-2 rounded"
        >
          <span className="font-semibold">{title}</span>
          <span
            ref={plus}
            className="border border-gray-500 text-gray-500 rounded-full px-2 py-1 text-sm font-semibold"
          >
            <FontAwesomeIcon icon={faPlus} />
          </span>
          <span
            ref={minus}
            className="border border-gray-500 text-gray-500 rounded-full px-2 py-1 text-sm font-semibold hidden"
          >
            <FontAwesomeIcon icon={faMinus} />
          </span>
        </div>
        <div
          ref={child}
          className="transition-all duration-150 fade text-gray-500 text-sm px-6 hidden mt-2"
        >
          <p>{text}</p>
        </div>
      </div>
    </>
  );
};

Accordion.Item = Item;

export default Accordion;
